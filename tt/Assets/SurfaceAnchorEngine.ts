/**
 * SurfaceAnchorEngine.ts
 * -----------------------------------------------------------------------------
 * Physical surface detection, room classification, and desk auto-snapping
 * for INFINITY on Snap Spectacles (SPECS).
 *
 * Casts asynchronous WorldQuery depth rays, classifies physical planes
 * (floor, table, wall, ceiling), and anchors the virtual study surface
 * flush to the physical desk.
 *
 * Adapted from Spatialis SurfaceAnchorEngine for INFINITY Spatial OS.
 * Lens Studio 5.24+ / SPECS Project Mode / TypeScript.
 */

export type SurfaceKind = "floor" | "table" | "wall" | "ceiling" | "unknown";

export interface AnchorResult {
    anchored: boolean;
    position: vec3;
    normal: vec3;
    surface: SurfaceKind;
}

interface PendingProbe {
    rayStart: vec3;
    rayEnd: vec3;
    resolve: (position: vec3 | null, normal: vec3 | null) => void;
}

const HORIZONTAL_DOT = 0.85; // Normal within ~32 deg of world up
const VERTICAL_DOT = 0.30;   // Normal within ~17 deg of horizon
const TABLE_MIN_HEIGHT = 30; // 30cm above floor
const TABLE_MAX_HEIGHT = 130;// 130cm above floor

@component
export class SurfaceAnchorEngine extends BaseScriptComponent {

    @input
    @hint("World Query module asset. If empty, resolves from LensStudio:WorldQueryModule.")
    @allowUndefined
    worldQueryAsset: Asset;

    @input
    @hint("Raycast probe distance in cm.")
    probeDistance: number = 500;

    @input
    @hint("Default desk height fallback when no physical table is found.")
    fallbackDeskHeight: number = -18.0;

    private hitTestSession: any = null;
    private probeQueue: PendingProbe[] = [];
    private probeInFlight: boolean = false;
    private floorHeight: number = -155.0; // cm relative to eye
    private floorSampleCount: number = 0;
    private ready: boolean = false;
    private detectedDeskHeight: number | null = null;

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }

    private onStart(): void {
        const module = this.resolveModule();
        if (!module) {
            print("[INFINITY ANCHOR] WorldQueryModule unavailable; using fallback surface.");
            this.ready = false;
            return;
        }

        try {
            if (typeof (globalThis as any).HitTestSessionOptions !== "undefined") {
                const options = (globalThis as any).HitTestSessionOptions.create();
                options.filter = true;
                this.hitTestSession = module.createHitTestSessionWithOptions(options);
                this.hitTestSession.start();
                this.ready = true;
                print("[INFINITY ANCHOR] WorldQuery filtered hit-test session active.");
            }
        } catch (e) {
            print("[INFINITY ANCHOR] Hit test session init error: " + e);
            this.ready = false;
        }

        // Calibrate physical floor by looking down
        this.calibrateFloor();
        // Probe forward-down for physical study desk
        this.probeForDesk();
    }

    private resolveModule(): any {
        if (this.worldQueryAsset) return this.worldQueryAsset;
        try {
            return (globalThis as any).require("LensStudio:WorldQueryModule");
        } catch (e) {
            return (globalThis as any).WorldQueryModule || null;
        }
    }

    private onUpdate(): void {
        if (this.probeInFlight || this.probeQueue.length === 0) return;
        if (!this.ready || !this.hitTestSession) {
            const dropped = this.probeQueue;
            this.probeQueue = [];
            for (let i = 0; i < dropped.length; i++) dropped[i].resolve(null, null);
            return;
        }

        const probe = this.probeQueue.shift() as PendingProbe;
        this.probeInFlight = true;

        try {
            this.hitTestSession.hitTest(probe.rayStart, probe.rayEnd, (hit: any) => {
                this.probeInFlight = false;
                if (!hit || !hit.position || !hit.normal) {
                    probe.resolve(null, null);
                    return;
                }
                const pos = hit.position as vec3;
                const norm = (hit.normal as vec3).normalize();
                this.recordFloorSample(pos, norm);
                probe.resolve(pos, norm);
            });
        } catch (e) {
            this.probeInFlight = false;
            probe.resolve(null, null);
        }
    }

    private enqueueProbe(start: vec3, end: vec3, cb: (pos: vec3 | null, norm: vec3 | null) => void): void {
        this.probeQueue.push({ rayStart: start, rayEnd: end, resolve: cb });
    }

    private recordFloorSample(position: vec3, normal: vec3): void {
        if (normal.dot(vec3.up()) < HORIZONTAL_DOT) return;
        if (this.floorSampleCount === 0) {
            this.floorHeight = position.y;
            this.floorSampleCount = 1;
        } else if (position.y < this.floorHeight) {
            // Eased convergence
            this.floorHeight = this.floorHeight + (position.y - this.floorHeight) * 0.15;
            this.floorSampleCount++;
        }
    }

    private calibrateFloor(): void {
        const origin = this.getSceneObject().getTransform().getWorldPosition();
        const below = origin.add(vec3.up().uniformScale(-this.probeDistance));
        this.enqueueProbe(origin, below, (pos, norm) => {
            if (pos) {
                print("[INFINITY ANCHOR] Floor calibrated at Y = " + pos.y.toFixed(1) + " cm.");
            }
        });
    }

    public classifySurface(pos: vec3, norm: vec3): SurfaceKind {
        const up = norm.normalize().dot(vec3.up());
        if (up >= HORIZONTAL_DOT) {
            const h = pos.y - this.floorHeight;
            if (h >= TABLE_MIN_HEIGHT && h <= TABLE_MAX_HEIGHT) return "table";
            return "floor";
        }
        if (up <= -HORIZONTAL_DOT) return "ceiling";
        if (Math.abs(up) <= VERTICAL_DOT) return "wall";
        return "unknown";
    }

    public probeForDesk(): void {
        const origin = this.getSceneObject().getTransform().getWorldPosition();
        // Desk probe: angled 35 degrees downward forward
        const forwardDown = new vec3(0.0, -0.65, -0.76).normalize();
        const rayEnd = origin.add(forwardDown.uniformScale(this.probeDistance));

        this.enqueueProbe(origin, rayEnd, (pos, norm) => {
            if (pos && norm) {
                const kind = this.classifySurface(pos, norm);
                if (kind === "table" || (kind === "floor" && pos.y > this.floorHeight + 25.0)) {
                    this.detectedDeskHeight = pos.y;
                    print("[INFINITY ANCHOR] Physical desk locked at Y = " + pos.y.toFixed(1) + " cm");
                    if (typeof (globalThis as any).infinityOnDeskDetected === "function") {
                        (globalThis as any).infinityOnDeskDetected(pos.y, norm);
                    }
                    return;
                }
            }
            // Fallback
            if (typeof (globalThis as any).infinityOnDeskDetected === "function") {
                (globalThis as any).infinityOnDeskDetected(this.fallbackDeskHeight, vec3.up());
            }
        });
    }

    public getDeskHeight(): number {
        return this.detectedDeskHeight !== null ? this.detectedDeskHeight : this.fallbackDeskHeight;
    }
}
