/**
 * INFINITY Spatial Computer // WristCompanionDock.ts
 * Derived from Post-It (Hack the North 2025) SphereController Architecture.
 *
 * Implements:
 * 1. Non-dominant hand (left wrist) anatomical micro-orb tracking.
 * 2. Palm-up glance gating: active only when leftHand.isTracked() && leftHand.isFacingCamera().
 * 3. Dual-state transition: 0.35x wrist micro-orb <-> 1.0x world-space study copilot.
 * 4. Jitter-free exponential position smoothing (alpha = 0.25) and camera billboarding.
 * 5. Smooth undock-to-world on pinch/invocation, and return-to-wrist on dismissal.
 */

export const DEFAULT_WRIST_MIN_SCALE = 0.35;
export const DEFAULT_WRIST_FULL_SCALE = 1.0;
export const DEFAULT_HAND_OFFSET_CM = 4.0;
export const DEFAULT_LERP_SPEED = 0.25;

@component
export class WristCompanionDock extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">WristCompanionDock – Hand-Anchored Holographic AI Orb</span>')
  @ui.separator

  @input
  @hint("SceneObject representing the AI Assistant Core")
  aiCoreObject: SceneObject;

  @input
  @hint("Scale factor when docked on the wrist")
  minScale: number = DEFAULT_WRIST_MIN_SCALE;

  @input
  @hint("Scale factor when active in world space")
  fullScale: number = DEFAULT_WRIST_FULL_SCALE;

  @input
  @hint("Offset in cm along index tip right vector from pinky knuckle")
  handOffsetCm: number = DEFAULT_HAND_OFFSET_CM;

  @input
  @hint("Exponential lerp factor per frame (0.01 - 1.0)")
  lerpSpeed: number = DEFAULT_LERP_SPEED;

  private isDockedToWrist: boolean = true;
  private menuHand: any = null;
  private cameraObj: SceneObject | null = null;
  private worldActivePos: vec3 = new vec3(-2.0, -8.5, -67.5);

  onAwake(): void {
    if (!this.aiCoreObject) {
      this.aiCoreObject = this.getSceneObject();
    }

    // Resolve SIK hand provider
    this.initHandProvider();

    // Export global bridge bindings
    (global as any).wristCompanionDock = this.dockToWrist.bind(this);
    (global as any).wristCompanionUndock = this.undockToWorld.bind(this);
    (global as any).wristCompanionToggle = this.toggleDock.bind(this);
    (global as any).wristCompanionIsDocked = () => this.isDockedToWrist;

    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
  }

  private onStart(): void {
    this.resolveCamera();
    if (this.isDockedToWrist && this.aiCoreObject) {
      this.aiCoreObject.getTransform().setWorldScale(vec3.one().uniformScale(this.minScale));
    }
  }

  private initHandProvider(): void {
    try {
      if (typeof (global as any).SIK !== "undefined" && (global as any).SIK.HandInputData) {
        this.menuHand = (global as any).SIK.HandInputData.getHand("left");
      }
    } catch (_e) {
      this.menuHand = null;
    }
  }

  private resolveCamera(): void {
    if ((globalThis as any).findObjectByName) {
      const camObj = (globalThis as any).findObjectByName("Camera Object") || (globalThis as any).findObjectByName("Camera");
      if (camObj) {
        this.cameraObj = camObj;
        return;
      }
    }
    const scene = (global as any).scene;
    if (scene && typeof scene.getRootObjectsCount === "function") {
      const count = scene.getRootObjectsCount();
      for (let i = 0; i < count; i++) {
        const root = scene.getRootObject(i);
        if (root && (root.name === "Camera Object" || root.name === "Camera")) {
          this.cameraObj = root;
          return;
        }
      }
    }
  }

  public isDocked(): boolean {
    return this.isDockedToWrist;
  }

  public dockToWrist(): void {
    this.isDockedToWrist = true;
    if (this.aiCoreObject) {
      this.aiCoreObject.getTransform().setWorldScale(vec3.one().uniformScale(this.minScale));
    }
    print("[INFINITY COMPANION] AI Assistant docked to wrist.");
  }

  public undockToWorld(targetWorldPos?: vec3): void {
    this.isDockedToWrist = false;
    if (targetWorldPos) {
      this.worldActivePos = targetWorldPos;
    }
    if (this.aiCoreObject) {
      this.aiCoreObject.enabled = true;
      this.aiCoreObject.getTransform().setWorldPosition(this.worldActivePos);
      this.aiCoreObject.getTransform().setWorldScale(vec3.one().uniformScale(this.fullScale));
    }
    print("[INFINITY COMPANION] AI Assistant undocked to world space: " + this.worldActivePos.toString());
  }

  public toggleDock(targetWorldPos?: vec3): void {
    if (this.isDockedToWrist) {
      this.undockToWorld(targetWorldPos);
    } else {
      this.dockToWrist();
    }
  }

  private onUpdate(): void {
    if (!this.aiCoreObject) return;

    if (!this.menuHand) {
      this.initHandProvider();
    }

    if (this.isDockedToWrist) {
      // 1. Hand tracking and glance gating (Post-It pattern)
      if (!this.menuHand || !this.menuHand.isTracked()) {
        this.aiCoreObject.enabled = false;
        return;
      }

      if (typeof this.menuHand.isFacingCamera === "function" && !this.menuHand.isFacingCamera()) {
        this.aiCoreObject.enabled = false;
        return;
      }

      this.aiCoreObject.enabled = true;

      // 2. Anatomical anchor: pinky knuckle + index tip right * offset
      let handPos: vec3;
      if (this.menuHand.pinkyKnuckle && this.menuHand.pinkyKnuckle.position) {
        handPos = this.menuHand.pinkyKnuckle.position;
      } else if (this.menuHand.wrist && this.menuHand.wrist.position) {
        handPos = this.menuHand.wrist.position;
      } else {
        return;
      }

      let handRight: vec3 = vec3.right();
      if (this.menuHand.indexTip && this.menuHand.indexTip.right) {
        handRight = this.menuHand.indexTip.right;
      } else if (this.menuHand.wrist && this.menuHand.wrist.right) {
        handRight = this.menuHand.wrist.right;
      }

      const targetPos = handPos.add(handRight.uniformScale(this.handOffsetCm));
      const tr = this.aiCoreObject.getTransform();
      const curPos = tr.getWorldPosition();

      // Exponential position smoothing
      const smoothedPos = vec3.lerp(curPos, targetPos, this.lerpSpeed);
      tr.setWorldPosition(smoothedPos);

      // Billboard rotation toward user camera
      if (this.cameraObj) {
        const camPos = this.cameraObj.getTransform().getWorldPosition();
        const dir = camPos.sub(smoothedPos).normalize();
        tr.setWorldRotation(quat.lookAt(dir, vec3.up()));
      }
    }
  }
}
