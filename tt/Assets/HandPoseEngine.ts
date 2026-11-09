/**
 * HandPoseEngine.ts
 * -----------------------------------------------------------------------------
 * High-Precision Geometric Hand Pose Classification for INFINITY on Snap Spectacles.
 *
 * Implements mathematical hand posture filters:
 * - isDismissFist: detect closed fist (<4.8cm tip-to-palm) for quick canvas clearing.
 * - isFingerExtended: reject false poke triggers from curled, relaxed resting fingers.
 * - isPalmModifierPinch: thumb-to-finger discrete taps for lap-level input.
 *
 * Adapted from QWERTY HandPose for INFINITY Spatial OS.
 * Lens Studio 5.24+ / SIK 0.14.0+ / TypeScript.
 */

export const FIST_TIP_CM = 5.5;
export const DISMISS_FIST_TIP_CM = 4.8;
export const DISMISS_THUMB_CM = 5.2;
export const FINGER_EXTEND_CM = 6.2;
export const THUMB_EXTEND_CM = 5.6;
export const UNFOLD_EXTRA_CM = 0.8;
export const PALM_PINCH_CM = 2.2;

@component
export class HandPoseEngine extends BaseScriptComponent {

    @ui.separator
    @ui.label('<span style="color: #00F0FF;">INFINITY Hand Pose Engine</span>')

    @input
    @hint("Enable debug print logging.")
    debugLogging: boolean = false;

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
    }

    private onStart(): void {
        // Expose global pose check functions for OS Kernel
        (globalThis as any).infinityIsDismissFist = (hand: any) => this.isDismissFist(hand);
        (globalThis as any).infinityIsFingerExtended = (hand: any, tip: any, knuckle: any) => this.isFingerExtended(hand, tip, knuckle);
        (globalThis as any).infinityIsPalmModifierPinch = (hand: any) => this.isPalmModifierPinch(hand);
    }

    /**
     * Stricter closed fist posture used to clear/minimize active cards.
     * All 4 fingertips must be < 4.8cm from palm, and thumb < 5.2cm.
     */
    public isDismissFist(hand: any): boolean {
        if (!hand || !this.isTracked(hand)) return false;
        const palm = this.getPalmCenter(hand);
        if (!palm || !hand.thumbTip || !hand.thumbTip.position) return false;

        const tips = [hand.indexTip, hand.middleTip, hand.ringTip, hand.pinkyTip];
        for (let i = 0; i < tips.length; i++) {
            if (!tips[i] || !tips[i].position) return false;
            if (tips[i].position.distance(palm) >= DISMISS_FIST_TIP_CM) {
                return false;
            }
        }
        return hand.thumbTip.position.distance(palm) < DISMISS_THUMB_CM;
    }

    /**
     * Standard closed fist posture (< 5.5cm tip-to-palm).
     */
    public isFist(hand: any): boolean {
        if (!hand || !this.isTracked(hand)) return false;
        const palm = this.getPalmCenter(hand);
        if (!palm) return false;

        const tips = [hand.indexTip, hand.middleTip, hand.ringTip, hand.pinkyTip];
        let counted = 0;
        for (let i = 0; i < tips.length; i++) {
            if (tips[i] && tips[i].position && tips[i].position.distance(palm) < FIST_TIP_CM) {
                counted++;
            }
        }
        return counted >= 4;
    }

    /**
     * Rejects accidental poke triggers from curled, relaxed resting fingers.
     * Tip must extend > 6.2cm from palm and exceed knuckle distance by > 0.8cm.
     */
    public isFingerExtended(hand: any, tip: any, knuckle: any): boolean {
        if (!hand || !this.isTracked(hand) || !tip || !tip.position) return false;
        const palm = this.getPalmCenter(hand);
        if (!palm) return false;

        const tipDist = tip.position.distance(palm);
        if (tipDist < FINGER_EXTEND_CM) return false;

        if (!knuckle || !knuckle.position) {
            return tipDist >= FINGER_EXTEND_CM;
        }
        return tipDist > knuckle.position.distance(palm) + UNFOLD_EXTRA_CM;
    }

    /**
     * Thumb touching one fingertip while at least one other finger is extended.
     * Enables discrete lap-level modifier actions.
     */
    public isPalmModifierPinch(hand: any): boolean {
        if (!hand || !this.isTracked(hand) || !hand.thumbTip || !hand.thumbTip.position) return false;
        const palm = this.getPalmCenter(hand);
        if (!palm) return false;

        const thumb = hand.thumbTip.position;
        const tips = [hand.indexTip, hand.middleTip, hand.ringTip, hand.pinkyTip];
        let pinched = false;
        let extended = 0;

        for (let i = 0; i < tips.length; i++) {
            if (!tips[i] || !tips[i].position) continue;
            const distThumb = thumb.distance(tips[i].position);
            if (distThumb <= PALM_PINCH_CM) {
                pinched = true;
            } else if (tips[i].position.distance(palm) >= FINGER_EXTEND_CM) {
                extended++;
            }
        }
        return pinched && extended >= 1;
    }

    private isTracked(hand: any): boolean {
        if (typeof hand.isTracked === "function") return hand.isTracked();
        if (typeof hand.isTracked === "boolean") return hand.isTracked;
        return hand.indexTip !== null && hand.indexTip !== undefined;
    }

    private getPalmCenter(hand: any): vec3 | null {
        if (typeof hand.getPalmCenter === "function") return hand.getPalmCenter();
        if (hand.wrist && hand.middleKnuckle && hand.wrist.position && hand.middleKnuckle.position) {
            return hand.wrist.position.add(hand.middleKnuckle.position).uniformScale(0.5);
        }
        return null;
    }
}
