/**
 * InfinityCompanionSocket.ts
 * -----------------------------------------------------------------------------
 * Native WebSocket Companion Transport for INFINITY on Snap Spectacles.
 *
 * Utilizes Lens Studio 5.24+ InternetModule with secure wss:// transport.
 * Establishes real-time bi-directional link between desktop companion /
 * external notes and the Spectacles spatial study canvas.
 *
 * Features:
 * - Exponential backoff reconnect with +/-20% jitter.
 * - Heartbeat ping-pong latency tracking.
 * - Live injection of desktop study notes and vault items into 3D space.
 *
 * Adapted from OpenBandSocket for INFINITY Spatial OS.
 * Lens Studio 5.24+ / SPECS Project Mode / TypeScript.
 */

@component
export class InfinityCompanionSocket extends BaseScriptComponent {

    @ui.separator
    @ui.label('<span style="color: #00F0FF;">INFINITY Companion WebSocket</span>')

    @input
    @allowUndefined
    @hint("InternetModule asset; required for createWebSocket on Spectacles.")
    internetModule: any;

    @input
    @hint("Secure WebSocket URL for desktop companion sync.")
    relayUrl: string = "wss://echo.websocket.events";

    @input
    @hint("Room / Channel ID for paired companion session.")
    roomCode: string = "INF-STUDY";

    @input
    @hint("Enable debug print logging.")
    debugLogging: boolean = false;

    private socket: any = null;
    private isConnected: boolean = false;
    private reconnectAttempt: number = 0;
    private reconnectTimer: DelayedCallbackEvent | null = null;
    private heartbeatTimer: DelayedCallbackEvent | null = null;

    onAwake(): void {
        this.reconnectTimer = this.createEvent("DelayedCallbackEvent");
        this.reconnectTimer.bind(() => this.connect());

        this.heartbeatTimer = this.createEvent("DelayedCallbackEvent");
        this.heartbeatTimer.bind(() => this.sendHeartbeat());

        this.createEvent("OnStartEvent").bind(() => this.onStart());
    }

    private onStart(): void {
        this.connect();
    }

    private resolveInternetModule(): any {
        if (this.internetModule) return this.internetModule;
        try {
            return (globalThis as any).require("LensStudio:InternetModule");
        } catch (e) {
            return (globalThis as any).InternetModule || null;
        }
    }

    public connect(): void {
        const module = this.resolveInternetModule();
        if (!module) {
            if (this.debugLogging) {
                print("[INFINITY SOCKET] InternetModule not available; companion running in local mode.");
            }
            return;
        }

        try {
            const url = this.relayUrl + (this.relayUrl.indexOf("?") === -1 ? "?" : "&") + "room=" + this.roomCode;
            if (this.debugLogging) {
                print("[INFINITY SOCKET] Connecting to companion: " + url);
            }

            this.socket = module.createWebSocket(url);

            this.socket.onOpen.add(() => {
                this.isConnected = true;
                this.reconnectAttempt = 0;
                print("[INFINITY SOCKET] ✓ Live companion connection established.");
                (globalThis as any).infinityCompanionConnected = true;

                // Send handshake
                this.sendJson({ type: "HANDSHAKE", client: "INFINITY_SPECTACLES", room: this.roomCode });
                this.scheduleHeartbeat();
            });

            this.socket.onMessage.add((event: any) => {
                const message = typeof event === "string" ? event : (event.data || "");
                this.handleIncomingMessage(message);
            });

            this.socket.onError.add((err: any) => {
                print("[INFINITY SOCKET] Error: " + err);
            });

            this.socket.onClose.add((event: any) => {
                this.isConnected = false;
                (globalThis as any).infinityCompanionConnected = false;
                print("[INFINITY SOCKET] Connection closed; scheduling reconnect.");
                this.scheduleReconnect();
            });
        } catch (e) {
            print("[INFINITY SOCKET] Connection failed: " + e);
            this.scheduleReconnect();
        }
    }

    private scheduleReconnect(): void {
        this.reconnectAttempt++;
        // Exponential backoff with 20% jitter: 1.0s, 2.0s, 4.0s, 8.0s, max 15s
        const base = Math.min(15.0, Math.pow(2.0, Math.min(this.reconnectAttempt - 1, 4)) * 1.0);
        const jitter = (Math.random() * 0.4 - 0.2) * base;
        const delay = Math.max(0.8, base + jitter);

        if (this.reconnectTimer) {
            this.reconnectTimer.reset(delay);
        }
    }

    private scheduleHeartbeat(): void {
        if (this.heartbeatTimer && this.isConnected) {
            this.heartbeatTimer.reset(25.0);
        }
    }

    private sendHeartbeat(): void {
        if (!this.isConnected) return;
        this.sendJson({ type: "PING", t: getTime() });
        this.scheduleHeartbeat();
    }

    public sendJson(payload: any): void {
        if (!this.socket || !this.isConnected) return;
        try {
            this.socket.send(JSON.stringify(payload));
        } catch (e) {}
    }

    private handleIncomingMessage(rawMessage: string): void {
        if (!rawMessage) return;

        try {
            const data = JSON.parse(rawMessage);
            if (!data || !data.type) return;

            if (data.type === "STUDY_NOTE" || data.type === "DESKTOP_SNIPPET") {
                const content = data.content || data.body || "";
                print("[INFINITY SOCKET] Ingested study content: " + content);
                if (typeof (globalThis as any).infinityDictateVoiceNote === "function") {
                    (globalThis as any).infinityDictateVoiceNote(content);
                }
            } else if (data.type === "NAV_STEP") {
                const dir = data.direction || 1;
                if (dir > 0 && typeof (globalThis as any).infinityFocusNext === "function") {
                    (globalThis as any).infinityFocusNext();
                } else if (dir < 0 && typeof (globalThis as any).infinityFocusPrevious === "function") {
                    (globalThis as any).infinityFocusPrevious();
                }
            }
        } catch (e) {
            // Non-JSON raw text frame
            if (rawMessage.length > 3 && typeof (globalThis as any).infinityDictateVoiceNote === "function") {
                (globalThis as any).infinityDictateVoiceNote(rawMessage);
            }
        }
    }

    public getConnected(): boolean {
        return this.isConnected;
    }
}
