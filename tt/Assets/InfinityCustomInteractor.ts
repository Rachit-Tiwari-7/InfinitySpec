/**
 * InfinityCustomInteractor.ts
 * -----------------------------------------------------------------------------
 * Custom Controller SIK Interactor for INFINITY on Snap Spectacles.
 *
 * Implements SIK's reserved InteractorInputType.CustomController (1 << 4).
 * Bridges non-pointing inputs (voice triggers, companion keyboard shortcuts,
 * external clickers, discrete focus navigation) directly into SIK's native
 * InteractionManager so any SIK Interactable receives true hover and trigger
 * lifecycles without manual collision raycasts.
 *
 * Adapted from OpenBand Interactor for INFINITY Spatial OS.
 * Lens Studio 5.24+ / SIK 0.14.0+ / TypeScript.
 */

import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import BaseInteractor from "SpectaclesInteractionKit.lspkg/Core/Interactor/BaseInteractor";
import {
    InteractorInputType,
    InteractorTriggerType,
    TargetingMode
} from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";

export interface FocusSource {
    getFocusedInteractable(): Interactable | null;
    getFocusedObject(): SceneObject | null;
}

const DEFAULT_PULSE_HOLD_SEC = 0.15;

@component
export class InfinityCustomInteractor extends BaseInteractor {

    @ui.separator
    @ui.label('<span style="color: #00F0FF;">INFINITY Custom SIK Interactor</span>')

    @input
    @allowUndefined
    @hint("Focus navigation group managing ordered selectable targets.")
    focusNavigationGroup: ScriptComponent;

    @input
    @hint("Enable debug print logging for SIK trigger transitions.")
    debugLogging: boolean = false;

    private focusSource: FocusSource | null = null;
    private pinchDown: boolean = false;
    private pulseTimer: DelayedCallbackEvent | null = null;
    protected cameraProvider = WorldCameraFinderProvider.getInstance();

    private rayStartPos: vec3 = vec3.zero();
    private rayDir: vec3 = vec3.forward();

    onAwake(): void {
        // Claim SIK's reserved CustomController input type
        this.inputType = InteractorInputType.CustomController;

        this.pulseTimer = this.createEvent("DelayedCallbackEvent");
        this.pulseTimer.bind(() => this.setPinchDown(false));

        this.createEvent("OnStartEvent").bind(() => this.onStart());
    }

    private onStart(): void {
        if (this.focusNavigationGroup) {
            const comp = this.focusNavigationGroup as any;
            if (typeof comp.getFocusedInteractable === "function") {
                this.focusSource = comp;
            }
        }
    }

    public setFocusSource(source: FocusSource): void {
        this.focusSource = source;
    }

    /**
     * Drives the SIK trigger state. When true, InteractionManager transitions
     * the currentInteractable into TriggerStart/TriggerUpdate.
     */
    public setPinchDown(down: boolean): void {
        if (down === this.pinchDown) return;
        this.pinchDown = down;
        if (this.debugLogging) {
            print("[INFINITY INTERACTOR] Custom trigger: " + (down ? "DOWN" : "UP"));
        }
    }

    /**
     * Pulse trigger: presses immediately and releases after holdSeconds.
     * Generates a genuine SIK TriggerStart -> TriggerEnd sequence.
     */
    public pulsePinch(holdSeconds: number = DEFAULT_PULSE_HOLD_SEC): void {
        this.setPinchDown(true);
        if (this.pulseTimer) {
            this.pulseTimer.reset(holdSeconds > 0 ? holdSeconds : DEFAULT_PULSE_HOLD_SEC);
        }
    }

    // --- SIK BaseInteractor Lifecycle Contract -------------------------------

    public updateState(): void {
        super.updateState();

        const target = this.focusSource ? this.focusSource.getFocusedInteractable() : null;
        this.currentInteractable = target;

        // Refresh camera-to-target synthetic ray for SIK drag math
        const cam = this.cameraProvider.getComponent();
        if (cam) {
            const camPos = cam.getSceneObject().getTransform().getWorldPosition();
            this.rayStartPos = camPos;
            if (target) {
                const targetPos = target.getSceneObject().getTransform().getWorldPosition();
                const delta = targetPos.sub(camPos);
                this.rayDir = delta.lengthSquared > 0.0001 ? delta.normalize() : cam.getSceneObject().getTransform().forward;
            } else {
                this.rayDir = cam.getSceneObject().getTransform().forward;
            }
        }
    }

    public isTargeting(): boolean {
        return this.isActive() && this.focusSource !== null && this.focusSource.getFocusedInteractable() !== null;
    }

    public isActive(): boolean {
        return true;
    }

    public isPinching(): boolean {
        return this.pinchDown;
    }

    public get startPoint(): vec3 {
        return this.rayStartPos;
    }

    public get direction(): vec3 {
        return this.rayDir;
    }

    public get interactionStrength(): number | null {
        return this.pinchDown ? 1.0 : 0.0;
    }
}
