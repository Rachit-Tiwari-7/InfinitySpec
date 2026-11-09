// ==============================================================================
// INFINITY // DrawingAndSnappingModule.js (Lens Studio Native Port)
// Real-Time 3D Stroke Capture, Procedural Ribbon Drawing, and Hold-to-Snap
// Ports Feature C: Circle, Rectangle, Line snapping using ShapeRecognizer
// ==============================================================================

function DrawingAndSnappingModule(kernelState) {
    this.kernel = kernelState;
    this.recognizer = new ShapeRecognizer();
    this.isDrawing = false;
    this.currentStrokePoints = [];
    this.drawnObjects = [];
    this.strokeSegments = [];
    this.maxSegments = 30;

    // Pre-instantiate reusable 3D stroke segment primitives (pool pattern)
    this.initStrokePool();
}

DrawingAndSnappingModule.prototype.initStrokePool = function() {
    this.strokePool = [];
    for (var i = 0; i < this.maxSegments; i++) {
        var seg = global.scene.createSceneObject("Stroke_Segment_" + i);
        var vis = seg.createComponent("Component.RenderMeshVisual");
        if (this.kernel.boxMesh) vis.mesh = this.kernel.boxMesh;
        if (this.kernel.pbrMaterial) vis.material = this.kernel.pbrMaterial;
        seg.getTransform().setWorldScale(new vec3(0.3, 0.3, 0.3));
        this.applyColor(seg, new vec4(0.0, 0.94, 1.0, 0.9));
        seg.enabled = false;
        this.strokePool.push(seg);
    }
};

DrawingAndSnappingModule.prototype.applyColor = function(obj, color) {
    if (!obj) return;
    var visual = obj.getComponent("Component.RenderMeshVisual") || obj.getComponent("RenderMeshVisual");
    if (visual && visual.mainPass && visual.mainPass.baseColor) {
        visual.mainPass.baseColor = color;
    }
};

DrawingAndSnappingModule.prototype.startStroke = function(point3D) {
    this.isDrawing = true;
    this.currentStrokePoints = [{ x: point3D.x, y: point3D.y, z: point3D.z }];
    this.resetStrokePool();
};

DrawingAndSnappingModule.prototype.addStrokePoint = function(point3D) {
    if (!this.isDrawing) return;
    var last = this.currentStrokePoints[this.currentStrokePoints.length - 1];
    var dx = point3D.x - last.x;
    var dy = point3D.y - last.y;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0.8) {
        this.currentStrokePoints.push({ x: point3D.x, y: point3D.y, z: point3D.z });
        this.renderStrokeSegments();
    }
};

DrawingAndSnappingModule.prototype.renderStrokeSegments = function() {
    var count = Math.min(this.currentStrokePoints.length - 1, this.maxSegments);
    for (var i = 0; i < count; i++) {
        var pA = this.currentStrokePoints[i];
        var pB = this.currentStrokePoints[i + 1];

        var midX = (pA.x + pB.x) * 0.5;
        var midY = (pA.y + pB.y) * 0.5;
        var midZ = (pA.z + pB.z) * 0.5;

        var dx = pB.x - pA.x;
        var dy = pB.y - pA.y;
        var dz = pB.z - pA.z;
        var len = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (len < 0.01) len = 0.01;

        var segObj = this.strokePool[i];
        segObj.enabled = true;
        var trans = segObj.getTransform();
        trans.setWorldPosition(new vec3(midX, midY, midZ));
        trans.setWorldScale(new vec3(0.28, 0.28, len));

        var dir = new vec3(dx / len, dy / len, dz / len);
        trans.setLocalRotation(quat.lookAt(dir, vec3.up()));
    }
};

DrawingAndSnappingModule.prototype.resetStrokePool = function() {
    for (var i = 0; i < this.strokePool.length; i++) {
        this.strokePool[i].enabled = false;
    }
};

DrawingAndSnappingModule.prototype.endStroke = function() {
    if (!this.isDrawing) return null;
    this.isDrawing = false;
    this.resetStrokePool();

    if (this.currentStrokePoints.length < 5) {
        this.currentStrokePoints = [];
        return null;
    }

    // Run geometric shape recognition
    var shape = this.recognizer.recognize(this.currentStrokePoints);
    if (shape) {
        print("[INFINITY INK] ✦ Snapped Shape Recognized: " + shape.type.toUpperCase());
        var snappedMesh = this.instantiateSnappedShape(shape);
        this.currentStrokePoints = [];
        return { shape: shape, obj: snappedMesh };
    } else {
        print("[INFINITY INK] Freehand stroke recorded (" + this.currentStrokePoints.length + " points)");
        this.currentStrokePoints = [];
        return null;
    }
};

DrawingAndSnappingModule.prototype.instantiateSnappedShape = function(shape) {
    var snappedObj = global.scene.createSceneObject("Snapped_Shape_" + shape.type + "_" + (this.drawnObjects.length + 1));
    var vis = snappedObj.createComponent("Component.RenderMeshVisual");

    if (shape.type === "circle") {
        if (this.kernel.torusMesh) vis.mesh = this.kernel.torusMesh;
        else if (this.kernel.sphereMesh) vis.mesh = this.kernel.sphereMesh;
        snappedObj.getTransform().setWorldPosition(new vec3(shape.cx, shape.cy, -67.5));
        var diam = shape.r * 2.0;
        snappedObj.getTransform().setWorldScale(new vec3(diam, diam, 0.4));
        this.applyColor(snappedObj, new vec4(1.0, 0.75, 0.08, 0.95)); // Gold ring
    } else if (shape.type === "rect") {
        if (this.kernel.boxMesh) vis.mesh = this.kernel.boxMesh;
        snappedObj.getTransform().setWorldPosition(new vec3(shape.cx, shape.cy, -67.5));
        snappedObj.getTransform().setWorldScale(new vec3(shape.width, shape.height, 0.4));
        this.applyColor(snappedObj, new vec4(0.0, 1.0, 0.66, 0.90)); // Emerald frame
    } else if (shape.type === "line") {
        if (this.kernel.boxMesh) vis.mesh = this.kernel.boxMesh;
        snappedObj.getTransform().setWorldPosition(new vec3(shape.cx, shape.cy, -67.5));
        snappedObj.getTransform().setWorldScale(new vec3(0.35, 0.35, shape.length));
        var dx = shape.end.x - shape.start.x;
        var dy = shape.end.y - shape.start.y;
        var dir = new vec3(dx / shape.length, dy / shape.length, 0);
        snappedObj.getTransform().setLocalRotation(quat.lookAt(dir, vec3.up()));
        this.applyColor(snappedObj, new vec4(0.0, 0.94, 1.0, 0.95)); // Cyan beam
    }

    this.drawnObjects.push(shape);
    return snappedObj;
};

global.DrawingAndSnappingModule = DrawingAndSnappingModule;
