/**
 * InkMlClassifier.ts
 * -----------------------------------------------------------------------------
 * On-Device SnapML Handwriting Neural Network Classifier for INFINITY.
 *
 * Consumes in-air or desk pinch-written strokes, rasterizes them into a
 * normalized 1x64x64 float tensor, and executes ink_cnn.onnx via Snap's native
 * MLComponent.runImmediate(true). Outputs classified alphanumeric character (A-Z, 0-9).
 *
 * Adapted from QWERTY InkMlClassifier for INFINITY Spatial OS.
 * Lens Studio 5.24+ / SnapML / TypeScript.
 */

export const INK_CNN_SIZE = 64;
export const INK_CNN_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export interface StrokePoint {
    x: number;
    y: number;
    t: number;
}

export interface ClassificationResult {
    label: string;
    confidence: number;
    runnerUp: string;
    runnerUpConfidence: number;
    resolved: boolean;
}

@component
export class InkMlClassifier extends BaseScriptComponent {

    @ui.separator
    @ui.label('<span style="color: #00F0FF;">INFINITY SnapML Handwriting Engine</span>')

    @input
    @allowUndefined
    @hint("ink_cnn.onnx MLAsset from tt/Assets/ML/.")
    modelAsset: MLAsset;

    private mlComponent: any = null;
    private inputBuffer: Float32Array | null = null;
    private outputBuffer: Float32Array | null = null;
    private isReady: boolean = false;

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
    }

    private onStart(): void {
        if (!this.modelAsset) {
            print("[INFINITY ML] No MLAsset assigned; handwriting classifier running in fallback mode.");
            return;
        }

        try {
            this.mlComponent = this.getSceneObject().createComponent("Component.MLComponent");
            this.mlComponent.model = this.modelAsset;
            this.mlComponent.autoRun = false;

            this.mlComponent.onLoadingFinished = () => this.bindTensors();
            this.mlComponent.build([]);
            print("[INFINITY ML] Initializing SnapML handwriting CNN...");
        } catch (e) {
            print("[INFINITY ML] MLComponent initialization error: " + e);
        }
    }

    private bindTensors(): void {
        try {
            const inputs = this.mlComponent.getInputs();
            const outputs = this.mlComponent.getOutputs();
            if (!inputs || inputs.length === 0 || !outputs || outputs.length === 0) {
                print("[INFINITY ML] Model has no input/output placeholders.");
                return;
            }

            this.inputBuffer = inputs[0].data;
            this.outputBuffer = outputs[0].data;
            const required = INK_CNN_SIZE * INK_CNN_SIZE;

            this.isReady = !!(this.inputBuffer && this.outputBuffer &&
                             this.inputBuffer.length >= required &&
                             this.outputBuffer.length >= 36);

            print("[INFINITY ML] ✓ SnapML ink_cnn bound: ready=" + this.isReady);
        } catch (e) {
            print("[INFINITY ML] Tensor bind error: " + e);
            this.isReady = false;
        }
    }

    /**
     * Classifies a set of 2D handwritten stroke polylines into an alphanumeric character.
     */
    public classifyStrokes(strokes: StrokePoint[][]): ClassificationResult | null {
        if (!this.isReady || !this.inputBuffer || !this.outputBuffer) {
            return null;
        }

        const raster = this.rasterize(strokes);
        const len = Math.min(this.inputBuffer.length, raster.length);
        for (let i = 0; i < len; i++) {
            this.inputBuffer[i] = raster[i];
        }

        // Run synchronous on-device NPU inference
        this.mlComponent.runImmediate(true);

        return this.parseLogits(this.outputBuffer);
    }

    private rasterize(strokes: StrokePoint[][]): Float32Array {
        const grid = new Float32Array(INK_CNN_SIZE * INK_CNN_SIZE);
        if (!strokes || strokes.length === 0) return grid;

        let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
        for (let s = 0; s < strokes.length; s++) {
            const stroke = strokes[s];
            for (let p = 0; p < stroke.length; p++) {
                if (stroke[p].x < minX) minX = stroke[p].x;
                if (stroke[p].x > maxX) maxX = stroke[p].x;
                if (stroke[p].y < minY) minY = stroke[p].y;
                if (stroke[p].y > maxY) maxY = stroke[p].y;
            }
        }

        const spanX = Math.max(1e-4, maxX - minX);
        const spanY = Math.max(1e-4, maxY - minY);
        const scale = (INK_CNN_SIZE - 12) / Math.max(spanX, spanY);
        const offsetX = (INK_CNN_SIZE - spanX * scale) * 0.5;
        const offsetY = (INK_CNN_SIZE - spanY * scale) * 0.5;

        for (let s = 0; s < strokes.length; s++) {
            const stroke = strokes[s];
            for (let p = 0; p < stroke.length; p++) {
                const gx = Math.floor((stroke[p].x - minX) * scale + offsetX);
                const gy = Math.floor((stroke[p].y - minY) * scale + offsetY);
                if (gx >= 0 && gx < INK_CNN_SIZE && gy >= 0 && gy < INK_CNN_SIZE) {
                    grid[gy * INK_CNN_SIZE + gx] = 1.0;
                    // Add subtle 3x3 anti-aliasing kernel
                    if (gx > 0) grid[gy * INK_CNN_SIZE + (gx - 1)] = Math.max(grid[gy * INK_CNN_SIZE + (gx - 1)], 0.5);
                    if (gx < INK_CNN_SIZE - 1) grid[gy * INK_CNN_SIZE + (gx + 1)] = Math.max(grid[gy * INK_CNN_SIZE + (gx + 1)], 0.5);
                }
            }
        }

        return grid;
    }

    private parseLogits(logits: Float32Array): ClassificationResult | null {
        if (!logits || logits.length < 36) return null;

        let maxL = -1e9;
        for (let i = 0; i < 36; i++) {
            if (logits[i] > maxL) maxL = logits[i];
        }

        let sumExp = 0;
        const expVals = new Float32Array(36);
        for (let i = 0; i < 36; i++) {
            expVals[i] = Math.exp(logits[i] - maxL);
            sumExp += expVals[i];
        }

        let bestIndex = 0, bestProb = -1;
        let secondIndex = 0, secondProb = -1;

        for (let i = 0; i < 36; i++) {
            const prob = expVals[i] / Math.max(1e-8, sumExp);
            if (prob > bestProb) {
                secondIndex = bestIndex;
                secondProb = bestProb;
                bestIndex = i;
                bestProb = prob;
            } else if (prob > secondProb) {
                secondIndex = i;
                secondProb = prob;
            }
        }

        return {
            label: INK_CNN_LABELS.charAt(bestIndex),
            confidence: bestProb,
            runnerUp: INK_CNN_LABELS.charAt(secondIndex),
            runnerUpConfidence: Math.max(0, secondProb),
            resolved: bestProb - Math.max(0, secondProb) >= 0.12
        };
    }
}
