/**
 * INFINITY Spatial Computer // MultiNodeWorkspaceManipulator.ts
 * Derived from Obsidiar Multi-Node SIK Interactor Interception Architecture.
 *
 * Implements:
 * 1. Multi-node dual-hand tracking across distinct scene objects.
 * 2. Suppression of single-hand SIK manipulation during 2-handed gestures to eliminate fighting.
 * 3. 6-DoF pivot translation, quaternion rotation, and pinch-to-scale on the workspace root.
 * 4. Seamless handoff back to single-hand drag on one-hand release.
 * 5. Kinematic tap vs. drag disambiguation based on joint hold-time and displacement squared.
 */

export interface GrabRecord {
  interactor: any;
  manipComponent: any;
  noteId: string;
  pressPos: vec3;
  pressTime: number;
}

export const DEFAULT_TAP_MAX_SEC = 0.35;
export const DEFAULT_DRAG_THRESHOLD_CM = 2.0;

@component
export class MultiNodeWorkspaceManipulator extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">MultiNodeWorkspaceManipulator – Two-Hand Workspace Coordination</span>')
  @ui.separator

  @input
  @hint("Workspace root SceneObject driven by the two-hand gesture")
  workspaceRoot: SceneObject;

  @input
  @hint("Minimum uniform scale allowed for workspace")
  minScale: number = 0.25;

  @input
  @hint("Maximum uniform scale allowed for workspace")
  maxScale: number = 4.0;

  @input
  @hint("Max duration in seconds for a pinch to register as a tap")
  tapMaxSec: number = DEFAULT_TAP_MAX_SEC;

  @input
  @hint("Max motion distance in cm for a pinch to register as a tap")
  dragThresholdCm: number = DEFAULT_DRAG_THRESHOLD_CM;

  private activeGrabs: GrabRecord[] = [];
  private isTwoHandActive: boolean = false;
  private parkedManips: any[] = [];

  // Two-hand gesture baseline caches
  private startDist: number = 1.0;
  private startVec: vec3 = vec3.zero();
  private startRot: quat = quat.quatIdentity();
  private startScale: vec3 = vec3.one();
  private pivotOffset: vec3 = vec3.zero();

  onAwake(): void {
    if (!this.workspaceRoot) {
      this.workspaceRoot = this.getSceneObject();
    }

    // Export global bridge bindings
    (global as any).workspaceRegisterGrab = this.registerGrab.bind(this);
    (global as any).workspaceReleaseGrab = this.releaseGrab.bind(this);
    (global as any).workspaceIsTwoHandActive = () => this.isTwoHandActive;
    (global as any).workspaceCheckTapVsDrag = this.checkTapVsDrag.bind(this);

    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
  }

  /**
   * Registers a grab from an interactor on a specific node card.
   */
  registerGrab(interactor: any, manipComponent: any, noteId: string, worldPos: vec3): void {
    // Avoid duplicate records for same interactor
    this.removeGrabByInteractor(interactor);

    this.activeGrabs.push({
      interactor: interactor,
      manipComponent: manipComponent,
      noteId: noteId,
      pressPos: worldPos,
      pressTime: getTime(),
    });
  }

  /**
   * Releases grab and returns tap-vs-drag metrics.
   */
  releaseGrab(
    interactor: any,
    curWorldPos: vec3
  ): { isTap: boolean; elapsedSec: number; movedDistCm: number } {
    let rec: GrabRecord | null = null;
    for (let i = 0; i < this.activeGrabs.length; i++) {
      if (this.activeGrabs[i].interactor === interactor) {
        rec = this.activeGrabs[i];
        this.activeGrabs.splice(i, 1);
        break;
      }
    }

    if (!rec) {
      return { isTap: false, elapsedSec: 0, movedDistCm: 0 };
    }

    const elapsed = getTime() - rec.pressTime;
    const diff = curWorldPos.sub(rec.pressPos);
    const movedDistCm = Math.sqrt(diff.x * diff.x + diff.y * diff.y + diff.z * diff.z);

    const isTap = this.checkTapVsDrag(rec.pressPos, curWorldPos, elapsed);

    return {
      isTap: isTap,
      elapsedSec: elapsed,
      movedDistCm: movedDistCm,
    };
  }

  /**
   * Pure evaluation of tap-vs-drag criteria.
   */
  checkTapVsDrag(pressPos: vec3, curPos: vec3, elapsedSec: number): boolean {
    const diff = curPos.sub(pressPos);
    const distSq = diff.x * diff.x + diff.y * diff.y + diff.z * diff.z;
    const threshSq = (this.dragThresholdCm * this.dragThresholdCm);
    return elapsedSec <= this.tapMaxSec && distSq <= threshSq;
  }

  private removeGrabByInteractor(interactor: any): void {
    for (let i = 0; i < this.activeGrabs.length; i++) {
      if (this.activeGrabs[i].interactor === interactor) {
        this.activeGrabs.splice(i, 1);
        break;
      }
    }
  }

  private getInteractorPosition(interactor: any): vec3 | null {
    if (!interactor) return null;
    if (typeof interactor.getInteractionPoint === "function") {
      return interactor.getInteractionPoint();
    }
    if (typeof interactor.getStartPoint === "function") {
      return interactor.getStartPoint();
    }
    if (interactor.planecastPoint) {
      return interactor.planecastPoint;
    }
    if (interactor.sceneObject) {
      return interactor.sceneObject.getTransform().getWorldPosition();
    }
    return null;
  }

  private setManipEnabled(manip: any, enabled: boolean): void {
    if (!manip) return;
    try {
      if (typeof manip.setEnabled === "function") {
        manip.setEnabled(enabled);
      } else if (manip.sceneObject) {
        manip.enabled = enabled;
      }
    } catch (_e) {
      // safe fallback
    }
  }

  private onUpdate(): void {
    if (!this.workspaceRoot) return;

    // Filter active grabs whose interactors are still tracking
    const validGrabs: { interactor: any; manip: any; pos: vec3 }[] = [];
    for (let i = 0; i < this.activeGrabs.length; i++) {
      const p = this.getInteractorPosition(this.activeGrabs[i].interactor);
      if (p) {
        validGrabs.push({
          interactor: this.activeGrabs[i].interactor,
          manip: this.activeGrabs[i].manipComponent,
          pos: p,
        });
      }
    }

    const tr = this.workspaceRoot.getTransform();

    if (validGrabs.length >= 2) {
      const pa = validGrabs[0].pos;
      const pb = validGrabs[1].pos;

      if (!this.isTwoHandActive) {
        this.isTwoHandActive = true;
        this.parkedManips = [];

        // Park single-hand manips so they don't fight the two-hand gesture
        for (let i = 0; i < validGrabs.length; i++) {
          const m = validGrabs[i].manip;
          if (m && this.parkedManips.indexOf(m) === -1) {
            this.parkedManips.push(m);
            this.setManipEnabled(m, false);
          }
        }

        this.startVec = pb.sub(pa);
        this.startDist = Math.max(this.startVec.length, 0.0001);
        this.startRot = tr.getWorldRotation();
        this.startScale = tr.getLocalScale();
        const mid = pa.add(pb).uniformScale(0.5);
        this.pivotOffset = tr.getWorldPosition().sub(mid);
      }

      const curVec = pb.sub(pa);
      const curDist = Math.max(curVec.length, 0.0001);
      let s = curDist / this.startDist;

      // Clamp scale to limits
      const curLocalScale = this.startScale.uniformScale(s);
      if (curLocalScale.x < this.minScale) s = this.minScale / this.startScale.x;
      if (curLocalScale.x > this.maxScale) s = this.maxScale / this.startScale.x;

      const rotDelta = quat.rotationFromTo(this.startVec.normalize(), curVec.normalize());
      const curMid = pa.add(pb).uniformScale(0.5);

      tr.setWorldRotation(rotDelta.multiply(this.startRot));
      tr.setWorldPosition(curMid.add(rotDelta.multiplyVec3(this.pivotOffset.uniformScale(s))));
      tr.setLocalScale(this.startScale.uniformScale(s));
    } else if (this.isTwoHandActive) {
      // Exit two-hand gesture cleanly and restore single-hand manips
      this.isTwoHandActive = false;
      for (let i = 0; i < this.parkedManips.length; i++) {
        this.setManipEnabled(this.parkedManips[i], true);
      }
      this.parkedManips = [];

      // Re-seed the remaining grabbed object if one is still held
      if (validGrabs.length === 1 && validGrabs[0].manip) {
        const m = validGrabs[0].manip;
        try {
          if (typeof m.updateStartValues === "function") {
            m.updateStartValues();
          } else if (typeof m.updateStartTransform === "function") {
            m.updateStartTransform();
          }
        } catch (_e) {
          // non-fatal
        }
      }
    }
  }
}
