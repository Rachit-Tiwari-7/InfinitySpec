// @component
// ==============================================================================
// INFINITY // Cosmic Spatial Operating System & Ambient Workstation
// Lens Studio 5.24 + Snap Spectacles 2024 (SIK Gaze/Pinch & Interactive Preview)
// Devpost Hackathon: Learn AR with SPECS
// ==============================================================================

// @input Asset.Texture texThink
// @input Asset.Texture texCreate
// @input Asset.Texture texLearn
// @input Asset.Texture texStore
// @input Asset.Texture texExplore
// @input Asset.Texture texWhiteboard
// @input Asset.Mesh boxMesh
// @input Asset.Mesh sphereMesh
// @input Asset.Mesh torusMesh
// @input Asset.Material pbrMaterial
// @input Asset.Material textMaterial

print("[INFINITY OS] Booting Spatial Operating System & Ambient Workstation...");

// ------------------------------------------------------------------------------
// Spatial Cognitive States (Replacing 2D Kanban with Spatial Computing States)
// ------------------------------------------------------------------------------
var SPATIAL_STATES = {
    "ANCHORED": {
        label: "ANCHORED",
        color: new vec4(0.0, 1.0, 0.66, 1.0),     // Neon Emerald
        desc: "Pinned to physical room coordinates"
    },
    "SYNTHESIZING": {
        label: "SYNTHESIZING",
        color: new vec4(1.0, 0.75, 0.08, 1.0),    // Radiant Gold
        desc: "Active neural AI thought stream"
    },
    "SYNCHRONIZED": {
        label: "SYNCHRONIZED",
        color: new vec4(0.0, 0.94, 1.0, 1.0),     // Cyberpunk Cyan
        desc: "Cross-device spatial vault synced"
    }
};

// ------------------------------------------------------------------------------
// 5 Cosmic Workspaces Configuration with 15° Cylindrical Ergonomics
// ------------------------------------------------------------------------------
var WORKSPACES = {
    "Think": {
        name: "Think",
        title: "INFINITY // THINK WORKSPACE",
        subtitle: "CREATIVE IDEATION • DECENTRALIZED 6DOF ENGINE",
        color: new vec4(0.0, 0.94, 1.0, 1.0),
        colorHex: "#00f0ff",
        notes: [
            {
                id: "StickyNote_Arch",
                labelId: "Label_Note_Arch",
                title: "ARCH: 6DoF ENGINE",
                body: "• Native 3D Spatial Canvas\n[x] 6DoF Desk Grounded",
                status: "ANCHORED",
                basePos: new vec3(-15.0, 1.5, -66.5),
                baseRotY: 14.0 * Math.PI / 180.0
            },
            {
                id: "StickyNote_Gaze",
                labelId: "Label_Note_Gaze",
                title: "GAZE + PINCH SIK",
                body: "• 3D Raycast Vector Aim\n• Waveguide Ergonomics",
                status: "SYNCHRONIZED",
                basePos: new vec3(0.0, 5.5, -68.5),
                baseRotY: 0.0
            },
            {
                id: "StickyNote_Constellation",
                labelId: "Label_Note_Constellation",
                title: "CONSTELLATION WEB",
                body: "• 60 FPS Realtime Links\n[x] Dynamic Quat LookAt",
                status: "SYNTHESIZING",
                basePos: new vec3(15.0, 1.0, -66.5),
                baseRotY: -14.0 * Math.PI / 180.0
            },
            {
                id: "StickyNote_AI",
                labelId: "Label_Note_AI",
                title: "✦ AI NEURAL NODE",
                body: "• Spatial Vector Graph\n[ ] Multi-Node Expansion",
                status: "SYNTHESIZING",
                basePos: new vec3(-2.0, -8.5, -67.5),
                baseRotY: 0.0,
                baseRotX: 8.0 * Math.PI / 180.0
            }
        ],
        connections: [[0, 1], [1, 2], [2, 3], [3, 0]],
        aiExpansions: [
            "Multimodal Spatial Vector Clustering Synthesized",
            "Attention Flow Graph Linked between Notes",
            "Autonomous 6DoF Viewport Predictor Activated",
            "Sub-Millisecond Neural Concept Synthesized"
        ]
    },
    "Create": {
        name: "Create",
        title: "INFINITY // CREATE WORKSPACE",
        subtitle: "VOLUMETRIC PROTOTYPING • PROCEDURAL SHADERS",
        color: new vec4(0.72, 0.22, 1.0, 1.0),
        colorHex: "#b838ff",
        notes: [
            {
                id: "StickyNote_Arch",
                labelId: "Label_Note_Arch",
                title: "GLASS TRANSMISSION",
                body: "• Acrylic PBR backplate\n[x] Additive Cyberpunk glow",
                status: "ANCHORED",
                basePos: new vec3(-15.0, 1.5, -66.5),
                baseRotY: 14.0 * Math.PI / 180.0
            },
            {
                id: "StickyNote_Gaze",
                labelId: "Label_Note_Gaze",
                title: "UI MESH PIPELINE",
                body: "• 3D Card Rasterization\n• Status cycling on tap",
                status: "SYNCHRONIZED",
                basePos: new vec3(0.0, 5.5, -68.5),
                baseRotY: 0.0
            },
            {
                id: "StickyNote_Constellation",
                labelId: "Label_Note_Constellation",
                title: "ENERGY CORRIDORS",
                body: "• Luminous beam corridors\n[x] Zero-allocation math",
                status: "ANCHORED",
                basePos: new vec3(15.0, 1.0, -66.5),
                baseRotY: -14.0 * Math.PI / 180.0
            },
            {
                id: "StickyNote_AI",
                labelId: "Label_Note_AI",
                title: "✦ AI 3D GENERATOR",
                body: "• Procedural Asset Mesh\n[ ] Dynamic Shader compile",
                status: "SYNTHESIZING",
                basePos: new vec3(-2.0, -8.5, -67.5),
                baseRotY: 0.0,
                baseRotX: 8.0 * Math.PI / 180.0
            }
        ],
        connections: [[0, 1], [1, 2], [2, 3], [3, 0]],
        aiExpansions: [
            "Volumetric Hologram Wireframe Generated",
            "Dynamic Cyberpunk Color Palette Synthesized",
            "Realtime Glass Refraction Map Compiled"
        ]
    },
    "Learn": {
        name: "Learn",
        title: "INFINITY // LEARN WORKSPACE",
        subtitle: "BIOMECHANICAL TRACKING • ROTATION INVARIANT AI",
        color: new vec4(1.0, 0.75, 0.08, 1.0),
        colorHex: "#ffb000",
        notes: [
            {
                id: "StickyNote_Arch",
                labelId: "Label_Note_Arch",
                title: "21-JOINT SKELETON",
                body: "• XRHand joint poses\n[x] SIK Gaze/Pinch Filter",
                status: "ANCHORED",
                basePos: new vec3(-15.0, 1.5, -66.5),
                baseRotY: 14.0 * Math.PI / 180.0
            },
            {
                id: "StickyNote_Gaze",
                labelId: "Label_Note_Gaze",
                title: "SPECTACLES SIK",
                body: "• Gaze ray hysteresis (2cm)\n• Ballistic throw dampening",
                status: "SYNCHRONIZED",
                basePos: new vec3(0.0, 5.5, -68.5),
                baseRotY: 0.0
            },
            {
                id: "StickyNote_Constellation",
                labelId: "Label_Note_Constellation",
                title: "SEATED COMFORT",
                body: "• Focus plane at 100cm\n[x] 15-deg downward arc",
                status: "ANCHORED",
                basePos: new vec3(15.0, 1.0, -66.5),
                baseRotY: -14.0 * Math.PI / 180.0
            },
            {
                id: "StickyNote_AI",
                labelId: "Label_Note_AI",
                title: "✦ AI SYNAPSE",
                body: "• Kinematic drift corrector\n[ ] Adaptive hand smoother",
                status: "SYNTHESIZING",
                basePos: new vec3(-2.0, -8.5, -67.5),
                baseRotY: 0.0,
                baseRotX: 8.0 * Math.PI / 180.0
            }
        ],
        connections: [[0, 1], [1, 2], [2, 3], [3, 0]],
        aiExpansions: [
            "Joint Distance Ratios Normalized Across Chirality",
            "Predictive Sub-Millisecond Motion Extrapolated",
            "Biomechanical Spatial Ergonomics Verified"
        ]
    },
    "Store": {
        name: "Store",
        title: "INFINITY // STORE WORKSPACE",
        subtitle: "PERSISTENT VAULT • CROSS-SESSION SPATIAL STATE",
        color: new vec4(0.08, 0.95, 0.58, 1.0),
        colorHex: "#00ffaa",
        notes: [
            {
                id: "StickyNote_Arch",
                labelId: "Label_Note_Arch",
                title: "PERSISTENT STORE",
                body: "• Instant cross-session load\n[x] Versioned JSON schema",
                status: "ANCHORED",
                basePos: new vec3(-15.0, 1.5, -66.5),
                baseRotY: 14.0 * Math.PI / 180.0
            },
            {
                id: "StickyNote_Gaze",
                labelId: "Label_Note_Gaze",
                title: "CACHE RECOVERY",
                body: "• In-memory fast fallback\n• Zero-latency restore",
                status: "SYNCHRONIZED",
                basePos: new vec3(0.0, 5.5, -68.5),
                baseRotY: 0.0
            },
            {
                id: "StickyNote_Constellation",
                labelId: "Label_Note_Constellation",
                title: "DEVICE VAULT",
                body: "• Cross-workspace states\n[x] Coordinates preserved",
                status: "ANCHORED",
                basePos: new vec3(15.0, 1.0, -66.5),
                baseRotY: -14.0 * Math.PI / 180.0
            },
            {
                id: "StickyNote_AI",
                labelId: "Label_Note_AI",
                title: "✦ AI SNAPSHOT",
                body: "• Automatic state indexing\n[ ] Cloud synchronization",
                status: "SYNTHESIZING",
                basePos: new vec3(-2.0, -8.5, -67.5),
                baseRotY: 0.0,
                baseRotX: 8.0 * Math.PI / 180.0
            }
        ],
        connections: [[0, 1], [1, 2], [2, 3], [3, 0]],
        aiExpansions: [
            "Whiteboard Workspace State Serialized to Vault",
            "Cross-Device Coordinate Transformation Calibrated",
            "Redundant Idea Nodes Pruned & Indexed"
        ]
    },
    "Explore": {
        name: "Explore",
        title: "INFINITY // EXPLORE GALAXY",
        subtitle: "INFINITE WHITEBOARD ZOOM • COSMIC NAVIGATION",
        color: new vec4(1.0, 0.12, 0.58, 1.0),
        colorHex: "#ff007f",
        notes: [
            {
                id: "StickyNote_Arch",
                labelId: "Label_Note_Arch",
                title: "GALAXY ATLAS",
                body: "• 5 Celestial Planetary Orbs\n[x] 1-pinch fast jump",
                status: "ANCHORED",
                basePos: new vec3(-15.0, 1.5, -66.5),
                baseRotY: 14.0 * Math.PI / 180.0
            },
            {
                id: "StickyNote_Gaze",
                labelId: "Label_Note_Gaze",
                title: "INFINITE ZOOM",
                body: "• Overview to Focus Mode\n• Smooth Lerp fly-through",
                status: "SYNCHRONIZED",
                basePos: new vec3(0.0, 5.5, -68.5),
                baseRotY: 0.0
            },
            {
                id: "StickyNote_Constellation",
                labelId: "Label_Note_Constellation",
                title: "COSMIC BEAMS",
                body: "• Pulsing connection web\n[x] Dynamic Graph Topology",
                status: "ANCHORED",
                basePos: new vec3(15.0, 1.0, -66.5),
                baseRotY: -14.0 * Math.PI / 180.0
            },
            {
                id: "StickyNote_AI",
                labelId: "Label_Note_AI",
                title: "✦ AI DISCOVERY",
                body: "• Deep Concept Traversal\n[ ] Infinite Sub-Universe",
                status: "SYNTHESIZING",
                basePos: new vec3(-2.0, -8.5, -67.5),
                baseRotY: 0.0,
                baseRotX: 8.0 * Math.PI / 180.0
            }
        ],
        connections: [[0, 1], [1, 2], [2, 3], [3, 0]],
        aiExpansions: [
            "Multidimensional Concept Traversal Activated",
            "Deep Space Ideation Constellations Discovered",
            "Infinite Whiteboard Sub-Universe Instantiated"
        ]
    }
};

// ------------------------------------------------------------------------------
// Runtime Operating State
// ------------------------------------------------------------------------------
var state = {
    mode: "WORKSPACE_FOCUS",       // "GALAXY" or "WORKSPACE_FOCUS"
    focusedWorkspace: "Think",
    camera: null,
    planets: {},
    labels: {},
    deskSurface: null,
    whiteboard: null,
    headerLabel: null,
    subLabel: null,
    voiceHud: null,
    voiceHudLabel: null,
    voiceHudTimer: 0.0,
    audioRipple: null,
    audioRippleScale: 0.1,
    audioRippleActive: false,
    notes: [],                     // Array of note controller objects
    constellations: [],            // Array of SceneObjects for connection beams
    draggedNote: null,
    dragOffset: new vec3(0, 0, 0),
    time: 0,
    aiIndex: 0,
    pulseEnergy: 0.0,
    ambientOpacity: 1.0,           // Glance-Away ambient attenuation factor (0.2 to 1.0)
    hoveredNote: null,
    lastScreenPos: new vec2(0.5, 0.5),
    persistentCache: {},
    // Integrated Modular Subsystems
    noteEditor: null,
    shapeModule: null,
    ftueOnboarding: null,
    aiModule: null,
    ftueBillboard: null,
    ftueText: null
};

// ------------------------------------------------------------------------------
// Helper Utilities & Scene Hierarchy Search
// ------------------------------------------------------------------------------
function findObjectByName(name, root) {
    if (!root) {
        var count = global.scene.getRootObjectsCount();
        for (var i = 0; i < count; i++) {
            var found = findObjectByName(name, global.scene.getRootObject(i));
            if (found) return found;
        }
        return null;
    }
    if (root.name === name) return root;
    for (var j = 0; j < root.getChildrenCount(); j++) {
        var childFound = findObjectByName(name, root.getChild(j));
        if (childFound) return childFound;
    }
    return null;
}

function getText3D(obj) {
    if (!obj) return null;
    return obj.getComponent("Component.Text3D") || obj.getComponent("Text3D");
}

function setTextContent(obj, str, size) {
    if (!obj) return;
    var txt = getText3D(obj);
    if (txt) {
        txt.text = str;
        if (size) txt.size = size;
    }
}

function applyMaterialStyle(obj, texAsset, color) {
    if (!obj) return;
    var visual = obj.getComponent("Component.RenderMeshVisual") || obj.getComponent("RenderMeshVisual");
    if (visual && visual.mainPass) {
        if (texAsset) {
            visual.mainPass.baseTex = texAsset;
        }
        if (color && visual.mainPass.baseColor) {
            visual.mainPass.baseColor = color;
        }
    }
}

// ------------------------------------------------------------------------------
// Autonomous Self-Bootstrapping Engine: Procedural Scene Instantiator
// ------------------------------------------------------------------------------
function getOrCreateObject(name, meshAsset, matAsset) {
    var obj = findObjectByName(name);
    if (!obj) {
        obj = global.scene.createSceneObject(name);
        if (meshAsset || matAsset) {
            var visual = obj.createComponent("Component.RenderMeshVisual");
            if (meshAsset) visual.mesh = meshAsset;
            if (matAsset) visual.material = matAsset;
        }
        print("[INFINITY BOOT] Procedurally instantiated: " + name);
    }
    return obj;
}

function getOrCreateText3D(name, defaultText, size, color) {
    var obj = findObjectByName(name);
    if (!obj) {
        obj = global.scene.createSceneObject(name);
        var txt = obj.createComponent("Component.Text3D");
        txt.text = defaultText || "";
        if (size) txt.size = size;
        if (color && txt.mainPass && txt.mainPass.baseColor) {
            txt.mainPass.baseColor = color;
        }
        print("[INFINITY BOOT] Procedurally instantiated Text3D: " + name);
    }
    return obj;
}

// ------------------------------------------------------------------------------
// True 3D Spatial Vector Raycast Engine (Matching SIK 3D Standards)
// ------------------------------------------------------------------------------
function raycast3D(screenPos, targetPos, hitRadius) {
    if (!state.camera) return { hit: false, dist3D: Infinity };
    var ray = state.camera.screenSpaceToRay(screenPos);
    if (!ray) return { hit: false, dist3D: Infinity };

    var v = targetPos.sub(ray.origin);
    var t = v.dot(ray.direction);
    if (t <= 0) return { hit: false, dist3D: Infinity };

    var closestPoint = ray.origin.add(ray.direction.uniformScale(t));
    var dist3D = closestPoint.distance(targetPos);
    return {
        hit: dist3D <= hitRadius,
        dist3D: dist3D,
        point: closestPoint
    };
}

// ------------------------------------------------------------------------------
// Session Persistence (Save & Reopen Workspaces)
// ------------------------------------------------------------------------------
function saveWorkspaceState(wsKey) {
    var noteData = [];
    for (var i = 0; i < state.notes.length; i++) {
        var n = state.notes[i];
        noteData.push({
            id: n.id,
            x: n.curPos.x,
            y: n.curPos.y,
            z: n.curPos.z,
            status: n.status
        });
    }
    var jsonStr = JSON.stringify(noteData);
    state.persistentCache[wsKey] = jsonStr;

    if (global.persistentStorageSystem && global.persistentStorageSystem.store) {
        try {
            global.persistentStorageSystem.store.putString("INFINITY_WS_" + wsKey, jsonStr);
            print("[INFINITY OS] Workspace preserved to persistent storage: " + wsKey);
        } catch(e) {
            print("[INFINITY OS] Persistent store warning: " + e);
        }
    }
}

function loadWorkspaceState(wsKey) {
    var jsonStr = null;
    if (global.persistentStorageSystem && global.persistentStorageSystem.store) {
        try {
            jsonStr = global.persistentStorageSystem.store.getString("INFINITY_WS_" + wsKey);
        } catch(e) {}
    }
    if (!jsonStr && state.persistentCache[wsKey]) {
        jsonStr = state.persistentCache[wsKey];
    }
    if (jsonStr) {
        try {
            var data = JSON.parse(jsonStr);
            print("[INFINITY OS] Workspace restored from storage: " + wsKey);
            return data;
        } catch(e) {}
    }
    return null;
}

// ------------------------------------------------------------------------------
// Galaxy Planet Configurations
// ------------------------------------------------------------------------------
var GALAXY_PLANET_CONFIGS = {
    "Planet_Think":   { key: "Think",   label: "THINK",   basePos: new vec3(-26.0, 9.0, -86.0), baseScale: new vec3(5.2, 5.2, 5.2), texProp: "texThink" },
    "Planet_Create":  { key: "Create",  label: "CREATE",  basePos: new vec3(-13.0, 14.0, -90.0), baseScale: new vec3(5.6, 5.6, 5.6), texProp: "texCreate" },
    "Planet_Learn":   { key: "Learn",   label: "LEARN",   basePos: new vec3(0.0, 16.5, -92.0), baseScale: new vec3(6.8, 6.8, 6.8), texProp: "texLearn" },
    "Planet_Store":   { key: "Store",   label: "STORE",   basePos: new vec3(13.0, 14.0, -90.0), baseScale: new vec3(5.6, 5.6, 5.6), texProp: "texStore" },
    "Planet_Explore": { key: "Explore", label: "EXPLORE", basePos: new vec3(26.0, 9.0, -86.0), baseScale: new vec3(5.2, 5.2, 5.2), texProp: "texExplore" }
};

// ------------------------------------------------------------------------------
// Boot Lifecycle & Autonomous Self-Instantiation
// ------------------------------------------------------------------------------
script.createEvent('OnStartEvent').bind(function() {
    print("[INFINITY OS] Kernel booting into 6DoF Spatial Universe...");

    // 1. Link Camera
    var camObj = findObjectByName("Camera Object") || findObjectByName("Camera");
    if (camObj) {
        state.camera = camObj.getComponent("Component.Camera") || camObj.getComponent("Camera");
        print("[INFINITY OS] Spatial Camera linked successfully");
    }

    // 2. Virtual Desk Surface Stand-In Plate with Spatial Corner Markers & Subtle Boundary
    state.deskSurface = getOrCreateObject("Virtual_Desk_Surface", script.boxMesh, script.pbrMaterial);
    state.deskSurface.getTransform().setWorldPosition(new vec3(0.0, -18.0, -70.0));
    state.deskSurface.getTransform().setWorldScale(new vec3(90.0, 1.2, 54.0));
    applyMaterialStyle(state.deskSurface, script.texWhiteboard, new vec4(0.06, 0.09, 0.16, 0.78));

    // Spatial Desk Alignment: Subtle 4 Corner L-Brackets & Boundary Rim
    var deskCorners = [
        { name: "Desk_Corner_TL", x: -43.0, z: -95.0 },
        { name: "Desk_Corner_TR", x:  43.0, z: -95.0 },
        { name: "Desk_Corner_BL", x: -43.0, z: -45.0 },
        { name: "Desk_Corner_BR", x:  43.0, z: -45.0 }
    ];
    for (var ci = 0; ci < deskCorners.length; ci++) {
        var cData = deskCorners[ci];
        var cornerObj = getOrCreateObject(cData.name, script.boxMesh, script.pbrMaterial);
        cornerObj.getTransform().setWorldPosition(new vec3(cData.x, -17.2, cData.z));
        cornerObj.getTransform().setWorldScale(new vec3(3.2, 0.35, 3.2));
        applyMaterialStyle(cornerObj, null, new vec4(0.0, 0.94, 1.0, 0.92)); // Luminous Cyan Marker
    }

    // Subtle Surface Boundary Trim
    var deskTrim = getOrCreateObject("Desk_Surface_Rim", script.boxMesh, script.pbrMaterial);
    deskTrim.getTransform().setWorldPosition(new vec3(0.0, -17.3, -70.0));
    deskTrim.getTransform().setWorldScale(new vec3(91.2, 0.25, 55.2));
    applyMaterialStyle(deskTrim, null, new vec4(1.0, 0.75, 0.08, 0.40)); // Restrained Gold Accent Accent

    // 3. Configure Planets & Orbital Labels
    for (var pName in GALAXY_PLANET_CONFIGS) {
        var cfg = GALAXY_PLANET_CONFIGS[pName];
        var pObj = getOrCreateObject(pName, script.sphereMesh, script.pbrMaterial);
        
        state.planets[cfg.key] = {
            obj: pObj,
            config: cfg,
            targetPos: cfg.basePos,
            targetScale: cfg.baseScale,
            orbitOffset: Math.random() * 6.28
        };

        var tex = script[cfg.texProp];
        applyMaterialStyle(pObj, tex, WORKSPACES[cfg.key].color);
        pObj.getTransform().setWorldPosition(cfg.basePos);
        pObj.getTransform().setWorldScale(cfg.baseScale);

        var lObj = getOrCreateText3D("Label_" + cfg.key, cfg.label, 8.5, WORKSPACES[cfg.key].color);
        state.labels[cfg.key] = lObj;
    }

    // 4. Whiteboard Backdrop (Translucent Ambient Glass Frame)
    state.whiteboard = getOrCreateObject("Spatial_Whiteboard", script.boxMesh, script.pbrMaterial);
    state.whiteboard.getTransform().setWorldPosition(new vec3(0, -5, -72));
    state.whiteboard.getTransform().setWorldScale(new vec3(56, 30, 0.4));
    applyMaterialStyle(state.whiteboard, script.texWhiteboard, new vec4(0.03, 0.06, 0.12, 0.88));

    // 5. 3D Voice Command Status HUD Pill
    state.voiceHud = getOrCreateObject("HUD_Voice_Indicator", script.boxMesh, script.pbrMaterial);
    state.voiceHud.getTransform().setWorldPosition(new vec3(0.0, 11.2, -69.0));
    state.voiceHud.getTransform().setWorldScale(new vec3(26.0, 3.2, 0.5));
    applyMaterialStyle(state.voiceHud, null, new vec4(0.04, 0.08, 0.18, 0.90));

    state.voiceHudLabel = getOrCreateText3D("Label_Voice_HUD", "[ ✦ INFINITY SPATIAL OS // DESK ANCHORED ]", 4.2, new vec4(0.0, 0.94, 1.0, 1.0));
    state.voiceHudLabel.getTransform().setWorldPosition(new vec3(0.0, 11.2, -68.3));

    // 6. Whiteboard Headers & Subtitles (High Legibility Waveguide Typography)
    state.headerLabel = getOrCreateText3D("Label_Whiteboard_Header", "INFINITY // THINK WORKSPACE", 11.0, new vec4(0.0, 0.94, 1.0, 1.0));
    state.headerLabel.getTransform().setWorldPosition(new vec3(0, 7.5, -70));

    state.subLabel = getOrCreateText3D("Label_Whiteboard_Sub", "PINCH PLANET TO SWITCH • DRAG NOTES • ✦ PINCH AI TO EXPAND", 5.0, new vec4(1.0, 1.0, 1.0, 0.95));
    state.subLabel.getTransform().setWorldPosition(new vec3(0, 4.8, -70));

    // 7. Initialize 4 Spatial Sticky Notes with 15° Cylindrical Curved Ergonomics
    var ws = WORKSPACES[state.focusedWorkspace];
    for (var k = 0; k < ws.notes.length; k++) {
        var nCfg = ws.notes[k];
        var nObj = getOrCreateObject(nCfg.id, script.boxMesh, script.pbrMaterial);

        var st = SPATIAL_STATES[nCfg.status] || SPATIAL_STATES["ANCHORED"];
        var cardText = nCfg.title + "\n" + nCfg.body + "\n[ " + st.label + " ]";
        var lblObj = getOrCreateText3D(nCfg.labelId, cardText, 4.8, new vec4(1.0, 1.0, 1.0, 1.0));

        nObj.getTransform().setWorldScale(new vec3(13.2, 8.2, 0.5));
        nObj.getTransform().setWorldPosition(nCfg.basePos);
        
        var initRotY = nCfg.baseRotY || 0.0;
        var initRotX = nCfg.baseRotX || 0.0;
        nObj.getTransform().setLocalRotation(quat.fromEulerAngles(initRotX, initRotY, 0.0));

        var noteTex = script[GALAXY_PLANET_CONFIGS["Planet_" + state.focusedWorkspace].texProp];
        applyMaterialStyle(nObj, noteTex, ws.color);

        lblObj.getTransform().setWorldPosition(new vec3(nCfg.basePos.x, nCfg.basePos.y, nCfg.basePos.z + 0.8));
        lblObj.getTransform().setLocalRotation(quat.fromEulerAngles(initRotX, initRotY, 0.0));

        state.notes.push({
            obj: nObj,
            labelObj: lblObj,
            id: nCfg.id,
            cfg: nCfg,
            status: nCfg.status,
            targetPos: nCfg.basePos,
            curPos: nCfg.basePos,
            baseScale: new vec3(13.2, 8.2, 0.5),
            curScale: new vec3(13.2, 8.2, 0.5),
            isHovered: false
        });
    }

    // 8. Initialize Constellation Beams
    for (var b = 1; b <= 4; b++) {
        var beamObj = getOrCreateObject("Constellation_Link_" + b, script.boxMesh, script.pbrMaterial);
        state.constellations.push(beamObj);
        applyMaterialStyle(beamObj, null, new vec4(0.0, 0.94, 1.0, 0.85));
        beamObj.getTransform().setWorldScale(new vec3(0.24, 0.24, 1.0));
    }

    // 9. Holographic AI Assistant Orb & Audio Ripple Ring
    var aiCore = getOrCreateObject("AI_Assistant_Core", script.sphereMesh, script.pbrMaterial);
    aiCore.getTransform().setWorldPosition(new vec3(-2.0, -8.5, -67.5));
    aiCore.getTransform().setWorldScale(new vec3(4.2, 4.2, 4.2));
    applyMaterialStyle(aiCore, null, new vec4(0.0, 0.94, 1.0, 0.95));

    state.audioRipple = getOrCreateObject("Audio_Ripple_Ring", script.torusMesh, script.pbrMaterial);
    state.audioRipple.getTransform().setWorldPosition(new vec3(-2.0, -8.5, -67.5));
    state.audioRipple.getTransform().setWorldScale(new vec3(0.1, 0.1, 0.1));
    applyMaterialStyle(state.audioRipple, null, new vec4(0.0, 0.94, 1.0, 0.0));

    // 10. Instantiate Integrated Feature Modules
    var kernelInterface = {
        state: state,
        WORKSPACES: WORKSPACES,
        boxMesh: script.boxMesh,
        sphereMesh: script.sphereMesh,
        torusMesh: script.torusMesh,
        pbrMaterial: script.pbrMaterial,
        saveWorkspaceState: saveWorkspaceState
    };

    if (global.NoteEditorKeyboard) {
        state.noteEditor = new global.NoteEditorKeyboard(kernelInterface);
        print("[INFINITY OS] 3D Note Editor & Spatial Keyboard initialized.");
    }
    if (global.DrawingAndSnappingModule) {
        state.shapeModule = new global.DrawingAndSnappingModule(kernelInterface);
        print("[INFINITY OS] 3D Inking & Shape Recognizer initialized.");
    }
    if (global.LiveAIAssistantModule) {
        state.aiModule = new global.LiveAIAssistantModule(kernelInterface);
        print("[INFINITY OS] Live Contextual AI Assistant Bridge initialized.");
    }
    if (global.FTUEOnboarding) {
        state.ftueOnboarding = new global.FTUEOnboarding("INFINITY_FTUE_V2");
        initFTUEBillboard();
        print("[INFINITY OS] FTUE 3-Step Spatial Onboarding Engine initialized.");
    }

    // 11. Boot into Think Workspace with Desk Anchoring
    enterFocusMode("Think");
    print("[INFINITY OS] Cosmic Spatial Desktop online. Ready for Spectacles SIK Gaze & Pinch!");
});

// ------------------------------------------------------------------------------
// FTUE 3D Spatial Interactive Tutorial Billboard (Ergonomic 3-Step Walkthrough)
// 1: "PINCH ANY NOTE TO REPOSITION"
// 2: "PINCH A PLANET TO EXPLORE ANOTHER WORLD"
// 3: "LOOK AWAY TO GIVE YOUR WORLD ROOM TO BREATHE"
// ------------------------------------------------------------------------------
function initFTUEBillboard() {
    if (!state.ftueOnboarding || !state.ftueOnboarding.isActive()) return;

    state.ftueBillboard = getOrCreateObject("FTUE_Holographic_Billboard", script.boxMesh, script.pbrMaterial);
    state.ftueBillboard.getTransform().setWorldPosition(new vec3(0.0, 14.8, -66.0));
    state.ftueBillboard.getTransform().setWorldScale(new vec3(38.0, 4.6, 0.4));
    applyMaterialStyle(state.ftueBillboard, null, new vec4(0.02, 0.07, 0.16, 0.94));

    var stepData = state.ftueOnboarding.getCurrentStepData();
    var billboardText = stepData ? 
        ("[ " + stepData.tag + " ]\n" + stepData.prompt) : 
        "✦ WELCOME TO INFINITY SPATIAL COMPUTER";

    state.ftueText = getOrCreateText3D("Label_FTUE_Tutorial", billboardText, 4.2, new vec4(1.0, 0.75, 0.08, 1.0));
    state.ftueText.getTransform().setWorldPosition(new vec3(0.0, 14.8, -65.3));

    state.ftueOnboarding.onStepChange(function(step, data) {
        if (state.ftueBillboard && state.ftueText) {
            if (data) {
                state.ftueBillboard.enabled = true;
                state.ftueText.enabled = true;
                setTextContent(state.ftueText, "[ " + data.tag + " ]\n" + data.prompt, 4.2);
                state.pulseEnergy = 0.8;
            } else {
                state.ftueBillboard.enabled = false;
                state.ftueText.enabled = false;
            }
        }
    });
}

// ------------------------------------------------------------------------------
// Whiteboard Focus Mode & Celestial Space Navigation
// ------------------------------------------------------------------------------
function enterFocusMode(workspaceKey) {
    if (state.mode === "WORKSPACE_FOCUS" && state.focusedWorkspace) {
        saveWorkspaceState(state.focusedWorkspace);
    }

    state.mode = "WORKSPACE_FOCUS";
    state.focusedWorkspace = workspaceKey;
    var ws = WORKSPACES[workspaceKey];

    print("[INFINITY OS] ✦ Cosmic Jump to Workspace: " + ws.title);

    // Update Header and Subtitle
    if (state.headerLabel) {
        setTextContent(state.headerLabel, ws.title);
        var hTxt = getText3D(state.headerLabel);
        if (hTxt && hTxt.mainPass && hTxt.mainPass.baseColor) {
            hTxt.mainPass.baseColor = ws.color;
        }
    }
    if (state.subLabel) setTextContent(state.subLabel, ws.subtitle);

    // Check saved state or defaults
    var savedPositions = loadWorkspaceState(workspaceKey);

    // Update notes and labels for this workspace
    for (var i = 0; i < state.notes.length; i++) {
        var n = state.notes[i];
        var nCfg = ws.notes[i];
        if (nCfg) {
            var targetPos = (savedPositions && savedPositions[i]) ? 
                new vec3(savedPositions[i].x, savedPositions[i].y, savedPositions[i].z) : 
                nCfg.basePos;

            var status = (savedPositions && savedPositions[i] && savedPositions[i].status) ?
                savedPositions[i].status : nCfg.status;

            n.targetPos = targetPos;
            n.status = status;
            n.cfg = nCfg;

            var tex = script[GALAXY_PLANET_CONFIGS["Planet_" + workspaceKey].texProp];
            applyMaterialStyle(n.obj, tex, ws.color);

            if (n.labelObj) {
                var st = SPATIAL_STATES[status] || SPATIAL_STATES["ANCHORED"];
                var content = nCfg.title + "\n" + nCfg.body + "\n[ " + st.label + " ]";
                setTextContent(n.labelObj, content, 4.8);
            }
        }
    }

    // Transform planets: Focused planet steps forward as celestial sun; others recede into orbit
    for (var k in state.planets) {
        var p = state.planets[k];
        if (k === workspaceKey) {
            p.targetPos = new vec3(0.0, 17.5, -74.0);
            p.targetScale = new vec3(8.0, 8.0, 8.0);
        } else {
            var orig = p.config.basePos;
            p.targetPos = new vec3(orig.x * 1.35, orig.y * 1.25 + 6.0, orig.z - 40.0);
            p.targetScale = new vec3(p.config.baseScale.x * 0.45, p.config.baseScale.y * 0.45, p.config.baseScale.z * 0.45);
        }
    }

    state.pulseEnergy = 1.0;
}

function returnToGalaxy() {
    if (state.mode === "WORKSPACE_FOCUS") {
        saveWorkspaceState(state.focusedWorkspace);
    }

    state.mode = "GALAXY";
    print("[INFINITY OS] Returning to Galaxy Overview...");

    if (state.headerLabel) setTextContent(state.headerLabel, "INFINITY // COSMIC SPATIAL UNIVERSE");
    if (state.subLabel) setTextContent(state.subLabel, "PINCH ANY PLANET TO ENTER WORKSPACE • ✦ AI ACTIVE");

    for (var k in state.planets) {
        var p = state.planets[k];
        p.targetPos = p.config.basePos;
        p.targetScale = p.config.baseScale;
    }
}

// ------------------------------------------------------------------------------
// Constellation Dynamic Geometry Solver
// ------------------------------------------------------------------------------
function updateConstellationConnections() {
    if (state.notes.length < 2 || state.constellations.length === 0) return;

    var ws = WORKSPACES[state.focusedWorkspace];
    var connections = (ws && ws.connections) ? ws.connections : [[0, 1], [1, 2], [2, 3], [3, 0]];
    var beamColor = ws ? ws.color : new vec4(0, 0.94, 1, 0.85);

    for (var c = 0; c < connections.length && c < state.constellations.length; c++) {
        var idxA = connections[c][0];
        var idxB = connections[c][1];

        if (idxA >= state.notes.length || idxB >= state.notes.length) continue;

        var posA = state.notes[idxA].curPos;
        var posB = state.notes[idxB].curPos;

        // Midpoint
        var midX = (posA.x + posB.x) * 0.5;
        var midY = (posA.y + posB.y) * 0.5;
        var midZ = (posA.z + posB.z) * 0.5;
        var midPoint = new vec3(midX, midY, midZ);

        // Vector delta & distance
        var dx = posB.x - posA.x;
        var dy = posB.y - posA.y;
        var dz = posB.z - posA.z;
        var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 0.01) dist = 0.01;

        var beam = state.constellations[c];
        var bTrans = beam.getTransform();

        bTrans.setWorldPosition(midPoint);

        // Orient box along connection direction
        var dir = new vec3(dx / dist, dy / dist, dz / dist);
        var rot = quat.lookAt(dir, vec3.up());
        bTrans.setLocalRotation(rot);

        // Dynamic thickness pulses with AI energy
        var thickness = (0.24 + state.pulseEnergy * 0.45) * state.ambientOpacity;
        bTrans.setWorldScale(new vec3(thickness, thickness, dist));

        // Update beam color pulse
        var pulsedColor = new vec4(
            beamColor.r * (0.8 + state.pulseEnergy * 0.2),
            beamColor.g * (0.8 + state.pulseEnergy * 0.2),
            beamColor.b * (0.8 + state.pulseEnergy * 0.2),
            0.85 * state.ambientOpacity
        );
        applyMaterialStyle(beam, null, pulsedColor);
    }
}

// ------------------------------------------------------------------------------
// Interactive Status Cycling on Sticky Notes (Spatial Cognitive States)
// ------------------------------------------------------------------------------
function cycleNoteStatus(note) {
    if (!note) return;
    if (note.status === "ANCHORED") {
        note.status = "SYNTHESIZING";
    } else if (note.status === "SYNTHESIZING") {
        note.status = "SYNCHRONIZED";
    } else {
        note.status = "ANCHORED";
    }

    var st = SPATIAL_STATES[note.status] || SPATIAL_STATES["ANCHORED"];
    print("[INFINITY OS] Note spatial state updated: " + note.cfg.title + " -> " + st.label);

    if (note.labelObj) {
        var lines = note.cfg.body.split("\n");
        var updatedText = note.cfg.title + "\n" + note.cfg.body + "\n[ " + st.label + " ]";
        setTextContent(note.labelObj, updatedText, 4.8);
    }

    state.pulseEnergy = 0.7;
    triggerAudioRipple(note.curPos);

    if (state.focusedWorkspace) {
        saveWorkspaceState(state.focusedWorkspace);
    }
}

// ------------------------------------------------------------------------------
// Procedural Spatial Audio Ripple Visualizer
// ------------------------------------------------------------------------------
function triggerAudioRipple(centerPos) {
    if (!state.audioRipple) return;
    state.audioRipple.getTransform().setWorldPosition(centerPos);
    state.audioRippleScale = 0.2;
    state.audioRippleActive = true;
}

// ------------------------------------------------------------------------------
// Real-Time Frame Loop (60+ FPS Engine)
// ------------------------------------------------------------------------------
script.createEvent('UpdateEvent').bind(function() {
    var dt = getDeltaTime();
    state.time += dt;

    if (state.pulseEnergy > 0.01) {
        state.pulseEnergy = Math.max(0.0, state.pulseEnergy - dt * 2.2);
    }

    // 1. Voice Command HUD Timer
    if (state.voiceHudTimer > 0.0) {
        state.voiceHudTimer = Math.max(0.0, state.voiceHudTimer - dt);
        if (state.voiceHudTimer <= 0.0 && state.voiceHudLabel) {
            setTextContent(state.voiceHudLabel, "[ ✦ INFINITY SPATIAL OS // DESK ANCHORED ]", 4.2);
            applyMaterialStyle(state.voiceHud, null, new vec4(0.04, 0.08, 0.18, 0.90));
        }
    }

    // 2. Glance-Away Ambient Attenuation Engine
    // If user looks up or away from the desk, softly fade workspace to leave room unobstructed
    if (state.camera) {
        var camTrans = state.camera.getSceneObject().getTransform();
        var camFwd = camTrans.forward || new vec3(0, 0, -1);
        // Angle to desk center (0, -6, -70)
        var deskDir = new vec3(0.0, -6.0, -70.0).sub(camTrans.getWorldPosition()).normalize();
        var dotFwd = camFwd.dot(deskDir);
        
        var targetOpacity = (dotFwd < 0.82) ? 0.22 : 1.0; // Dim when looking away >25 deg
        state.ambientOpacity = vec3.lerp(new vec3(state.ambientOpacity, 0, 0), new vec3(targetOpacity, 0, 0), dt * 3.5).x;

        // Advance FTUE step 3 if user tilted their head away and completed ambient dimming
        if (targetOpacity < 0.3 && state.ftueOnboarding && state.ftueOnboarding.isActive() && state.ftueOnboarding.step === 3) {
            state.ftueOnboarding.advance(3);
        }
    }

    // 3. Continuous 3D Hover Detection
    var hoveredIndex = -1;
    if (state.mode === "WORKSPACE_FOCUS") {
        for (var h = 0; h < state.notes.length; h++) {
            var nCheck = state.notes[h];
            var rayResult = raycast3D(state.lastScreenPos, nCheck.curPos, 9.0);
            if (rayResult.hit) {
                hoveredIndex = h;
                break;
            }
        }
    }

    // 4. Animate Celestial Planets
    for (var key in state.planets) {
        var p = state.planets[key];
        var trans = p.obj.getTransform();

        var floatY = Math.sin(state.time * 1.6 + p.orbitOffset) * 0.65;
        var rotSpeed = (key === state.focusedWorkspace && state.mode === "WORKSPACE_FOCUS") ? 0.6 : 0.2;
        var rotQuat = quat.fromEulerAngles(0, state.time * rotSpeed, floatY * 0.03);
        trans.setLocalRotation(rotQuat);

        var pos = trans.getWorldPosition();
        var target = new vec3(p.targetPos.x, p.targetPos.y + floatY, p.targetPos.z);
        trans.setWorldPosition(vec3.lerp(pos, target, dt * 5.0));

        var curScale = trans.getWorldScale();
        trans.setWorldScale(vec3.lerp(curScale, p.targetScale.uniformScale(state.ambientOpacity), dt * 5.0));

        var lObj = state.labels[key];
        if (lObj) {
            var lTargetY = p.targetPos.y + floatY - (p.targetScale.y * 0.75 + 3.2);
            lObj.getTransform().setWorldPosition(new vec3(target.x, lTargetY, target.z));
        }
    }

    // 5. Animate Spatial Whiteboard & Virtual Desk
    var wbTargetY = (state.mode === "WORKSPACE_FOCUS") ? -5.0 : -34.0;
    var wbTargetZ = (state.mode === "WORKSPACE_FOCUS") ? -72.0 : -88.0;

    if (state.whiteboard) {
        var wbPos = state.whiteboard.getTransform().getWorldPosition();
        state.whiteboard.getTransform().setWorldPosition(vec3.lerp(wbPos, new vec3(0, wbTargetY, wbTargetZ), dt * 5.0));
        applyMaterialStyle(state.whiteboard, script.texWhiteboard, new vec4(0.03, 0.06, 0.12, 0.88 * state.ambientOpacity));
    }

    if (state.deskSurface) {
        applyMaterialStyle(state.deskSurface, script.texWhiteboard, new vec4(0.08, 0.12, 0.20, 0.85 * state.ambientOpacity));
    }

    if (state.headerLabel) {
        var hPos = state.headerLabel.getTransform().getWorldPosition();
        state.headerLabel.getTransform().setWorldPosition(vec3.lerp(hPos, new vec3(0, wbTargetY + 12.5, wbTargetZ + 2.0), dt * 5.0));
    }

    if (state.subLabel) {
        var sPos = state.subLabel.getTransform().getWorldPosition();
        state.subLabel.getTransform().setWorldPosition(vec3.lerp(sPos, new vec3(0, wbTargetY + 9.8, wbTargetZ + 2.0), dt * 5.0));
    }

    // 6. Animate Sticky Notes with 15° Cylindrical Curvature & Hover Scaling
    for (var i = 0; i < state.notes.length; i++) {
        var n = state.notes[i];
        var isHover = (i === hoveredIndex) && (state.draggedNote !== n);
        var scaleTargetMultiplier = isHover ? 1.14 : 1.0;
        var noteTargetScale = n.baseScale.uniformScale(scaleTargetMultiplier * state.ambientOpacity);

        n.curScale = vec3.lerp(n.curScale, noteTargetScale, dt * 8.0);
        n.obj.getTransform().setWorldScale(n.curScale);

        if (state.draggedNote === n) {
            n.obj.getTransform().setWorldPosition(n.curPos);
        } else {
            var nPos = n.obj.getTransform().getWorldPosition();
            var targetZ = (state.mode === "WORKSPACE_FOCUS") ? n.targetPos.z : n.targetPos.z - 30.0;
            var tPos = new vec3(n.targetPos.x, n.targetPos.y, targetZ);
            n.curPos = vec3.lerp(nPos, tPos, dt * 6.0);
            n.obj.getTransform().setWorldPosition(n.curPos);
        }

        if (n.labelObj) {
            n.labelObj.getTransform().setWorldPosition(new vec3(n.curPos.x, n.curPos.y, n.curPos.z + 0.8));
        }
    }

    // 7. Update Glowing Constellation Links in Real-Time
    updateConstellationConnections();

    // 8. Animate AI Assistant Holographic Orb
    var aiCore = findObjectByName("AI_Assistant_Core");
    if (aiCore) {
        var aiTrans = aiCore.getTransform();
        var aiPulse = (4.2 + Math.sin(state.time * 3.5) * 0.45 + state.pulseEnergy * 2.2) * state.ambientOpacity;
        aiTrans.setWorldScale(new vec3(aiPulse, aiPulse, aiPulse));
        aiTrans.setLocalRotation(quat.fromEulerAngles(state.time * 0.8, state.time * 1.4, state.time * 0.4));
    }

    // 9. Animate Audio Ripple Wave
    if (state.audioRippleActive && state.audioRipple) {
        state.audioRippleScale += dt * 14.0;
        state.audioRipple.getTransform().setWorldScale(new vec3(state.audioRippleScale, state.audioRippleScale, 0.4));
        var alphaRipple = Math.max(0.0, 1.0 - (state.audioRippleScale / 12.0));
        applyMaterialStyle(state.audioRipple, null, new vec4(0.0, 0.94, 1.0, alphaRipple * 0.7));
        if (alphaRipple <= 0.01) {
            state.audioRippleActive = false;
        }
    }
});

// ------------------------------------------------------------------------------
// AI Spatial Assistant Synthesis Engine (Contextual Live Bridge with Edge Inference)
// ------------------------------------------------------------------------------
function triggerAIAssistant() {
    var wsKey = state.focusedWorkspace || "Think";
    var ws = WORKSPACES[wsKey];
    if (!ws) return;

    state.aiIndex++;
    state.pulseEnergy = 1.0;

    // Use LiveAIAssistantModule if loaded
    if (state.aiModule) {
        var selectedNode = (state.notes.length >= 4) ? state.notes[3] : state.notes[0];
        state.aiModule.synthesizeSpatialExpansion(selectedNode, wsKey, function(result) {
            print("[INFINITY OS] ✦ Live AI Module Returned: " + result.title);
            if (state.subLabel) {
                setTextContent(state.subLabel, result.title + " // " + result.body.split("\n")[0]);
            }
            if (state.notes.length >= 4) {
                var aiNote = state.notes[3];
                aiNote.targetPos = new vec3(aiNote.targetPos.x, aiNote.targetPos.y - 1.5, aiNote.targetPos.z);
                aiNote.status = "SYNCHRONIZED";
                aiNote.cfg.title = result.title;
                aiNote.cfg.body = result.body;
                if (aiNote.labelObj) {
                    var st = SPATIAL_STATES["SYNCHRONIZED"];
                    var updatedText = result.title + "\n" + result.body + "\n[ " + st.label + " ]";
                    setTextContent(aiNote.labelObj, updatedText, 4.4);
                }
            }
        });
    } else {
        var expansion = ws.aiExpansions[state.aiIndex % ws.aiExpansions.length];
        print("[INFINITY OS] ✦ AI Assistant Activated: " + expansion);
        if (state.subLabel) {
            setTextContent(state.subLabel, "✦ AI SYNTHESIS: " + expansion);
        }
        if (state.notes.length >= 4) {
            var aiNoteLegacy = state.notes[3];
            aiNoteLegacy.targetPos = new vec3(aiNoteLegacy.targetPos.x, aiNoteLegacy.targetPos.y - 1.5, aiNoteLegacy.targetPos.z);
            aiNoteLegacy.status = "SYNCHRONIZED";
            if (aiNoteLegacy.labelObj) {
                var stLegacy = SPATIAL_STATES["SYNCHRONIZED"];
                var updatedTextLegacy = "✦ AI SYNTHESIS #" + state.aiIndex + "\n• " + expansion + "\n[ " + stLegacy.label + " ]";
                setTextContent(aiNoteLegacy.labelObj, updatedTextLegacy, 4.4);
            }
        }
    }

    // Trigger visual spatial sound ripple from AI core
    triggerAudioRipple(new vec3(-2.0, -8.5, -67.5));

    // Advance FTUE step 3 if active
    if (state.ftueOnboarding && state.ftueOnboarding.isActive()) {
        state.ftueOnboarding.advance(3);
    }
}

// ------------------------------------------------------------------------------
// Voice Command Simulator & SIK Audio Status HUD
// ------------------------------------------------------------------------------
function handleVoiceCommand(cmd) {
    if (!cmd) return;
    var c = cmd.toLowerCase().trim();
    print("[INFINITY OS] 🎙️ Processing Voice Command: '" + c + "'");

    if (state.voiceHud && state.voiceHudLabel) {
        setTextContent(state.voiceHudLabel, "[ 🎙️ VOICE: \"" + c.toUpperCase() + "\" ➔ EXECUTING ]", 4.4);
        applyMaterialStyle(state.voiceHud, null, new vec4(1.0, 0.75, 0.08, 0.95)); // Radiant Gold
        state.voiceHudTimer = 2.8;
    }

    if (c.indexOf("expand") !== -1 || c.indexOf("ai") !== -1 || c.indexOf("synthesize") !== -1) {
        triggerAIAssistant();
    } else if (c.indexOf("think") !== -1) {
        enterFocusMode("Think");
    } else if (c.indexOf("create") !== -1) {
        enterFocusMode("Create");
    } else if (c.indexOf("learn") !== -1) {
        enterFocusMode("Learn");
    } else if (c.indexOf("store") !== -1) {
        enterFocusMode("Store");
    } else if (c.indexOf("explore") !== -1) {
        enterFocusMode("Explore");
    } else if (c.indexOf("galaxy") !== -1 || c.indexOf("overview") !== -1 || c.indexOf("zoom out") !== -1) {
        returnToGalaxy();
    } else if (c.indexOf("replay") !== -1 || c.indexOf("tutorial") !== -1) {
        if (state.ftueOnboarding) {
            state.ftueOnboarding.reset();
            initFTUEBillboard();
        }
    } else if (c.indexOf("export") !== -1 || c.indexOf("save") !== -1) {
        exportWorkspaceDocument();
    } else if (c.indexOf("keyboard") !== -1 || c.indexOf("edit") !== -1) {
        if (state.noteEditor && state.notes.length > 0) {
            state.noteEditor.openEditor(state.notes[0]);
        }
    }
}
global.infinityVoiceCommand = handleVoiceCommand;

// ------------------------------------------------------------------------------
// Workspace Session Document Exporter (Feature E Native Port)
// ------------------------------------------------------------------------------
function exportWorkspaceDocument() {
    if (!global.SessionDocumentExporter) return null;
    var wsKey = state.focusedWorkspace || "Think";
    var drawnShapes = (state.shapeModule && state.shapeModule.drawnObjects) ? state.shapeModule.drawnObjects : [];

    var exportResult = global.SessionDocumentExporter.exportSessionDocument({
        workspaceName: wsKey,
        notes: state.notes,
        shapes: drawnShapes
    });

    if (state.voiceHud && state.voiceHudLabel) {
        setTextContent(state.voiceHudLabel, "[ ✓ SESSION EXPORTED TO VAULT // MD+JSON ]", 4.2);
        applyMaterialStyle(state.voiceHud, null, new vec4(0.0, 1.0, 0.66, 0.95)); // Emerald
        state.voiceHudTimer = 3.5;
    }
    state.pulseEnergy = 1.0;
    return exportResult;
}
global.infinityExportSession = exportWorkspaceDocument;

// ------------------------------------------------------------------------------
// Interaction Handler: True 3D Vector Raycast for SIK & Preview Mouse
// ------------------------------------------------------------------------------
function handleTapOrPinch(screenPos) {
    if (!state.camera) return;

    print("[INFINITY OS] 3D Raycast Tap/Pinch event at: (" + screenPos.x.toFixed(2) + ", " + screenPos.y.toFixed(2) + ")");

    // 0. Check Note Editor & Keyboard Subsystem First
    if (state.noteEditor && state.noteEditor.active) {
        var editorHit = state.noteEditor.checkRayHit(screenPos, raycast3D);
        if (editorHit) return;
    }

    // 1. Check AI Assistant Core 3D Ray Hit
    var aiCore = findObjectByName("AI_Assistant_Core");
    if (aiCore) {
        var aiPos = aiCore.getTransform().getWorldPosition();
        var aiHit = raycast3D(screenPos, aiPos, 5.5);
        if (aiHit.hit) {
            triggerAIAssistant();
            return;
        }
    }

    // 2. Return to Galaxy when tapping upper margin in Focus Mode
    if (state.mode === "WORKSPACE_FOCUS" && screenPos.y < 0.12) {
        returnToGalaxy();
        return;
    }

    // 3. Check Sticky Note 3D Ray Hit (Cycle Status or Open Editor)
    for (var i = 0; i < state.notes.length; i++) {
        var note = state.notes[i];
        var noteHit = raycast3D(screenPos, note.curPos, 8.5);
        if (noteHit.hit) {
            // If already in focus and tapped on upper part of note card, open 3D Editor
            if (state.noteEditor && screenPos.y > 0.42 && screenPos.y < 0.60) {
                state.noteEditor.openEditor(note);
            } else {
                cycleNoteStatus(note);
            }
            if (state.ftueOnboarding && state.ftueOnboarding.isActive()) {
                state.ftueOnboarding.advance(2);
            }
            return;
        }
    }

    // 4. Check Planet Selection 3D Ray Hit
    var closestPlanet = null;
    var minRayDist = 12.0;

    for (var key in state.planets) {
        var p = state.planets[key];
        var pPos = p.obj.getTransform().getWorldPosition();
        var pHit = raycast3D(screenPos, pPos, p.config.baseScale.x * 1.4);

        if (pHit.hit && pHit.dist3D < minRayDist) {
            minRayDist = pHit.dist3D;
            closestPlanet = key;
        }
    }

    if (closestPlanet) {
        if (state.mode === "GALAXY") {
            enterFocusMode(closestPlanet);
        } else if (closestPlanet === state.focusedWorkspace) {
            returnToGalaxy();
        } else {
            enterFocusMode(closestPlanet);
        }
        if (state.ftueOnboarding && state.ftueOnboarding.isActive()) {
            state.ftueOnboarding.advance(2);
        }
    }
}

// ------------------------------------------------------------------------------
// Pinch-and-Drag / Touch-and-Drag with 3D Ray Plane Intersection & Inking
// ------------------------------------------------------------------------------
function handleDragStart(screenPos) {
    if (!state.camera || state.mode !== "WORKSPACE_FOCUS") return;
    state.lastScreenPos = screenPos;

    // Check if grabbing a note
    for (var i = 0; i < state.notes.length; i++) {
        var note = state.notes[i];
        var nHit = raycast3D(screenPos, note.curPos, 9.5);
        if (nHit.hit) {
            state.draggedNote = note;
            print("[INFINITY OS] 3D Grabbed Note: " + note.id);
            if (state.ftueOnboarding && state.ftueOnboarding.isActive()) {
                state.ftueOnboarding.advance(1);
            }
            return;
        }
    }

    // If not grabbing note, start freehand stroke on desk plane (Feature C)
    if (state.shapeModule && !state.draggedNote) {
        var worldPt = state.camera.screenSpaceToWorldSpace(screenPos, 108.0);
        state.shapeModule.startStroke(new vec3(worldPt.x, worldPt.y, -67.5));
    }
}

function handleDragMove(screenPos) {
    state.lastScreenPos = screenPos;
    if (!state.camera) return;

    if (state.draggedNote) {
        // Raycast onto comfortable desk workspace plane (Z = -68.0cm)
        var worldPt = state.camera.screenSpaceToWorldSpace(screenPos, 108.0);
        var clampedX = Math.max(-28.0, Math.min(28.0, worldPt.x));
        var clampedY = Math.max(-16.0, Math.min(14.0, worldPt.y));
        state.draggedNote.curPos = new vec3(clampedX, clampedY, -68.0);
        state.draggedNote.targetPos = state.draggedNote.curPos;
    } else if (state.shapeModule && state.shapeModule.isDrawing) {
        var strokePt = state.camera.screenSpaceToWorldSpace(screenPos, 108.0);
        state.shapeModule.addStrokePoint(new vec3(strokePt.x, strokePt.y, -67.5));
    }
}

function handleDragEnd() {
    if (state.draggedNote) {
        print("[INFINITY OS] 3D Positioned Note: " + state.draggedNote.id + " at " + state.draggedNote.curPos.toString());
        state.draggedNote = null;
        if (state.focusedWorkspace) {
            saveWorkspaceState(state.focusedWorkspace);
        }
    } else if (state.shapeModule && state.shapeModule.isDrawing) {
        var recognized = state.shapeModule.endStroke();
        if (recognized) {
            state.pulseEnergy = 0.8;
            triggerAudioRipple(recognized.obj.getTransform().getWorldPosition());
        }
    }
}

// ------------------------------------------------------------------------------
// Bind Lens Studio Input Events
// ------------------------------------------------------------------------------
script.createEvent("TapEvent").bind(function(eventData) {
    handleTapOrPinch(eventData.getTapPosition());
});

script.createEvent("TouchStartEvent").bind(function(eventData) {
    handleDragStart(eventData.getTouchPosition());
});

script.createEvent("TouchMoveEvent").bind(function(eventData) {
    handleDragMove(eventData.getTouchPosition());
});

script.createEvent("TouchEndEvent").bind(function(eventData) {
    handleDragEnd();
});
