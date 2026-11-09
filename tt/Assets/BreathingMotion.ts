/**
 * BreathingMotion.ts
 * Organic harmonic vertical oscillation for Snap Spectacles.
 * Eased sinusoidal micro-motion to eliminate static AR rigidity.
 */
@component
export class BreathingMotion extends BaseScriptComponent {

    @input
    @hint("Vertical motion distance in cm")
    amplitude: number = 0.85;

    @input
    @hint("Cycles per minute")
    speed: number = 6.0;

    @input
    @hint("Phase offset in radians")
    phaseOffset: number = 0.0;

    private transform: Transform;
    private startY: number;

    onAwake(): void {
        this.transform = this.sceneObject.getTransform();
        this.startY = this.transform.getLocalPosition().y;

        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }

    private onUpdate(): void {
        const t = (getTime() * (this.speed / 60.0) * Math.PI * 2.0) + this.phaseOffset;
        const smooth = (Math.sin(t) + 1.0) * 0.5;
        const eased = smooth * smooth * (3.0 - 2.0 * smooth); // Cubic smoothstep
        const offset = (eased - 0.5) * 2.0 * this.amplitude;

        const pos = this.transform.getLocalPosition();
        pos.y = this.startY + offset;
        this.transform.setLocalPosition(pos);
    }
}
