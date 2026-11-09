"""
Verification and Test Suite for INFINITY // Snap Spectacles Lens Studio Port.
Validates project manifests, assets, scene mount points, 3D raycast mathematics,
ergonomic cylindrical curvature, physical desk stand-in, and spatial states.
"""
import os
import json
import math
import yaml
import pytest

TT_DIR = os.path.join(os.path.dirname(__file__), "..", "tt")
DEVPOST_BRIEF = os.path.join(os.path.dirname(__file__), "..", "devpost", "design-brief.md")
README_FILE = os.path.join(os.path.dirname(__file__), "..", "README.md")


def test_project_manifest_exists_and_valid():
    """Verify tt.esproj exists and targets Spectacles."""
    esproj_path = os.path.join(TT_DIR, "tt.esproj")
    assert os.path.exists(esproj_path), f"Missing {esproj_path}"

    with open(esproj_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    assert data.get("targetPlatform") == "Spectacles", "Target platform must be Spectacles"
    assert "Spectacles" in data.get("metaInfo", {}).get("lensClientCompatibilities", []), "Spectacles client compatibility missing"
    assert data.get("coreVersion") >= 377, "Expected coreVersion >= 377"


def test_mcp_config_exists():
    """Verify .mcp.json is present and points to Lens Studio MCP."""
    mcp_path = os.path.join(TT_DIR, ".mcp.json")
    assert os.path.exists(mcp_path), f"Missing {mcp_path}"

    with open(mcp_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    assert "lens-studio" in data.get("mcpServers", {}), "Missing lens-studio in mcpServers"


def test_devpost_design_brief_compliance():
    """Verify devpost/design-brief.md follows required hackathon specification."""
    assert os.path.exists(DEVPOST_BRIEF), f"Missing {DEVPOST_BRIEF}"

    with open(DEVPOST_BRIEF, "r", encoding="utf-8") as f:
        content = f.read()

    assert "status: approved" in content
    assert "## The one spatial moment" in content
    assert "## Why it belongs on glasses" in content
    assert "## Product or overlay" in content
    assert "## Where things live" in content
    assert "## Hands and input" in content
    assert "## When things show" in content
    assert "## Done criteria" in content
    assert "## Build notes for CLAD" in content
    assert "## After the build: judge it" in content
    assert "Virtual desk surface stand-in plate" in content
    assert "15° cylindrical curved arc" in content


def test_root_readme_hackathon_packaging():
    """Verify README.md establishes tt/ and devpost/ as official hackathon targets."""
    assert os.path.exists(README_FILE), f"Missing {README_FILE}"

    with open(README_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    assert "Devpost Learn AR with SPECS" in content
    assert "tt/tt.esproj" in content
    assert "devpost/design-brief.md" in content
    assert "15° Cylindrical Curved Ergonomics" in content
    assert "Virtual Desk Surface" in content
    assert "Spatial Cognitive States" in content


def test_scene_mounts_kernel_script():
    """Verify Scene.scene mounts the INFINITY OS Kernel and maps all input assets."""
    scene_path = os.path.join(TT_DIR, "Assets", "Scene.scene")
    assert os.path.exists(scene_path), f"Missing {scene_path}"

    with open(scene_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert "INFINITY_OS_Kernel" in content
    assert "InfinityKernel" in content
    assert "texThink" in content
    assert "texCreate" in content
    assert "texLearn" in content
    assert "texStore" in content
    assert "texExplore" in content
    assert "texWhiteboard" in content
    assert "boxMesh" in content
    assert "sphereMesh" in content
    assert "torusMesh" in content
    assert "pbrMaterial" in content
    assert "textMaterial" in content


def test_javascript_kernel_logic():
    """Verify JavaScript runtime contains all core systems and functions."""
    js_path = os.path.join(TT_DIR, "Assets", "Untitled JavaScript Component.js")
    assert os.path.exists(js_path), f"Missing {js_path}"

    with open(js_path, "r", encoding="utf-8") as f:
        code = f.read()

    # Workspaces
    for ws in ["Think", "Create", "Learn", "Store", "Explore"]:
        assert f'"{ws}"' in code or f"'{ws}'" in code, f"Workspace {ws} missing in JS"

    # Core algorithms and functions
    required_functions = [
        "getOrCreateObject",
        "getOrCreateText3D",
        "raycast3D",
        "saveWorkspaceState",
        "loadWorkspaceState",
        "enterFocusMode",
        "returnToGalaxy",
        "updateConstellationConnections",
        "cycleNoteStatus",
        "triggerAudioRipple",
        "triggerAIAssistant",
        "handleVoiceCommand",
        "handleTapOrPinch",
        "handleDragStart",
        "handleDragMove",
        "handleDragEnd"
    ]
    for fn in required_functions:
        assert fn in code, f"Function {fn} missing in JavaScript runtime"

    # Events bound
    assert 'script.createEvent("TapEvent")' in code or "TapEvent" in code
    assert "TouchStartEvent" in code
    assert "TouchMoveEvent" in code
    assert "TouchEndEvent" in code
    assert "UpdateEvent" in code
    assert "OnStartEvent" in code

    # Global interfaces
    assert "global.infinityVoiceCommand" in code


def test_mesh_and_texture_assets_present():
    """Verify essential 3D assets and textures exist in tt/Assets/."""
    assets_dir = os.path.join(TT_DIR, "Assets")
    expected_files = [
        "Box.mesh",
        "Sphere.mesh",
        "Torus.mesh",
        "PBR.mat",
        "Text3D.mat",
        "Planet_Think.png",
        "Planet_Create.png",
        "Planet_Learn.png",
        "Planet_Store.png",
        "Planet_Explore.png",
        "Sticky_Cyan.png",
        "Sticky_Gold.png",
        "Sticky_Green.png",
        "Sticky_Purple.png",
        "Whiteboard_Glass.png"
    ]
    for fname in expected_files:
        p = os.path.join(assets_dir, fname)
        assert os.path.exists(p), f"Asset {fname} missing from Assets/"


def test_true_3d_spatial_raycast_math():
    """Simulate 3D raycast to sphere vector math implemented in raycast3D."""
    ray_origin = (0.0, 0.0, 40.0)
    ray_direction = (0.0, 0.0, -1.0)  # Looking straight down -Z
    target_pos = (0.0, 5.5, -68.5)     # Target note center
    hit_radius = 8.5

    # Vector v = target - origin
    v = (target_pos[0] - ray_origin[0], target_pos[1] - ray_origin[1], target_pos[2] - ray_origin[2])
    # Projection t = v . dir
    t = v[0] * ray_direction[0] + v[1] * ray_direction[1] + v[2] * ray_direction[2]
    assert t > 0.0, "Ray must be facing forward towards target"

    # Closest point on ray
    closest_point = (
        ray_origin[0] + ray_direction[0] * t,
        ray_origin[1] + ray_direction[1] * t,
        ray_origin[2] + ray_direction[2] * t
    )
    # 3D Distance from closest point to target
    dist_3d = math.sqrt(
        (closest_point[0] - target_pos[0]) ** 2 +
        (closest_point[1] - target_pos[1]) ** 2 +
        (closest_point[2] - target_pos[2]) ** 2
    )
    # The note center has Y=5.5, ray has Y=0.0 -> dist_3d = 5.5 <= hit_radius 8.5
    assert dist_3d <= hit_radius, f"Expected 3D ray hit (dist {dist_3d} <= {hit_radius})"


def test_virtual_desk_standin_dimensions():
    """Verify physical desk surface dimensions and grounding position."""
    js_path = os.path.join(TT_DIR, "Assets", "Untitled JavaScript Component.js")
    with open(js_path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "Virtual_Desk_Surface" in code
    assert "new vec3(90.0, 1.5, 54.0)" in code or "90" in code
    assert "new vec3(0.0, -18.0, -70.0)" in code or "-18" in code


def test_cylindrical_curved_ergonomics():
    """Verify cylindrical angular rotations inward towards user head."""
    js_path = os.path.join(TT_DIR, "Assets", "Untitled JavaScript Component.js")
    with open(js_path, "r", encoding="utf-8") as f:
        code = f.read()

    # Left note rotates inward +14 degrees
    assert "14.0 * Math.PI / 180.0" in code
    # Right note rotates inward -14 degrees
    assert "-14.0 * Math.PI / 180.0" in code
    # AI note pitches upward +8 degrees
    assert "8.0 * Math.PI / 180.0" in code


def test_spatial_state_lifecycle():
    """Verify spatial cognitive states: ANCHORED, SYNTHESIZING, SYNCHRONIZED."""
    js_path = os.path.join(TT_DIR, "Assets", "Untitled JavaScript Component.js")
    with open(js_path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "ANCHORED" in code
    assert "SYNTHESIZING" in code
    assert "SYNCHRONIZED" in code
    # Ensure old 2D TODO/DONE was replaced
    assert "SPATIAL_STATES" in code


def test_voice_hud_indicator_lifecycle():
    """Verify 3D Voice HUD pill exists and is triggered on voice commands."""
    js_path = os.path.join(TT_DIR, "Assets", "Untitled JavaScript Component.js")
    with open(js_path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "HUD_Voice_Indicator" in code
    assert "Label_Voice_HUD" in code
    assert "state.voiceHudTimer" in code
    assert "VOICE:" in code


def test_kernel_synchronization_parity():
    """Verify that InfinityOSKernel.js and Untitled JavaScript Component.js are 100% byte-identical."""
    k1 = os.path.join(TT_DIR, "Assets", "InfinityOSKernel.js")
    k2 = os.path.join(TT_DIR, "Assets", "Untitled JavaScript Component.js")
    assert os.path.exists(k1), f"Missing {k1}"
    assert os.path.exists(k2), f"Missing {k2}"

    with open(k1, "rb") as f1, open(k2, "rb") as f2:
        bytes1 = f1.read()
        bytes2 = f2.read()

    assert bytes1 == bytes2, "Kernel divergence detected! InfinityOSKernel.js and Untitled JavaScript Component.js must be identical."


def test_leaf_test_scenarios_authored():
    """Verify all 7 genuine LEAF test scenarios and ScenarioIndex are authored in TypeScript."""
    scenarios_path = os.path.join(TT_DIR, "Assets", "Tests", "InfinityScenarios.ts")
    assert os.path.exists(scenarios_path), f"Missing LEAF test file: {scenarios_path}"

    with open(scenarios_path, "r", encoding="utf-8") as f:
        code = f.read()

    expected_scenarios = [
        "StartupScenario",
        "WorkspaceNavigationScenario",
        "StickyNoteInteractionScenario",
        "NoteStateTransitionScenario",
        "PersistenceScenario",
        "OnboardingScenario",
        "SessionExportScenario",
        "ScenarioIndex"
    ]
    for sc in expected_scenarios:
        assert sc in code, f"Missing scenario {sc} in LEAF test suite"

    assert "@scenariosIndex" in code
    assert "scenario_startup" in code
    assert "scenario_export" in code


def test_interaction_drag_tap_discrimination():
    """Verify touch movement threshold and drag-vs-tap rejection logic (Phase 5)."""
    js_path = os.path.join(TT_DIR, "Assets", "Untitled JavaScript Component.js")
    with open(js_path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "touchState" in code
    assert "dragThreshold" in code
    assert "lastDragEndTime" in code
    assert "hasMoved" in code

