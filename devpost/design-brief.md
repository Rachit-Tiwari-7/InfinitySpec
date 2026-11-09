---
status: approved
---

# Design brief: INFINITY // Spatial Study Copilot & Ambient Knowledge Canvas for Snap SPECS

## The one spatial moment
The student sits at their physical desk wearing Snap Spectacles 2024. Floating concentric to their field of view at a natural 70 cm reading distance is an interactive, 6DoF knowledge constellation for **Quantum Computing 101**. The student glances between their physical textbook and glowing 3D cards explaining Superposition, Entanglement, and Decoherence. When they pinch and connect an arrow between two concepts, a radiant constellation beam locks them together. Tapping the AI Copilot synthesizes a cross-concept cognitive study card, while glancing away at a classmate automatically dims the virtual notes to 22% opacity—keeping the physical room primary.

## Why it belongs on glasses
- Uses: draws in the world, leaves your body free, shares your view
- Why it's better than the phone or laptop version: On a laptop or phone, a digital mind map or study board is crammed into a flat 2D viewport that demands constant manual panning, trackpad scrolling, and tab-switching away from real textbooks or code editors. On SPECS glasses, ideas live anchored in the physical room around you at real 6DoF scale, connected by dynamic 3D constellation beams, leaving your hands and body completely free to write, code, and learn.

## Product or overlay
- Type: product
- What the real version senses: Physical surfaces (table or desk) via `WorldQueryModule` depth mesh and user hand tracking via Spectacles Interaction Kit (SIK).
- Stand-in for preview: Virtual desk surface stand-in plate (90x55x1.2 cm) with instant table elevation calibration (`[ ▲ +5cm ]`, `[ ▼ -5cm ]`, `[ ◉ Snap ]`), contact shadows grounding each note, and celestial planetary dock positioned at comfortable seated ergonomic distance (68 to 92 cm).

## Where things live
- Where the user is looking during the main task: Centered slightly below eye level (eye gaze down 10-15 degrees), seated at arm's length (Z = -68 to -92 cm).
- Virtual Desk Surface: Physical reference surface (90 cm width, 54 cm depth, 1.2 cm thickness at Y = -18 cm, Z = -70 cm) with contact shadows grounding virtual cards to the table.
- Celestial Planetary Dock: An arc of 5 planetary orbs (Think, Create, Learn, Store, Explore) situated in the upper visual periphery (Y = +14 to +17.5 cm, Z = -86 to -92 cm, scale 5.2 to 8.0 cm).
- Spatial Whiteboard: Transparent dark-glass floating surface (width 56 cm, height 30 cm, depth 0.4 cm at Z = -72 cm) that automatically attenuates to 22% opacity when the user looks away into the physical room.
- Quantum Computing 101 Courseware Notes: 4 high-contrast acrylic note cards arranged along a 15° cylindrical curved arc (width 13.2 cm, height 8.2 cm, depth 0.5 cm) with title, quantum formula/body, spatial cognitive state badge (`ANCHORED`, `SYNTHESIZING`, `SYNCHRONIZED`), and glowing accent borders.
- 3D Targeting Reticle: A dual-ring glowing cursor tracking the 3D raycast hit point on desks and notes, scaling up and turning radiant gold on hover.
- Dynamic Constellation Beams: Glowing cylindrical energy links connecting dependent notes (thickness 0.24 cm, dynamically pulsing at 60 FPS).
- AI Assistant Core: Pulsing holographic sphere (radius 4.2 cm at X = -2 cm, Y = -8.5 cm, Z = -67.5 cm) paired with a one-tap `[ ✦ SUMMARIZE GRAPH ]` synthesizer button.
- 3D Voice HUD Capsule: Floating status capsule (width 26 cm, height 3.2 cm at Y = +11.2 cm) displaying hands-free voice status.
- In-Lens Volumetric Export Modal: Floating 3D parchment board displaying complete markdown notes with `[ 📋 SYNC DESKTOP ]` and `[ ✕ DISMISS ]` buttons.

## Hands and input
- Pinch Planet: Switch active workspace (Think, Create, Learn, Store, Explore) with smooth celestial fly-in / orbit animation.
- Pinch & Drag Note: Grab any sticky note with direct pinch or raycast pinch, move it anywhere in 3D space; constellation beams stretch and re-orient in real-time.
- Pinch AI Core / Summarize Button: Synthesizes a new contextual idea node, triggers an expanding spatial audio ripple wave, and injects it into the constellation graph.
- Tap Note: Cycles spatial cognitive state (`ANCHORED` ➔ `SYNTHESIZING` ➔ `SYNCHRONIZED`).
- Hover Aim: Continuous 3D vector raycast cue expanding target note scale by +14% and highlighting the 3D targeting reticle.
- Table Elevation Controls: Tap `[ ▲ +5cm ]` or `[ ▼ -5cm ]` on the desk rim to calibrate virtual notes to the physical desk height.
- Voice Dictation: Tap `[ 🎙️ DICTATE ]` or use `global.infinityDictateVoiceNote` to spawn voice-dictated quantum study notes.

## When things show
- Active workspace notes, curved arc, and desk stand-in show in WORKSPACE_FOCUS mode; planets recede slightly into cosmic orbit.
- When zoomed out to GALAXY mode, planets expand into front arc; whiteboard recedes to background.
- Constellation beams dynamically recalculate orientation and length every frame.
- Glance-Away Ambient Mode: When the user tilts their head up (>18°) or looks away (>25°) to view the real room or colleagues, the workspace softly dims to 22% opacity.

## Done criteria
Each one can be checked in Lens Studio's preview:
1. Grounded Workspace Spawns: Virtual desk surface plate, 5 planetary orbs, and 4 curved sticky notes render with crisp typography and neon glow in preview.
2. Quantum 101 Curriculum: Notes boot with Superposition, Entanglement, Decoherence, and Shor's Algorithm formulas.
3. 15° Cylindrical Ergonomics: Left note angles inward +14°, center note faces forward 0°, right note angles inward -14°.
4. Dynamic Surface Snapping: Tapping elevation buttons adjusts table height smoothly between -45 cm and -5 cm.
5. In-Lens Session Export: Tapping Export renders the 3D floating markdown parchment with desktop sync capabilities.
6. 10 LEAF Scenarios Pass: Automated test suite validates all features without regression.

## Build notes for CLAD
- Lens Studio Version: 5.24.1 (coreVersion 377) targeting Spectacles.
- Script GUID: `0559680b-0102-4aef-b1ed-1d3bf45bb01f` bound to `Untitled JavaScript Component.js` and synchronized byte-for-byte with `InfinityOSKernel.js`.
- Optical Waveguide Contrast: Note backplates use `0.94` alpha slate tint and pure white emissive typography for crisp daytime readability.

## After the build: judge it
- What worked: Concentric 70 cm cylindrical radius keeps everything in the 46° FOV; glance-away dimming keeps physical room primary; quantum study curriculum provides immediate cognitive value.
- What needs a real device: Testing direct bare-hand pinch rays on physical Spectacles hardware outside the desktop preview simulator.
