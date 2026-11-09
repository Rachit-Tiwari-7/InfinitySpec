---
status: approved
---

# Design brief: INFINITY // Cosmic Spatial Whiteboard for Snap SPECS

## The one spatial moment
The user gazes at an ergonomic, desk-grounded cosmic workstation floating at natural reading distance in their room, effortlessly pinches an AI Neural Node to dynamically synthesize ideas connected by glowing energy beams, grabs and positions spatial sticky notes along a 15° cylindrical curved arc in 3D space, and pinches celestial planetary orbs to switch between 5 specialized spatial workspaces without touching a laptop or phone.

## Why it belongs on glasses
- Uses: draws in the world, leaves your body free, shares your view
- Why it's better than the phone or laptop version: On a laptop or phone, a digital whiteboard is crammed into a tiny 2D viewport that demands constant manual panning, zooming, and trackpad dragging. On SPECS glasses, ideas live anchored in the physical room around you at real 6DoF scale, connected by dynamic 3D constellation beams, leaving your hands and body completely free to ideate, organize, and create.

## Product or overlay
- Type: product
- What the real version would sense: physical surfaces (table or wall) and user hand tracking via Spectacles Interaction Kit (SIK).
- Stand-in for the preview: Virtual desk surface stand-in plate (90x55x1.5 cm) at (0, -18, -70 cm) and celestial planetary dock positioned at comfortable seated ergonomic distance (68 to 92 cm).

## Where things live
- Where the user is looking during the main task: Centered slightly below eye level (eye gaze down 10-15 degrees), seated at arm's length (Z = -68 to -92 cm).
- Virtual Desk Surface: Physical reference surface (90 cm width, 54 cm depth, 1.5 cm thickness at Y = -18 cm, Z = -70 cm) providing physical grounding in the preview room.
- Celestial Planetary Dock: An arc of 5 planetary orbs (Think, Create, Learn, Store, Explore) situated in the upper visual periphery (Y = +14 to +17.5 cm, Z = -86 to -92 cm, scale 5.2 to 8.0 cm).
- Spatial Whiteboard: Transparent dark-glass floating surface (width 56 cm, height 30 cm, depth 0.4 cm at Z = -72 cm) that automatically attenuates to 20% opacity when the user looks away into the physical room.
- Spatial Sticky Notes: 4 high-contrast acrylic note cards arranged along a 15° cylindrical curved arc (width 13.2 cm, height 8.2 cm, depth 0.5 cm) with title, checklist/body, spatial cognitive state badge (`ANCHORED`, `SYNTHESIZING`, `SYNCHRONIZED`), and glowing accent borders.
- Dynamic Constellation Beams: Glowing cylindrical energy links connecting dependent notes (thickness 0.24 cm, dynamically pulsing at 60 FPS).
- AI Assistant Core: Pulsing holographic sphere (radius 4.2 cm at X = -2 cm, Y = -8.5 cm, Z = -67.5 cm) that responds to 3D raycast pinch.
- 3D Voice HUD Capsule: Floating status capsule (width 26 cm, height 3.2 cm at Y = +11.2 cm) displaying hands-free voice status.

## Hands and input
- Pinch Planet: Switch active workspace (Think, Create, Learn, Store, Explore) with smooth celestial fly-in / orbit animation.
- Pinch & Drag Note: Grab any sticky note with direct pinch or raycast pinch, move it anywhere in 3D space; constellation beams stretch and re-orient in real-time.
- Pinch AI Core: Synthesizes a new contextual idea node, triggers an expanding spatial audio ripple wave, and injects it into the constellation graph.
- Tap Note: Cycles spatial cognitive state (`ANCHORED` ➔ `SYNTHESIZING` ➔ `SYNCHRONIZED`).
- Hover Aim: Continuous 3D vector raycast cue expanding target note scale by +14%.
- Voice and the button that does the same job: AI Orb tap or voice command simulator (`global.infinityVoiceCommand`) paired with the 3D Voice HUD capsule.

## When things show
- Active workspace notes, curved arc, and desk stand-in show in WORKSPACE_FOCUS mode; planets recede slightly into cosmic orbit.
- When zoomed out to GALAXY mode, planets expand into front arc; whiteboard recedes to background.
- Constellation beams dynamically recalculate orientation and length every frame.
- Glance-Away Ambient Mode: When the user tilts their head up (>18°) or looks away (>25°) to view the real room or colleagues, the workspace softly dims to 20% opacity.

## Done criteria
Each one can be checked in Lens Studio's preview:
1. Grounded Workspace Spawns: Virtual desk surface plate, 5 planetary orbs, and 4 curved sticky notes render with crisp typography and neon glow in preview.
2. 6DoF Room Walkaround: Moving with WASD in Preview demonstrates true 6DoF parallax around the anchored desk.
3. 1-Pinch Workspace Switching: Clicking/pinching any planet smoothly transitions the workspace, changing titles, colors, notes, and planetary positions.
4. Interactive Sticky Note Dragging & Hover: Hovering notes scales them by +14%; dragging moves them across the 3D desk plane while constellation beams follow.
5. Dynamic Constellation Beams: The 4 glowing cylindrical links automatically follow note positions in real-time with zero latency.
6. Spatial Cognitive State Cycling: Clicking a note toggles between `ANCHORED`, `SYNTHESIZING`, and `SYNCHRONIZED`.
7. AI Synthesis & Audio Ripple: Pinching the AI Assistant core triggers neural idea synthesis, expanding the visual audio ripple ring and updating the AI node.
8. Glance-Away Attenuation: Looking up tilts camera away from desk, smoothly dimming the workstation to leave the room unobstructed.

## Out of scope
- Two-handed multi-touch bimanual gestures (requires physical hardware).
- Live physical room meshing / depth sensor occlusion (not simulated in preview).
- External cloud API round-trips for LLM (procedural offline synthesis engine used for instantaneous preview reliability).

## Risks and open questions
- Lens Studio preview runs on desktop mouse clicks simulating single-hand pinch; all interaction targets are generously sized (>10 cm) to guarantee 100% click reliability.

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms. If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources
