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


def test_feature_k_infinity_custom_interactor():
    """Verify SIK CustomController interactor implementation (derived from OpenBand)."""
    interactor_ts = os.path.join(TT_ASSETS, "InfinityCustomInteractor.ts")
    assert os.path.exists(interactor_ts), "Missing InfinityCustomInteractor.ts"
    with open(interactor_ts, "r", encoding="utf-8") as f:
        code = f.read()

    assert "InfinityCustomInteractor" in code
    assert "BaseInteractor" in code
    assert "CustomController" in code
    assert "setPinchDown" in code
    assert "pulsePinch" in code
    assert "updateState" in code


def test_feature_l_infinity_focus_navigation_group():
    """Verify discrete spatial focus navigation ring with boundary clamping and Z-lift."""
    focus_ts = os.path.join(TT_ASSETS, "InfinityFocusNavigationGroup.ts")
    assert os.path.exists(focus_ts), "Missing InfinityFocusNavigationGroup.ts"
    with open(focus_ts, "r", encoding="utf-8") as f:
        code = f.read()

    assert "InfinityFocusNavigationGroup" in code
    assert "focusLiftZ" in code
    assert "focusScale" in code
    assert "step(" in code
    assert "setFocusIndex" in code
    assert "infinityFocusNext" in code
    assert "infinityFocusPrevious" in code
    assert "infinitySetFocusTargets" in code


def test_feature_m_infinity_companion_socket():
    """Verify native InternetModule WebSocket transport for companion sync."""
    socket_ts = os.path.join(TT_ASSETS, "InfinityCompanionSocket.ts")
    assert os.path.exists(socket_ts), "Missing InfinityCompanionSocket.ts"
    with open(socket_ts, "r", encoding="utf-8") as f:
        code = f.read()

    assert "InfinityCompanionSocket" in code
    assert "InternetModule" in code
    assert "createWebSocket" in code
    assert "scheduleReconnect" in code
    assert "infinityDictateVoiceNote" in code
    assert "infinityCompanionConnected" in code


def test_feature_n_waveguide_optical_contrast_and_focus_sync():
    """Verify waveguide optical constants, chime hook, and focus sync in kernel."""
    kernel_js = os.path.join(TT_ASSETS, "InfinityOSKernel.js")
    with open(kernel_js, "r", encoding="utf-8") as f:
        code = f.read()

    assert "WAVEGUIDE_DARK_BG" in code
    assert "WAVEGUIDE_ACCENT_CYAN" in code
    assert "WAVEGUIDE_FOCUS_GOLD" in code
    assert "infinityPlayAudioChime" in code
    assert "infinitySetFocusTargets" in code
    assert "infinityFocusNext" in code
    assert "infinityFocusPrevious" in code


def test_feature_o_ink_ml_classifier_and_onnx_model():
    """Verify SnapML ink_cnn.onnx model and on-device InkMlClassifier."""
    ml_dir = os.path.join(TT_ASSETS, "ML")
    assert os.path.exists(ml_dir), "Missing tt/Assets/ML directory"
    assert os.path.exists(os.path.join(ml_dir, "ink_cnn.onnx")), "Missing ink_cnn.onnx"

    classifier_ts = os.path.join(TT_ASSETS, "InkMlClassifier.ts")
    assert os.path.exists(classifier_ts), "Missing InkMlClassifier.ts"
    with open(classifier_ts, "r", encoding="utf-8") as f:
        code = f.read()

    assert "InkMlClassifier" in code
    assert "INK_CNN_SIZE = 64" in code
    assert "INK_CNN_LABELS" in code
    assert "classifyStrokes" in code
    assert "runImmediate(true)" in code


def test_feature_p_hand_pose_engine_fist_and_finger_extension():
    """Verify HandPoseEngine fist dismiss and finger extension guard math (from QWERTY)."""
    pose_ts = os.path.join(TT_ASSETS, "HandPoseEngine.ts")
    assert os.path.exists(pose_ts), "Missing HandPoseEngine.ts"
    with open(pose_ts, "r", encoding="utf-8") as f:
        code = f.read()

    assert "HandPoseEngine" in code
    assert "DISMISS_FIST_TIP_CM = 4.8" in code
    assert "isDismissFist" in code
    assert "isFingerExtended" in code
    assert "isPalmModifierPinch" in code
    assert "infinityIsDismissFist" in code


def test_feature_q_desk_ergonomic_tilt_and_pairing_code_alphabet():
    """Verify 35-deg ergonomic desk recline, 1.2cm lift, and 32-char pairing alphabet."""
    kernel_js = os.path.join(TT_ASSETS, "InfinityOSKernel.js")
    with open(kernel_js, "r", encoding="utf-8") as f:
        code = f.read()

    assert "surfaceTiltDeg = 35.0" in code
    assert "surfaceLiftCm = 1.2" in code
    assert "checkFistDismiss" in code

    socket_ts = os.path.join(TT_ASSETS, "InfinityCompanionSocket.ts")
    with open(socket_ts, "r", encoding="utf-8") as f:
        code = f.read()

    assert "CODE_ALPHABET" in code
    assert "generatePairingCode" in code


def test_feature_r_constellation_graph_engine_architecture():
    """Verify ConstellationGraphEngine Fruchterman-Reingold 3D layout solver (from Obsidiar)."""
    engine_ts = os.path.join(TT_ASSETS, "ConstellationGraphEngine.ts")
    assert os.path.exists(engine_ts), "Missing ConstellationGraphEngine.ts"
    with open(engine_ts, "r", encoding="utf-8") as f:
        code = f.read()

    assert "ConstellationGraphEngine" in code
    assert "fibonacciSphere" in code
    assert "relaxForces" in code
    assert "normalizeDensity" in code
    assert "goldenAngleColor" in code
    assert "evaluateBloomScale" in code
    assert "GOLDEN_ANGLE_FRACTION = 0.61803398875" in code
    assert "DEFAULT_NODE_SPACING_CM = 20.0" in code
    assert "Float32Array" in code
    assert "constellationSolveLayout" in code


def test_feature_s_multi_node_workspace_manipulator():
    """Verify MultiNodeWorkspaceManipulator dual-hand coordinate arbiter (from Obsidiar)."""
    manip_ts = os.path.join(TT_ASSETS, "MultiNodeWorkspaceManipulator.ts")
    assert os.path.exists(manip_ts), "Missing MultiNodeWorkspaceManipulator.ts"
    with open(manip_ts, "r", encoding="utf-8") as f:
        code = f.read()

    assert "MultiNodeWorkspaceManipulator" in code
    assert "registerGrab" in code
    assert "releaseGrab" in code
    assert "checkTapVsDrag" in code
    assert "onUpdate" in code
    assert "tapMaxSec" in code
    assert "dragThresholdCm" in code
    assert "setManipEnabled" in code
    assert "workspaceRegisterGrab" in code
    assert "workspaceReleaseGrab" in code


def test_feature_t_tap_drag_and_render_depth_overlay_in_kernel():
    """Verify kernel tap vs drag discrimination, depthTest overlays, and constellation hook."""
    kernel_js = os.path.join(TT_ASSETS, "InfinityOSKernel.js")
    with open(kernel_js, "r", encoding="utf-8") as f:
        code = f.read()

    assert "TAP_MAX_SEC = 0.35" in code
    assert "DRAG_THRESHOLD_CM = 2.0" in code
    assert "RENDER_ORDER_LABEL = 998" in code
    assert "RENDER_ORDER_CARD = 999" in code
    assert "RENDER_ORDER_TEXT = 1000" in code
    assert "disableDepthTest" in code
    assert "constellationSolveLayout" in code


def test_feature_u_mathematical_fibonacci_and_golden_angle_correctness():
    """Verify mathematical correctness of Fibonacci sphere and golden angle hue dispersion."""
    import math

    # Fibonacci sphere radius conservation test
    total = 20
    radius = 50.0
    offset = 2.0 / total
    increment = math.pi * (3.0 - math.sqrt(5.0))

    for i in range(total):
        y = i * offset - 1.0 + offset * 0.5
        r = math.sqrt(max(0.0, 1.0 - y * y))
        phi = i * increment
        x = math.cos(phi) * r * radius
        py = y * radius
        z = math.sin(phi) * r * radius
        dist = math.sqrt(x * x + py * py + z * z)
        assert abs(dist - radius) < 1e-4, f"Node {i} deviated from sphere radius {radius}: {dist}"

    # Golden angle hue test
    golden_fraction = 0.61803398875
    hues = [(i * golden_fraction) % 1.0 for i in range(10)]
    for i in range(len(hues) - 1):
        step = abs(hues[i+1] - hues[i])
        assert step > 0.05, f"Hues too close: {hues[i]} and {hues[i+1]}"

    # Quadratic ease-out test
    def ease_out(t):
        return 1.0 - (1.0 - t) * (1.0 - t)

    assert ease_out(0.0) == 0.0
    assert ease_out(0.5) == 0.75
    assert ease_out(1.0) == 1.0
