/**
 * INFINITY Spatial Computer // ConstellationGraphEngine.ts
 * Derived from Obsidiar 3D Knowledge Graph Architecture.
 *
 * Implements:
 * 1. Fibonacci Sphere initial distribution (uniform spherical seeding).
 * 2. 3D Fruchterman-Reingold force-directed relaxation in flat Float32Array buffers (100% GC-free).
 * 3. Median nearest-neighbor constant density normalization.
 * 4. Golden-Angle spectral hue generation for dynamic topics.
 * 5. Progressive bloom quadratic ease-out interpolation.
 */

export interface GraphNodeInput {
  id: string;
  category?: string;
  wordCount?: number;
  weight?: number;
  links: string[];
}

export interface SolvedNodePosition {
  id: string;
  position: vec3;
  color: vec4;
  scale: vec3;
}

export const GOLDEN_ANGLE_FRACTION = 0.61803398875;
export const DEFAULT_LINK_LENGTH = 1.0;
export const DEFAULT_REPULSION = 1.2;
export const DEFAULT_LINK_ATTRACTION = 0.8;
export const DEFAULT_CENTER_GRAVITY = 0.1;
export const DEFAULT_NODE_SPACING_CM = 20.0;
export const DEFAULT_LAYOUT_ITERS = 40;
export const DEFAULT_GROW_DURATION_SEC = 0.3;

@component
export class ConstellationGraphEngine extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">ConstellationGraphEngine – 3D Force-Directed Galaxy</span>')
  @ui.separator

  @input
  @hint("Target spacing between adjacent nodes in cm")
  nodeSpacingCm: number = DEFAULT_NODE_SPACING_CM;

  @input
  @hint("Relaxation iterations for force solve")
  layoutIterations: number = DEFAULT_LAYOUT_ITERS;

  @input
  @hint("Progressive bloom growth duration in seconds")
  growDurationSec: number = DEFAULT_GROW_DURATION_SEC;

  onAwake(): void {
    // Export global bridge utilities for Lens Studio runtime
    (global as any).constellationFibonacciSphere = this.fibonacciSphere.bind(this);
    (global as any).constellationGoldenAngleColor = this.goldenAngleColor.bind(this);
    (global as any).constellationSolveLayout = this.solveLayout.bind(this);
    (global as any).constellationNormalizeDensity = this.normalizeDensity.bind(this);
    (global as any).constellationBloomScale = this.evaluateBloomScale.bind(this);
  }

  /**
   * Distribute points uniformly on a sphere using Fibonacci spiral geometry.
   */
  fibonacciSphere(i: number, total: number, radius: number): vec3 {
    if (total <= 1) {
      return new vec3(0, 0, -radius);
    }
    const offset = 2.0 / total;
    const increment = Math.PI * (3.0 - Math.sqrt(5.0)); // golden angle in radians (~2.3999 rad)
    const y = i * offset - 1.0 + offset * 0.5;
    const r = Math.sqrt(Math.max(0.0, 1.0 - y * y));
    const phi = i * increment;
    return new vec3(
      Math.cos(phi) * r * radius,
      y * radius,
      Math.sin(phi) * r * radius
    );
  }

  /**
   * Generate an evenly dispersed hue using the golden ratio conjugate.
   */
  goldenAngleColor(index: number, saturation: number = 0.6, value: number = 0.95): vec4 {
    const hue = (index * GOLDEN_ANGLE_FRACTION) % 1.0;
    return this.hsvToRgb(hue, saturation, value);
  }

  /**
   * Converts HSV color to RGBA vec4.
   */
  hsvToRgb(h: number, s: number, v: number): vec4 {
    const i = Math.floor(h * 6.0);
    const f = h * 6.0 - i;
    const p = v * (1.0 - s);
    const q = v * (1.0 - f * s);
    const t = v * (1.0 - (1.0 - f) * s);
    let r = 0.0;
    let g = 0.0;
    let b = 0.0;
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      default: r = v; g = p; b = q; break;
    }
    return new vec4(r, g, b, 1.0);
  }

  /**
   * Solve 3D force-directed layout using Fruchterman-Reingold in flat typed arrays.
   */
  relaxForces(
    initialPositions: vec3[],
    edgePairs: [number, number][],
    radius: number,
    iters: number = DEFAULT_LAYOUT_ITERS
  ): vec3[] {
    const n = initialPositions.length;
    if (n < 2) return initialPositions.slice();

    const x = new Float32Array(n);
    const y = new Float32Array(n);
    const z = new Float32Array(n);
    const dx = new Float32Array(n);
    const dy = new Float32Array(n);
    const dz = new Float32Array(n);

    for (let i = 0; i < n; i++) {
      x[i] = initialPositions[i].x;
      y[i] = initialPositions[i].y;
      z[i] = initialPositions[i].z;
    }

    const k = (radius / Math.pow(n, 1.0 / 3.0)) * DEFAULT_LINK_LENGTH;
    const k2 = k * k;

    for (let it = 0; it < iters; it++) {
      const temp = k * (1.0 - it / iters);

      for (let i = 0; i < n; i++) {
        dx[i] = 0;
        dy[i] = 0;
        dz[i] = 0;
      }

      // Repulsion between all node pairs
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          let vx = x[i] - x[j];
          let vy = y[i] - y[j];
          let vz = z[i] - z[j];
          let d2 = vx * vx + vy * vy + vz * vz;
          if (d2 < 0.01) {
            vx = Math.random() - 0.5;
            vy = Math.random() - 0.5;
            vz = Math.random() - 0.5;
            d2 = 0.01;
          }
          const f = (DEFAULT_REPULSION * k2) / d2;
          dx[i] += vx * f;
          dy[i] += vy * f;
          dz[i] += vz * f;
          dx[j] -= vx * f;
          dy[j] -= vy * f;
          dz[j] -= vz * f;
        }
      }

      // Attraction along links
      for (let e = 0; e < edgePairs.length; e++) {
        const i = edgePairs[e][0];
        const j = edgePairs[e][1];
        if (i < 0 || i >= n || j < 0 || j >= n) continue;
        const vx = x[i] - x[j];
        const vy = y[i] - y[j];
        const vz = z[i] - z[j];
        let d = Math.sqrt(vx * vx + vy * vy + vz * vz);
        if (d < 0.0001) d = 0.0001;
        const f = (DEFAULT_LINK_ATTRACTION * d) / k;
        dx[i] -= vx * f;
        dy[i] -= vy * f;
        dz[i] -= vz * f;
        dx[j] += vx * f;
        dy[j] += vy * f;
        dz[j] += vz * f;
      }

      // Center gravity + displacement clamp
      for (let i = 0; i < n; i++) {
        dx[i] -= x[i] * DEFAULT_CENTER_GRAVITY;
        dy[i] -= y[i] * DEFAULT_CENTER_GRAVITY;
        dz[i] -= z[i] * DEFAULT_CENTER_GRAVITY;

        const len = Math.sqrt(dx[i] * dx[i] + dy[i] * dy[i] + dz[i] * dz[i]);
        if (len > temp && len > 0.0001) {
          const s = temp / len;
          dx[i] *= s;
          dy[i] *= s;
          dz[i] *= s;
        }

        x[i] += dx[i];
        y[i] += dy[i];
        z[i] += dz[i];
      }
    }

    const result: vec3[] = [];
    for (let i = 0; i < n; i++) {
      result.push(new vec3(x[i], y[i], z[i]));
    }
    return result;
  }

  /**
   * Rescales the graph so the median nearest-neighbor distance equals targetSpacingCm.
   */
  normalizeDensity(positions: vec3[], targetSpacingCm: number = DEFAULT_NODE_SPACING_CM): vec3[] {
    const n = positions.length;
    if (n < 2) return positions.slice();

    const dists: number[] = [];
    for (let i = 0; i < n; i++) {
      const p = positions[i];
      let best = Infinity;
      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const q = positions[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dz = p.z - q.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < best) best = d2;
      }
      if (best < Infinity) {
        dists.push(Math.sqrt(best));
      }
    }

    if (dists.length === 0) return positions.slice();
    dists.sort((a, b) => a - b);
    let median = dists[Math.floor(dists.length / 2)];
    if (median < 0.0001) median = 0.0001;

    const scale = targetSpacingCm / median;
    return positions.map((p) => new vec3(p.x * scale, p.y * scale, p.z * scale));
  }

  /**
   * Quadratic ease-out bloom growth scale factor.
   */
  evaluateBloomScale(tElapsed: number, growDuration: number = DEFAULT_GROW_DURATION_SEC): number {
    let t = tElapsed / growDuration;
    if (t > 1.0) t = 1.0;
    if (t < 0.0) t = 0.0;
    return 1.0 - (1.0 - t) * (1.0 - t);
  }

  /**
   * Full end-to-end graph layout solver.
   */
  solveLayout(nodes: GraphNodeInput[], radius: number = 60.0): SolvedNodePosition[] {
    const n = nodes.length;
    if (n === 0) return [];

    const idToIdx: Record<string, number> = {};
    for (let i = 0; i < n; i++) {
      idToIdx[nodes[i].id] = i;
    }

    const edgePairs: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const links = nodes[i].links || [];
      for (let j = 0; j < links.length; j++) {
        const targetId = links[j];
        const targetIdx = idToIdx[targetId];
        if (targetIdx !== undefined && targetIdx > i) {
          edgePairs.push([i, targetIdx]);
        }
      }
    }

    // 1. Initial spherical seed
    const initialPositions: vec3[] = [];
    for (let i = 0; i < n; i++) {
      initialPositions.push(this.fibonacciSphere(i, n, radius));
    }

    // 2. Fruchterman-Reingold relaxation
    const relaxed = this.relaxForces(initialPositions, edgePairs, radius, this.layoutIterations);

    // 3. Density normalization
    const normalized = this.normalizeDensity(relaxed, this.nodeSpacingCm);

    // 4. Map output with colors and scales
    const solved: SolvedNodePosition[] = [];
    let maxWords = 1;
    for (let i = 0; i < n; i++) {
      const count = nodes[i].wordCount || nodes[i].weight || 10;
      if (count > maxWords) maxWords = count;
    }

    for (let i = 0; i < n; i++) {
      const node = nodes[i];
      const count = node.wordCount || node.weight || 10;
      const scaleFactor = 0.8 + 0.6 * (count / maxWords);
      const color = this.goldenAngleColor(i);

      solved.push({
        id: node.id,
        position: normalized[i],
        color: color,
        scale: new vec3(scaleFactor, scaleFactor, scaleFactor),
      });
    }

    return solved;
  }
}
