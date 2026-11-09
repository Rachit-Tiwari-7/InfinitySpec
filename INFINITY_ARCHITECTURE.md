# INFINITY // System Architecture & Subsystem Specification
**Hardware Target:** Snap Spectacles 2024 (Dual Optical Waveguides, 46° FOV, 6DoF Tracking)  
**SDK Environment:** Lens Studio 5.24.1 + Spectacles Interaction Kit (SIK)  
**Architecture Document Version:** 2.0 (Post-Audit Clean Baseline)

---

## 1. High-Level System Architecture

INFINITY implements a **Unified Spatial Whiteboard OS Kernel Architecture**. The core runtime execution is centralized within an authoritative, zero-dependency kernel (`InfinityOSKernel.js`), while modular subsystems (Editor, Inking, Exporter, Onboarding, Surface Anchor, AI Bridge) interface via a deterministic lifecycle bus.

```
                              ┌──────────────────────────────────────────────┐
                              │           Snap Spectacles Hardware           │
                              │  (6DoF Pose, Hand Tracking, Optical Display) │
                              └──────────────────────┬───────────────────────┘
                                                     │
                                                     ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       INFINITY OS Kernel Architecture                                  │
├────────────────────────────────────────────────────┬───────────────────────────────────────────────────┤
│                     INPUT BUS                      │                 COGNITIVE KERNEL                  │
│ • SIK Native HandInputData (6DoF Hands)            │ • 5 Cosmic Workspaces (Think, Create, Learn, ...) │
│ • Pinch Hysteresis (Down: 3.0cm, Up: 4.5cm)        │ • 3D Note Cards with 15° Cylindrical Curvature    │
│ • Tap vs. Drag Discriminator (<0.35s / <2.0cm)     │ • Cognitive State Machine (Anchor/Sync/Synth)     │
│ • Double-Tap 3D Note Editor Launcher               │ • 3D Force-Directed Constellation Galaxy Layout   │
│ • Closed-Fist Canvas Clear Filter                  │ • Physical Desk Stand-In Plate (35° Recline)      │
├────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
│                 MODULAR SUBSYSTEMS                 │               OUTPUT & FEEDBACK                   │
│ • NoteEditorKeyboard (3D Easel + Virtual Keys)     │ • 60 FPS Render Loop (Lerp + Waveguide Colors)    │
│ • ShapeRecognizer (Circle, Rect, Line Heuristics)  │ • Procedural Audio Ripple & Wav Chimes            │
│ • LiveAIAssistantModule (Curriculum Synthesizer)   │ • Auto-Dismiss HUD Toasts (0 idle FOV clutter)    │
│ • SessionDocumentExporter (Markdown + JSON)        │ • Contact Shadow Waveguide Grounding              │
│ • SurfaceAnchorEngine (WorldQuery Hit-Testing)     │ • PersistentStorageSystem (Cross-Session Cache)   │
└────────────────────────────────────────────────────┴───────────────────────────────────────────────────┘
```

---

## 2. Module Responsibilities & Authoritative Layout

```
tt/Assets/
├── InfinityOSKernel.js          # Authoritative Single Source of Truth Runtime Kernel
├── Untitled JavaScript Component.js # Synchronized Legacy Mirror
├── NoteEditorKeyboardModule.js  # 3D Note Editor Easel & Virtual Keyboard Subsystem
├── ShapeRecognizerModule.js      # Robust Geometric Stroke Recognizer (Circle/Rect/Line)
├── DrawingAndSnappingModule.js  # 3D Polyline Inking & Segment Object Pool
├── FTUEOnboardingModule.js      # 3-Step First-Time User Experience State Machine
├── SessionExporterModule.js     # Volumetric Session Exporter (Markdown & Schema JSON)
├── LiveAIAssistantModule.js     # On-Device Curriculum Knowledge Synthesizer
├── DesktopCompanionSyncModule.js# Desktop Companion Local Note Ingestion Bridge
├── SurfaceAnchorEngine.ts       # Physical Desk Detection & Surface Tangent Math
├── WristCompanionDock.ts        # Hand-Anchored Holographic AI Assistant Orb
├── InfinityCustomInteractor.ts  # Custom SIK Controller Interactor (Type 1<<4)
├── InfinityFocusNavigationGroup.ts # Discrete Spatial Focus Navigation Ring
├── ConstellationGraphEngine.ts  # Obsidiar 3D Fruchterman-Reingold Force Relaxer
├── HandPoseEngine.ts            # QWERTY Geometric Hand Posture Filters
└── Tests/
    └── InfinityScenarios.ts     # LEAF 10-Scenario Automated In-Engine Test Suite
```

---

## 3. Subsystem Breakdown & Component Contracts

### 1. Spatial Kernel (`InfinityOSKernel.js`)
- **Responsibility:** Manages global scene objects, 5 workspace configurations, note lifecycle, 60 FPS lerp interpolation, audio chimes, and input routing.
- **Scene Attachment:** Attached to `INFINITY_OS_Kernel` object in `Scene.scene` via ScriptAsset GUID `a87d12f4-7128-4ce6-91d1-678239e248b1`.
- **Inputs:** `texThink`, `texCreate`, `texLearn`, `texStore`, `texExplore`, `texWhiteboard`, `boxMesh`, `sphereMesh`, `torusMesh`, `pbrMaterial`, `textMaterial`.

### 2. Note Editor & Keyboard Subsystem (`NoteEditorKeyboard`)
- **Responsibility:** Provides an in-situ 3D drafting easel and compact 3-row alphanumeric virtual keyboard deck.
- **Interaction Contract:**
  - `openEditor(note)`: Activated by double-tapping any note card within 380ms or via voice command "open editor".
  - Keycaps: Raycast-selectable 3D keys with real-time text cursor insertion and deletion (`BKSP`).
  - `TAB`: Toggles active edit target between Note Title and Note Body.
  - `SAVE`: Commits changes to the note card, triggers audio ripple, updates persistent storage, and closes easel.

### 3. Geometric Shape Recognizer (`ShapeRecognizer`)
- **Responsibility:** Analyzes 2D/3D polyline strokes drawn by the user and classifies them into clean CAD primitives.
- **Classification Rules:**
  - **Circle:** `isClosed && stdR / meanR < 0.28 && aspect > 0.65`.
  - **Rectangle:** `isClosed && 4-corner coverage (maxCornerDist / diag < 0.28) && mean boundary distance < 0.20 * minDim`.
  - **Line:** `!isClosed && straightDist / totalLength > 0.82 && maxDev / len < 0.18`.
  - **Chaotic Stroke:** Returns `null` without false positives.

### 4. 3D Constellation Knowledge Graph (`ConstellationGraphEngine`)
- **Responsibility:** When returning to Galaxy overview, calculates a 3D Fruchterman-Reingold force-directed spherical layout using Golden-Angle Fibonacci distribution.
- **Zero-Allocation Math:** Operates on flat `Float32Array` buffers to prevent GC pauses on Spectacles hardware.

### 5. Wrist Companion Holographic Orb (`WristCompanionDock`)
- **Responsibility:** Anchors the AI Assistant core to the user's non-dominant (left) wrist when docked, scaling down to 0.35x.
- **Glance Gating:** Active only when `leftHand.isTracked() && leftHand.isFacingCamera()`.
- **Undocked Mode:** Lerps to world space at `(-2.0, -8.5, -67.5)` at full 1.0x scale when invoked.

---

## 4. Deterministic Initialization Sequence

```
1. Script OnStartEvent Fires
   ├── 1. Link Camera: Query scene hierarchy roots for "Camera Object"
   ├── 2. Connectivity HUD: Check global.deviceInfoSystem (Online/Offline)
   ├── 3. Desk Stand-In: Instantiate Virtual_Desk_Surface (90x1.2x54cm at 35° recline)
   ├── 4. Grounding Calibration: Instantiate height controls & textbook anchor
   ├── 5. Celestial Dock: Instantiate 5 Planetary Orbs & Orbit Labels
   ├── 6. Translucent Whiteboard: Instantiate Spatial_Whiteboard glass backplate
   ├── 7. Auto-Dismiss Voice HUD: Instantiate HUD_Voice_Indicator (blank when idle)
   ├── 8. Note Cards: Instantiate 4 Cylindrical Notes & Grounding Contact Shadows
   ├── 9. Constellation Beams: Instantiate 4 PBR cylinder link corridors
   ├── 10. AI Assistant Core: Instantiate AI_Assistant_Core sphere (cached on state)
   ├── 11. Subsystems:
   │    ├── Subsystem 0: SurfaceTrackingManager
   │    ├── Subsystem 1: FTUEOnboarding ("INFINITY_FTUE_V3")
   │    ├── Subsystem 2: NoteEditorKeyboard
   │    ├── Subsystem 3: DrawingAndSnappingModule
   │    ├── Subsystem 4: LiveAIAssistantModule (Curriculum Synthesizer)
   │    └── Subsystem 5: DesktopCompanionSyncModule
   ├── 12. Boot Focus Mode: enterFocusMode("Think")
   └── 13. SIK Hand Tracking: Connect HandInputData with pinch hysteresis
```

---

## 5. Event Flow & Interaction Hierarchy

```
[User Action]
      │
      ├─► [Pinch / Touch Move]
      │         │
      │         ├─► Over Note? ──► [Drag Note] (Clamped to 108cm desk volume)
      │         │
      │         └─► Over Canvas? ──► [Start Inking] ──► [ShapeRecognizer] ──► [Snap 3D Primitive]
      │
      ├─► [Pinch / Touch Release]
      │         │
      │         ├─► Move > 2.0cm? ──► [Finish Drag] ──► [Save Workspace Coordinates]
      │         │
      │         └─► Move <= 2.0cm & Elapsed <= 0.35s? (TAP)
      │                   │
      │                   ├─► Tapped Note twice within 0.38s? ──► [Open 3D Note Editor]
      │                   │
      │                   ├─► Single Tap on Note? ──► [Cycle Cognitive State] (Anchor -> Sync -> Synth)
      │                   │
      │                   ├─► Tapped Planet Orb? ──► [Switch Workspace Focus]
      │                   │
      │                   ├─► Tapped Summarize Button? ──► [Generate Knowledge Graph Summary Node]
      │                   │
      │                   └─► Tapped AI Orb? ──► [Toggle Wrist Dock / Undock]
      │
      ├─► [Two-Hand Pinch] ──► [Textbook Frame / Dual Node Manipulation]
      │
      └─► [Closed Fist] ──► [Clear Voice Notes / Minimize Canvas]
```

---

## 6. Persistence & Session Data Flow

```
                      ┌────────────────────────┐
                      │  Active Workspace Mode │
                      └───────────┬────────────┘
                                  │
                  Save Action (DragEnd / Switch / Save)
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     saveWorkspaceState(wsKey)                   │
│ Serializes:                                                     │
│ • Note ID, Target 3D Position (x, y, z)                         │
│ • Cognitive Status (ANCHORED, SYNCHRONIZED, SYNTHESIZING)       │
│ • Content (Title, Body text)                                    │
│ • Origin (isCustom flag for voice/desktop notes)                │
└────────────────┬───────────────────────────────┬────────────────┘
                 │                               │
                 ▼                               ▼
    ┌─────────────────────────┐     ┌───────────────────────────┐
    │  state.persistentCache  │     │  persistentStorageSystem  │
    │   (In-Memory Backup)    │     │  (Device Storage on Lens) │
    └─────────────────────────┘     └───────────────────────────┘
```

---

## 7. Performance & Resource Allocation Strategy

1. **Zero-GC Update Loops:** Material updates and coordinate math reuse existing structures; new vector allocations in per-frame update loops are strictly gated by motion or opacity delta thresholds (> 0.005).
2. **Scene Hierarchy Cache:** Key scene objects (`state.aiCore`, `state.whiteboard`, `state.camera`) are resolved once during `OnStartEvent` and cached directly on the kernel state.
3. **Cockpit Visibility Management:** Planetary dock labels and decorative elements outside the active focal plane are deactivated during deep focus sessions to maximize optical waveguide transmission contrast and battery life.
