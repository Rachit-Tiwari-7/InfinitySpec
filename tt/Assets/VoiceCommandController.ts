/**
 * VoiceCommandController.ts
 * -----------------------------------------------------------------------------
 * Hardware-native Automatic Speech Recognition (ASR) & intent routing
 * for INFINITY on Snap Spectacles.
 *
 * Utilizes Lens Studio 5.24+ AsrModule with Balanced transcription,
 * live interim feedback stream (`... [utterance]`), 1200ms silence termination,
 * and dispatch to INFINITY OS Kernel.
 *
 * Adapted from Spatialis VoiceCommandController for INFINITY Spatial OS.
 * Lens Studio 5.24+ / SPECS Project Mode / TypeScript.
 */

@component
export class VoiceCommandController extends BaseScriptComponent {

    @input
    @hint("ASR Module asset (speech-to-text). Asset Browser > Add > ASR Module.")
    @allowUndefined
    asrModule: any;

    @input
    @hint("Silence duration in ms before terminating an utterance.")
    silenceMs: number = 1200;

    private isListening: boolean = false;
    private lastTranscript: string = "";
    private lastTranscriptTime: number = -10.0;

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
    }

    private onStart(): void {
        const module = this.resolveAsrModule();
        if (!module) {
            print("[INFINITY ASR] AsrModule not assigned; falling back to simulated speech dispatcher.");
            return;
        }

        try {
            const AsrModuleClass = (globalThis as any).AsrModule;
            if (AsrModuleClass && AsrModuleClass.AsrTranscriptionOptions) {
                const options = AsrModuleClass.AsrTranscriptionOptions.create();
                options.mode = AsrModuleClass.AsrMode.Balanced;
                options.silenceUntilTerminationMs = this.silenceMs;

                options.onTranscriptionUpdateEvent.add((e: any) => {
                    this.onTranscriptionUpdate(e);
                });

                options.onTranscriptionErrorEvent.add((code: any) => {
                    print("[INFINITY ASR] Status/Error code: " + code);
                });

                module.startTranscribing(options);
                this.isListening = true;
                print("[INFINITY ASR] Hardware speech-to-text transcribing active.");
            }
        } catch (e) {
            print("[INFINITY ASR] Failed to start transcribing: " + e);
        }
    }

    private resolveAsrModule(): any {
        if (this.asrModule) return this.asrModule;
        try {
            return (globalThis as any).require("LensStudio:AsrModule");
        } catch (e) {
            return (globalThis as any).AsrModule || null;
        }
    }

    private onTranscriptionUpdate(e: { text: string; isFinal: boolean }): void {
        const text = e.text ? e.text.trim() : "";
        if (!text) return;

        if (!e.isFinal) {
            // Live interim feedback stream to HUD
            if (typeof (globalThis as any).infinityVoiceInterimUpdate === "function") {
                (globalThis as any).infinityVoiceInterimUpdate("... " + text);
            }
            return;
        }

        // Final utterance execution
        this.executeFinalTranscript(text);
    }

    public executeFinalTranscript(rawText: string): void {
        const now = getTime();
        const normalized = rawText.toLowerCase().trim();

        // Debounce duplicated final emissions
        if (normalized === this.lastTranscript && now - this.lastTranscriptTime < 1.8) {
            return;
        }
        this.lastTranscript = normalized;
        this.lastTranscriptTime = now;

        print("[INFINITY ASR] Final Transcript Received: '" + rawText + "'");

        // 1. Check for Note Dictation intent ("note ...", "dictate ...", "write ...")
        if (normalized.startsWith("note ") || normalized.startsWith("dictate ") ||
            normalized.startsWith("add note ") || normalized.startsWith("new note ")) {
            let noteContent = rawText;
            const prefixes = ["add note ", "new note ", "dictate ", "note "];
            for (let i = 0; i < prefixes.length; i++) {
                if (normalized.startsWith(prefixes[i])) {
                    noteContent = rawText.substring(prefixes[i].length).trim();
                    break;
                }
            }
            if (typeof (globalThis as any).infinityDictateVoiceNote === "function") {
                (globalThis as any).infinityDictateVoiceNote(noteContent);
                return;
            }
        }

        // 2. Dispatch to OS Kernel Voice Command processor
        if (typeof (globalThis as any).infinityVoiceCommand === "function") {
            (globalThis as any).infinityVoiceCommand(rawText);
        }
    }
}
