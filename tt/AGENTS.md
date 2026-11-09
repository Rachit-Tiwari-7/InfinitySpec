<!-- BEGIN Lens Studio managed AGENTS block -->

# Lens Studio Project Reference - INFINITY // Cosmic Spatial OS

This project uses Lens Studio. Scripts can be written in JavaScript (ES2021 compliant) or TypeScript.

## Environment
- The global execution context is the `script` object in JavaScript, or `this` in TypeScript components.
- UI inputs are defined using comment-based decorators (`// @input`) in JavaScript.
- Lens Studio uses a right-handed coordinate system: +X cross +Y gives +Z. The vec3 constant `forward` is defined as `(0, 0, 1)` (+Z). A camera with identity rotation faces towards world −Z.
- World units are in **centimeters** (cm). Rotation uses radians at runtime.
- Always work with files inside the `Assets/` directory.

<!-- END Lens Studio managed AGENTS block -->
