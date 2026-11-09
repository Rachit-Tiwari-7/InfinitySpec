// ==============================================================================
// INFINITY // DesktopCompanionSyncModule.js (Lens Studio Native Port)
// Glasses-Native Desktop & External Content Ingestion Bridge
// Port of Feature G: Ingests external desktop snippets, clipboard nodes, and tasks
// without turning AR into a 2D desktop monitor
// ==============================================================================

function DesktopCompanionSyncModule(kernelState) {
    this.kernel = kernelState;
    this.receivedPackets = 0;
}

DesktopCompanionSyncModule.prototype.injectDesktopSnippet = function(title, content, category) {
    this.receivedPackets++;
    var noteTitle = title || ("DESKTOP CLIP #" + this.receivedPackets);
    var noteBody = content || "External desktop snippet injected into AR.";
    var targetWs = category || (this.kernel.state.focusedWorkspace || "Think");

    print("[INFINITY DESKTOP SYNC] Ingesting content from companion to [" + targetWs + "]: " + noteTitle);

    // If active workspace matches, update the primary note card
    if (this.kernel.state.notes && this.kernel.state.notes.length > 0) {
        var note = this.kernel.state.notes[0];
        note.cfg.title = "⚡ " + noteTitle;
        note.cfg.body = "• " + noteBody + "\n[x] Synced from PC";
        note.status = "SYNCHRONIZED";

        if (note.labelObj) {
            var txt = note.labelObj.getComponent("Component.Text3D");
            if (txt) {
                txt.text = note.cfg.title + "\n" + note.cfg.body + "\n[ SYNCHRONIZED ]";
            }
        }
    }

    if (this.kernel.state.voiceHud && this.kernel.state.voiceHudLabel) {
        var hTxt = this.kernel.state.voiceHudLabel.getComponent("Component.Text3D");
        if (hTxt) hTxt.text = "[ ⚡ DESKTOP SNIPPET INJECTED TO AR ]";
        this.kernel.state.voiceHudTimer = 3.0;
    }

    if (this.kernel.state) {
        this.kernel.state.pulseEnergy = 1.0;
    }

    return {
        success: true,
        title: noteTitle,
        workspace: targetWs
    };
};

global.DesktopCompanionSyncModule = DesktopCompanionSyncModule;
global.infinityInjectDesktopSnippet = function(title, content, category) {
    if (!global.DesktopCompanionSyncModuleInstance) {
        global.DesktopCompanionSyncModuleInstance = new DesktopCompanionSyncModule({
            state: global.state || {},
            WORKSPACES: global.WORKSPACES || {}
        });
    }
    return global.DesktopCompanionSyncModuleInstance.injectDesktopSnippet(title, content, category);
};
