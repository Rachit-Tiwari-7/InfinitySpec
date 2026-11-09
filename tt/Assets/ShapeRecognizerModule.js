// ==============================================================================
// INFINITY // ShapeRecognizerModule.js (Lens Studio Native Port)
// 1:1 Mathematical Port of web/js/shape_recognizer.js
// Recognizes circles, rectangles, diamonds, and straight lines from raw strokes
// ==============================================================================

function ShapeRecognizer() {
    this.minPoints = 6;
    this.autoNeatenEnabled = true;
}

ShapeRecognizer.prototype.recognize = function(points) {
    if (!points || points.length < this.minPoints) return null;

    var n = points.length;
    var pStart = points[0];
    var pEnd = points[n - 1];

    // 1. Total path perimeter / cumulative length
    var totalLength = 0;
    for (var i = 1; i < n; i++) {
        var dx = points[i].x - points[i - 1].x;
        var dy = points[i].y - points[i - 1].y;
        totalLength += Math.sqrt(dx * dx + dy * dy);
    }
    if (totalLength < 0.5) return null; // In world units (cm)

    // 2. Bounding box & centroid
    var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    var sumX = 0, sumY = 0;
    for (var j = 0; j < n; j++) {
        var p = points[j];
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
        sumX += p.x;
        sumY += p.y;
    }
    var width = maxX - minX;
    var height = maxY - minY;
    var cx = sumX / n;
    var cy = sumY / n;

    // Start-to-end closure distance
    var endDx = pEnd.x - pStart.x;
    var endDy = pEnd.y - pStart.y;
    var endDist = Math.sqrt(endDx * endDx + endDy * endDy);
    var isClosed = endDist < Math.max(1.8, totalLength * 0.32);

    // --------------------------------------------------------------------------
    // A. Circle Detection
    // --------------------------------------------------------------------------
    if (isClosed && width > 1.2 && height > 1.2) {
        var sumR = 0;
        var radii = [];
        for (var k = 0; k < n; k++) {
            var r = Math.sqrt(Math.pow(points[k].x - cx, 2) + Math.pow(points[k].y - cy, 2));
            radii.push(r);
            sumR += r;
        }
        var meanR = sumR / n;

        var varR = 0;
        for (var m = 0; m < n; m++) {
            var diff = radii[m] - meanR;
            varR += diff * diff;
        }
        var stdR = Math.sqrt(varR / n);
        var ratioStd = stdR / (meanR || 1.0);
        var aspect = Math.min(width, height) / Math.max(width, height);

        if (ratioStd < 0.26 && aspect > 0.60) {
            return {
                type: "circle",
                cx: cx,
                cy: cy,
                r: meanR,
                width: meanR * 2,
                height: meanR * 2
            };
        }

        // ----------------------------------------------------------------------
        // B. Rectangle / Box Detection
        // ----------------------------------------------------------------------
        var boxPerimeter = 2 * (width + height);
        var perimRatio = totalLength / (boxPerimeter || 1.0);
        if (perimRatio > 0.65 && perimRatio < 1.45) {
            return {
                type: "rect",
                x: minX,
                y: minY,
                cx: cx,
                cy: cy,
                width: width,
                height: height
            };
        }
    }

    // --------------------------------------------------------------------------
    // C. Straight Line Detection
    // --------------------------------------------------------------------------
    if (!isClosed && totalLength > 1.5) {
        var lineDx = pEnd.x - pStart.x;
        var lineDy = pEnd.y - pStart.y;
        var lineLen = Math.sqrt(lineDx * lineDx + lineDy * lineDy);

        if (lineLen > 0) {
            var maxDev = 0;
            for (var l = 1; l < n - 1; l++) {
                var dev = Math.abs(lineDy * points[l].x - lineDx * points[l].y + pEnd.x * pStart.y - pEnd.y * pStart.x) / lineLen;
                if (dev > maxDev) maxDev = dev;
            }
            if (maxDev / lineLen < 0.18) {
                return {
                    type: "line",
                    start: pStart,
                    end: pEnd,
                    cx: (pStart.x + pEnd.x) * 0.5,
                    cy: (pStart.y + pEnd.y) * 0.5,
                    length: lineLen
                };
            }
        }
    }

    return null; // Freehand stroke
};

global.ShapeRecognizer = ShapeRecognizer;
