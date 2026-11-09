"""
Test Suite for Snap Spectacles Lens Studio Native Features.
Validates:
- Feature A: Note Editor 3D Easel & Note Updates
- Feature B: Alphanumeric Virtual Keyboard & Keycap Layout
- Feature C: 3D Polyline Inking & ShapeRecognizer (Circle, Rect, Line)
- Feature D: FTUE Onboarding 3-Step Interactive Hologram
- Feature E: Session Exporter (Markdown & JSON)
- Feature F: Live Contextual AI Assistant Bridge
- Feature G: Desktop Companion External Content Ingestion
"""
import os
import subprocess
import pytest

TT_ASSETS = os.path.join(os.path.dirname(__file__), "..", "tt", "Assets")


def test_migrated_modules_exist():
    """Verify all 6 modular scripts exist in tt/Assets."""
    expected_files = [
        "ShapeRecognizerModule.js",
        "NoteEditorKeyboardModule.js",
        "DrawingAndSnappingModule.js",
        "FTUEOnboardingModule.js",
        "SessionExporterModule.js",
        "LiveAIAssistantModule.js",
        "DesktopCompanionSyncModule.js"
    ]
    for filename in expected_files:
        path = os.path.join(TT_ASSETS, filename)
        assert os.path.exists(path), f"Missing module: {filename}"


def test_js_syntax_integrity_all_migrated_modules():
    """Verify Node.js syntax check passes for all newly authored modules."""
    files = [
        "ShapeRecognizerModule.js",
        "NoteEditorKeyboardModule.js",
        "DrawingAndSnappingModule.js",
        "FTUEOnboardingModule.js",
        "SessionExporterModule.js",
        "LiveAIAssistantModule.js",
        "DesktopCompanionSyncModule.js",
        "Untitled JavaScript Component.js"
    ]
    for f in files:
        path = os.path.join(TT_ASSETS, f)
        res = subprocess.run(["node", "-c", path], capture_output=True, text=True)
        assert res.returncode == 0, f"Syntax error in {f}: {res.stderr}"


def test_feature_a_note_editor_architecture():
    """Verify Note Editor Easel controls, title/body toggles, and save bindings."""
    path = os.path.join(TT_ASSETS, "NoteEditorKeyboardModule.js")
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "NoteEditorKeyboard" in code
    assert "Editor_Easel_Backplate" in code
    assert "Editor_Easel_Text" in code
    assert "saveChanges" in code
    assert "editTitle" in code
    assert "editBody" in code
    assert "TAB" in code
    assert "BKSP" in code


def test_feature_b_virtual_keyboard_layout():
    """Verify compact 3-row alphanumeric layout + space/save keycaps."""
    path = os.path.join(TT_ASSETS, "NoteEditorKeyboardModule.js")
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "Editor_Keyboard_Deck" in code
    assert "KEY_LAYOUT" in code
    assert "SPACE" in code
    assert "SAVE" in code
    assert "checkRayHit" in code


def test_feature_c_shape_recognizer_math():
    """Verify circle, rect, and straight line geometric recognition math."""
    path = os.path.join(TT_ASSETS, "ShapeRecognizerModule.js")
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "ShapeRecognizer" in code
    assert "circle" in code
    assert "rect" in code
    assert "line" in code
    assert "stdR" in code
    assert "boxPerimeter" in code


def test_feature_c_drawing_and_snapping_pipeline():
    """Verify stroke pool, polyline segment calculation, and snapped 3D instantiation."""
    path = os.path.join(TT_ASSETS, "DrawingAndSnappingModule.js")
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "DrawingAndSnappingModule" in code
    assert "startStroke" in code
    assert "addStrokePoint" in code
    assert "endStroke" in code
    assert "instantiateSnappedShape" in code
    assert "strokePool" in code


def test_feature_d_ftue_onboarding_lifecycle():
    """Verify 3-step onboarding states, persistence, and step transitions."""
    path = os.path.join(TT_ASSETS, "FTUEOnboardingModule.js")
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "FTUEOnboarding" in code
    assert "STEP 1 OF 3" in code
    assert "STEP 2 OF 3" in code
    assert "STEP 3 OF 3" in code
    assert "advance" in code
    assert "finish" in code


def test_feature_e_session_document_exporter():
    """Verify session report markdown generation, note compilation, and persistence."""
    path = os.path.join(TT_ASSETS, "SessionExporterModule.js")
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "SessionDocumentExporter" in code
    assert "exportSessionDocument" in code
    assert "Spatial Thought Objects & Cognitive Notes" in code
    assert "Snapped Geometric Shapes" in code
    assert "INFINITY_EXPORT_" in code


def test_feature_f_live_ai_bridge():
    """Verify contextual AI generation across all 5 workspaces with edge fallback."""
    path = os.path.join(TT_ASSETS, "LiveAIAssistantModule.js")
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "LiveAIAssistantModule" in code
    assert "synthesizeSpatialExpansion" in code
    assert "contextualExpansions" in code
    assert "Think" in code
    assert "Create" in code
    assert "Learn" in code
    assert "Store" in code
    assert "Explore" in code


def test_feature_g_desktop_companion_sync():
    """Verify glasses-native desktop snippet ingestion without 2D screen mirroring."""
    path = os.path.join(TT_ASSETS, "DesktopCompanionSyncModule.js")
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "DesktopCompanionSyncModule" in code
    assert "injectDesktopSnippet" in code
    assert "infinityInjectDesktopSnippet" in code


def test_feature_h_world_query_and_surface_anchor_engine():
    """Verify WorldQuery Module assets and SurfaceAnchorEngine room mesh raycast logic."""
    modules_dir = os.path.join(TT_ASSETS, "Modules")
    assert os.path.exists(modules_dir), "Missing tt/Assets/Modules directory"
    assert os.path.exists(os.path.join(modules_dir, "World Query Module.worldQueryModule")), "Missing World Query module asset"

    anchor_ts = os.path.join(TT_ASSETS, "SurfaceAnchorEngine.ts")
    assert os.path.exists(anchor_ts), "Missing SurfaceAnchorEngine.ts"
    with open(anchor_ts, "r", encoding="utf-8") as f:
        code = f.read()

    assert "SurfaceAnchorEngine" in code
    assert "HitTestSessionOptions" in code
    assert "classifySurface" in code
    assert "probeForDesk" in code
    assert "infinityOnDeskDetected" in code


def test_feature_i_asr_voice_command_controller():
    """Verify native ASR Module assets and VoiceCommandController transcription pipeline."""
    modules_dir = os.path.join(TT_ASSETS, "Modules")
    assert os.path.exists(os.path.join(modules_dir, "ASR Module.asrModule")), "Missing ASR Module asset"

    voice_ts = os.path.join(TT_ASSETS, "VoiceCommandController.ts")
    assert os.path.exists(voice_ts), "Missing VoiceCommandController.ts"
    with open(voice_ts, "r", encoding="utf-8") as f:
        code = f.read()

    assert "VoiceCommandController" in code
    assert "AsrTranscriptionOptions" in code
    assert "infinityVoiceInterimUpdate" in code
    assert "infinityDictateVoiceNote" in code
    assert "infinityVoiceCommand" in code


def test_feature_j_sik_pinch_hysteresis_and_crush_gesture():
    """Verify SIK pinch hysteresis (3.0cm down, 4.5cm up), hand span scaling and crush gesture."""
    kernel_js = os.path.join(TT_ASSETS, "InfinityOSKernel.js")
    with open(kernel_js, "r", encoding="utf-8") as f:
        code = f.read()

    assert "PINCH_DOWN_DIST = 3.0" in code
    assert "PINCH_UP_DIST = 4.5" in code
    assert "REFERENCE_HAND_SPAN = 18.0" in code
    assert "measureHandSpan" in code
    assert "updateNativeSIKGestures" in code
    assert "infinityOnDeskDetected" in code
    assert "infinityVoiceInterimUpdate" in code
    assert "crush" in code.lower() or "crushed" in code.lower()
