// ==============================================================================
// INFINITY // SessionExporterModule.js (Lens Studio Native Port)
// 1:1 Architectural Port of web/js/whiteboard_export.js
// Exports session data, spatial notes, cognitive states & shapes into Markdown & JSON
// ==============================================================================

function SessionDocumentExporter() {}

SessionDocumentExporter.exportSessionDocument = function(sessionData) {
    var wsName = sessionData.workspaceName || "THINK";
    var notes = sessionData.notes || [];
    var shapes = sessionData.shapes || [];
    var timestamp = new Date().toISOString();

    var md = "# 🌌 INFINITY // Spatial Thinking Session Report\n\n";
    md += "* **Generated:** `" + timestamp + "`\n";
    md += "* **Active Workspace:** **" + wsName.toUpperCase() + "**\n";
    md += "* **Target Hardware:** Snap Spectacles (6DoF Optical AR)\n";
    md += "* **Interaction Engine:** Spectacles Interaction Kit (SIK) + Infinity OS Kernel\n\n";
    md += "---\n\n";

    md += "## 📋 Spatial Thought Objects & Cognitive Notes\n\n";
    if (notes.length === 0) {
        md += "*No active notes in this workspace.*\n\n";
    } else {
        for (var i = 0; i < notes.length; i++) {
            var n = notes[i];
            var isSync = (n.status === "SYNCHRONIZED");
            var check = isSync ? "[x]" : "[ ]";
            var noteTitle = n.title || (n.cfg && n.cfg.title) || "Untitled Note";
            md += "### " + (i + 1) + ". " + check + " " + noteTitle + " `[" + (n.status || "ANCHORED") + "]`\n";
            md += "* **Position (3D):** `(" + n.curPos.x.toFixed(1) + ", " + n.curPos.y.toFixed(1) + ", " + n.curPos.z.toFixed(1) + ") cm`\n";
            if (n.cfg && n.cfg.body) {
                var lines = n.cfg.body.split("\n");
                for (var l = 0; l < lines.length; l++) {
                    var line = lines[l].trim();
                    if (line) md += "  > " + line + "\n";
                }
            }
            md += "\n";
        }
    }

    md += "---\n\n";
    md += "## 🎨 Snapped Geometric Shapes & Drawings\n\n";
    if (shapes.length === 0) {
        md += "*No geometric shapes drawn in this session.*\n\n";
    } else {
        for (var s = 0; s < shapes.length; s++) {
            var sh = shapes[s];
            var w = (sh.width !== undefined) ? sh.width : ((sh.r !== undefined) ? sh.r * 2 : (sh.length || 0));
            var h = (sh.height !== undefined) ? sh.height : ((sh.r !== undefined) ? sh.r * 2 : (sh.length || 0));
            var cx = (sh.cx !== undefined) ? sh.cx : 0;
            var cy = (sh.cy !== undefined) ? sh.cy : 0;
            md += "* **Shape #" + (s + 1) + ":** `" + sh.type.toUpperCase() + "` at `(" + cx.toFixed(1) + ", " + cy.toFixed(1) + ")` | Dims: `" + w.toFixed(1) + " x " + h.toFixed(1) + "`\n";
        }
        md += "\n";
    }

    md += "---\n\n";
    md += "*Exported natively from INFINITY Spatial Computer for Snap Spectacles*\n";

    // Store report to persistent storage system
    var exportKey = "INFINITY_EXPORT_" + wsName.toUpperCase();
    if (global.persistentStorageSystem && global.persistentStorageSystem.store) {
        try {
            global.persistentStorageSystem.store.putString(exportKey, md);
            print("[INFINITY EXPORTER] Session document preserved to storage: " + exportKey);
        } catch(e) {
            print("[INFINITY EXPORTER] Persistent storage warning: " + e);
        }
    }

    print("================================================================================");
    print("[INFINITY EXPORTER] SESSION EXPORT COMPLETE (" + wsName + ")");
    print("================================================================================");
    print(md);
    print("================================================================================");

    return {
        key: exportKey,
        content: md,
        markdown: md,
        noteCount: notes.length,
        rawNotesCount: notes.length,
        shapeCount: shapes.length,
        rawShapesCount: shapes.length
    };
};

global.SessionDocumentExporter = SessionDocumentExporter;
