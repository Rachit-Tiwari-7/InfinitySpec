/**
 * KeepUpright.ts
 *
 * Attach to any SceneObject to maintain optical bilateral alignment
 * and rotation lock relative to the Spectacles waveguide display.
 */
@component
export class KeepUpright extends BaseScriptComponent {

    @input
    @hint("Lock rotation to initial value")
    lockRotation: boolean = true;

    @input
    @hint("Lock scale to initial value")
    lockScale: boolean = true;

    private transform: Transform;
    private initialRotation: quat;
    private initialScale: vec3;

    onAwake(): void {
        this.transform = this.sceneObject.getTransform();
        this.initialRotation = this.transform.getWorldRotation();
        this.initialScale = this.transform.getWorldScale();

        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }

    private onUpdate(): void {
        if (this.lockRotation) {
            this.transform.setWorldRotation(this.initialRotation);
        }
        if (this.lockScale) {
            this.transform.setWorldScale(this.initialScale);
        }
    }

    public setCurrentRotationAsDefault(): void {
        this.initialRotation = this.transform.getWorldRotation();
    }

    public setLockedRotation(rotation: quat): void {
        this.initialRotation = rotation;
    }
}
