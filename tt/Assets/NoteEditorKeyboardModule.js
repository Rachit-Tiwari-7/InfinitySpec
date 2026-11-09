// ==============================================================================
// INFINITY // NoteEditorKeyboardModule.js (Lens Studio Native Port)
// Floating 3D Note Editor Easel & Spatial Virtual Keyboard Deck
// Features A & B: Allows editing title, body, cycling field, keycap inputs, save/cancel
// ==============================================================================

function NoteEditorKeyboard(kernelState) {
    this.kernel = kernelState;
    this.active = false;
    this.targetNote = null;
    this.editField = "body"; // "title" or "body"
    this.editTitle = "";
    this.editBody = "";
    this.capsLock = false;

    // Root 3D objects
    this.easelObj = null;
    this.easelLabel = null;
    this.keyboardDeck = null;
    this.keycapObjects = [];

    // Alphanumeric Keycap Layout (compact 3-row layout + actions)
    this.KEY_LAYOUT = [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", "BKSP"],
        ["TAB", "Z", "X", "C", "V", "B", "N", "M", "SPACE", "SAVE"]
    ];

    this.initUI();
}

NoteEditorKeyboard.prototype.initUI = function() {
    // 1. Editor Display Easel (Z = -64cm, Y = 6.5cm, facing user)
    this.easelObj = global.scene.createSceneObject("Editor_Easel_Backplate");
    var visual = this.easelObj.createComponent("Component.RenderMeshVisual");
    if (this.kernel.boxMesh) visual.mesh = this.kernel.boxMesh;
    if (this.kernel.pbrMaterial) visual.material = this.kernel.pbrMaterial;
    this.easelObj.getTransform().setWorldPosition(new vec3(0.0, 6.5, -64.0));
    this.easelObj.getTransform().setWorldScale(new vec3(32.0, 14.0, 0.4));
    this.applyColor(this.easelObj, new vec4(0.04, 0.08, 0.16, 0.95));

    this.easelLabel = global.scene.createSceneObject("Editor_Easel_Text");
    var txt = this.easelLabel.createComponent("Component.Text3D");
    txt.text = "✦ INFINITY NOTE EDITOR\n[SELECT A NOTE TO EDIT]";
    txt.size = 4.2;
    if (txt.mainPass && txt.mainPass.baseColor) {
        txt.mainPass.baseColor = new vec4(0.0, 0.94, 1.0, 1.0);
    }
    this.easelLabel.getTransform().setWorldPosition(new vec3(0.0, 6.5, -63.5));

    // 2. Spatial Virtual Keyboard Deck (Z = -58cm, Y = -4.5cm, angled upward 22°)
    this.keyboardDeck = global.scene.createSceneObject("Editor_Keyboard_Deck");
    var kbVisual = this.keyboardDeck.createComponent("Component.RenderMeshVisual");
    if (this.kernel.boxMesh) kbVisual.mesh = this.kernel.boxMesh;
    if (this.kernel.pbrMaterial) kbVisual.material = this.kernel.pbrMaterial;
    this.keyboardDeck.getTransform().setWorldPosition(new vec3(0.0, -4.5, -58.0));
    this.keyboardDeck.getTransform().setWorldScale(new vec3(36.0, 11.0, 0.4));
    this.keyboardDeck.getTransform().setLocalRotation(quat.fromEulerAngles(22.0 * Math.PI / 180.0, 0, 0));
    this.applyColor(this.keyboardDeck, new vec4(0.02, 0.05, 0.10, 0.92));

    // 3. Build Keycaps
    var startX = -15.5;
    var startY = -1.2;
    var stepX = 3.4;
    var stepY = -2.5;

    for (var r = 0; r < this.KEY_LAYOUT.length; r++) {
        var row = this.KEY_LAYOUT[r];
        for (var c = 0; c < row.length; c++) {
            var keyChar = row[c];
            var kObj = global.scene.createSceneObject("Keycap_" + keyChar + "_" + r + "_" + c);
            var kVis = kObj.createComponent("Component.RenderMeshVisual");
            if (this.kernel.boxMesh) kVis.mesh = this.kernel.boxMesh;
            if (this.kernel.pbrMaterial) kVis.material = this.kernel.pbrMaterial;

            var kx = startX + c * stepX;
            var ky = startY + r * stepY;
            var kz = -57.5 + (r * 0.9); // Angle with desk pitch

            var kw = (keyChar === "SPACE" || keyChar === "SAVE" || keyChar === "BKSP" || keyChar === "TAB") ? 4.2 : 2.8;
            kObj.getTransform().setWorldScale(new vec3(kw, 1.9, 0.3));
            kObj.getTransform().setWorldPosition(new vec3(kx, ky, kz));
            kObj.getTransform().setLocalRotation(quat.fromEulerAngles(22.0 * Math.PI / 180.0, 0, 0));

            var keyColor = (keyChar === "SAVE") ? new vec4(0.0, 1.0, 0.66, 0.95) :
                           (keyChar === "BKSP") ? new vec4(1.0, 0.25, 0.25, 0.95) :
                           (keyChar === "TAB")  ? new vec4(1.0, 0.75, 0.08, 0.95) :
                           new vec4(0.12, 0.22, 0.36, 0.90);
            this.applyColor(kObj, keyColor);

            // Text label for keycap
            var kLbl = global.scene.createSceneObject("KeyLabel_" + keyChar);
            var kTxt = kLbl.createComponent("Component.Text3D");
            kTxt.text = keyChar;
            kTxt.size = 2.6;
            kLbl.getTransform().setWorldPosition(new vec3(kx, ky, kz + 0.3));
            kLbl.getTransform().setLocalRotation(quat.fromEulerAngles(22.0 * Math.PI / 180.0, 0, 0));

            this.keycapObjects.push({
                obj: kObj,
                labelObj: kLbl,
                key: keyChar,
                pos: new vec3(kx, ky, kz)
            });
        }
    }

    this.setVisible(false);
};

NoteEditorKeyboard.prototype.applyColor = function(obj, color) {
    if (!obj) return;
    var visual = obj.getComponent("Component.RenderMeshVisual") || obj.getComponent("RenderMeshVisual");
    if (visual && visual.mainPass && visual.mainPass.baseColor) {
        visual.mainPass.baseColor = color;
    }
};

NoteEditorKeyboard.prototype.setVisible = function(vis) {
    this.active = vis;
    if (this.easelObj) this.easelObj.enabled = vis;
    if (this.easelLabel) this.easelLabel.enabled = vis;
    if (this.keyboardDeck) this.keyboardDeck.enabled = vis;
    for (var i = 0; i < this.keycapObjects.length; i++) {
        if (this.keycapObjects[i].obj) this.keycapObjects[i].obj.enabled = vis;
        if (this.keycapObjects[i].labelObj) this.keycapObjects[i].labelObj.enabled = vis;
    }
};

NoteEditorKeyboard.prototype.openEditor = function(note) {
    if (!note || !note.cfg) return;
    this.targetNote = note;
    this.editTitle = note.cfg.title || "UNTITLED";
    this.editBody = note.cfg.body || "";
    this.editField = "body";
    this.setVisible(true);
    this.updateDisplay();
    print("[INFINITY EDITOR] Opened 3D Note Editor for: " + this.editTitle);
};

NoteEditorKeyboard.prototype.closeEditor = function() {
    this.setVisible(false);
    this.targetNote = null;
    print("[INFINITY EDITOR] Closed Note Editor");
};

NoteEditorKeyboard.prototype.updateDisplay = function() {
    if (!this.easelLabel) return;
    var txt = this.easelLabel.getComponent("Component.Text3D");
    if (!txt) return;

    var isTitle = (this.editField === "title");
    var fieldIndicator = isTitle ? ">>> [EDITING TITLE] <<<" : ">>> [EDITING BODY] <<<";
    var bodyLines = this.editBody.split("\n").slice(0, 3).join("\n");

    var displayStr = "✦ INFINITY // SPATIAL NOTE EDITOR\n" +
                     fieldIndicator + "  (Tap TAB to switch)\n" +
                     "----------------------------------------\n" +
                     "TITLE: " + this.editTitle + (isTitle ? " ▌" : "") + "\n" +
                     "BODY:\n" + bodyLines + (!isTitle ? " ▌" : "") + "\n" +
                     "----------------------------------------\n" +
                     "[ TAB: Switch Field | BKSP: Delete | SAVE: Commit ]";
    txt.text = displayStr;
};

NoteEditorKeyboard.prototype.handleKeyPress = function(key) {
    if (!this.active) return false;

    if (key === "SAVE") {
        this.saveChanges();
        return true;
    } else if (key === "TAB") {
        this.editField = (this.editField === "title") ? "body" : "title";
        this.updateDisplay();
        return true;
    } else if (key === "BKSP") {
        if (this.editField === "title") {
            if (this.editTitle.length > 0) this.editTitle = this.editTitle.substring(0, this.editTitle.length - 1);
        } else {
            if (this.editBody.length > 0) this.editBody = this.editBody.substring(0, this.editBody.length - 1);
        }
        this.updateDisplay();
        return true;
    } else if (key === "SPACE") {
        if (this.editField === "title") {
            if (this.editTitle.length < 24) this.editTitle += " ";
        } else {
            if (this.editBody.length < 90) this.editBody += " ";
        }
        this.updateDisplay();
        return true;
    } else {
        // Alphanumeric character
        var ch = this.capsLock ? key.toUpperCase() : key;
        if (this.editField === "title") {
            if (this.editTitle.length < 24) this.editTitle += ch;
        } else {
            if (this.editBody.length < 90) this.editBody += ch;
        }
        this.updateDisplay();
        return true;
    }
};

NoteEditorKeyboard.prototype.saveChanges = function() {
    if (!this.targetNote) return;
    this.targetNote.cfg.title = this.editTitle;
    this.targetNote.cfg.body = this.editBody;
    this.targetNote.status = "SYNCHRONIZED";

    // Update Note 3D Text Card
    if (this.targetNote.labelObj) {
        var txt = this.targetNote.labelObj.getComponent("Component.Text3D");
        if (txt) {
            txt.text = this.editTitle + "\n" + this.editBody + "\n[ SYNCHRONIZED ]";
        }
    }

    print("[INFINITY EDITOR] ✓ Changes saved to note: " + this.editTitle);
    this.closeEditor();

    // Trigger persistence and pulse
    if (this.kernel.saveWorkspaceState && this.kernel.state && this.kernel.state.focusedWorkspace) {
        this.kernel.saveWorkspaceState(this.kernel.state.focusedWorkspace);
    }
    if (this.kernel.state) {
        this.kernel.state.pulseEnergy = 1.0;
    }
};

NoteEditorKeyboard.prototype.checkRayHit = function(screenPos, raycastFn) {
    if (!this.active) return false;

    // Check keycap hits
    for (var i = 0; i < this.keycapObjects.length; i++) {
        var k = this.keycapObjects[i];
        var hitResult = raycastFn(screenPos, k.pos, 2.2);
        if (hitResult.hit) {
            this.handleKeyPress(k.key);
            return true;
        }
    }

    // Check easel hit (to toggle field)
    if (this.easelObj) {
        var easelPos = this.easelObj.getTransform().getWorldPosition();
        var eHit = raycastFn(screenPos, easelPos, 14.0);
        if (eHit.hit) {
            this.editField = (this.editField === "title") ? "body" : "title";
            this.updateDisplay();
            return true;
        }
    }

    return false;
};

global.NoteEditorKeyboard = NoteEditorKeyboard;
