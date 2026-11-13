/**
 * Data and projection for the hero figure.
 *
 * The figure shows the idea behind a "distance to closest record" privacy
 * check: synthetic records next to the real records they were generated from.
 * The points are generated from a fixed seed. They illustrate the method and
 * are not results from any study.
 *
 * The same numbers feed the static SVG (server) and the WebGL scene (client),
 * so the two line up exactly when the canvas takes over.
 */

export type AuditData = {
  /** Real records, flat xyz in the range -1 to 1. */
  real: number[];
  /** Synthetic records, flat xyz in the range -1 to 1. */
  synth: number[];
  /** For each synthetic record, the index of its closest real record. */
  nearest: number[];
  /** For each synthetic record, the distance to that real record. */
  dist: number[];
  /** True when the distance is under the threshold. */
  flagged: boolean[];
  flaggedCount: number;
};

/** Under this distance a synthetic record counts as too close. */
export const AUDIT_THRESHOLD = 0.06;

/** Resting pose shared by the SVG and the first WebGL frame. */
export const AUDIT_POSE = { yaw: 0.62, pitch: 0.3 } as const;

/** Camera shared by the SVG and the WebGL scene. */
export const AUDIT_CAMERA = { focal: 3.45, distance: 6 } as const;

const REAL_COUNT = 60;
const SYNTH_COUNT = 92;
const PLANTED = 6;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number) {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const clusters = [
  { c: [-0.52, 0.36, -0.3], s: 0.3 },
  { c: [0.5, 0.44, 0.34], s: 0.27 },
  { c: [0.0, -0.5, 0.16], s: 0.31 },
  { c: [0.58, -0.3, -0.56], s: 0.25 },
] as const;

const clamp = (value: number) => Math.max(-0.94, Math.min(0.94, value));
const round = (value: number) => Math.round(value * 1000) / 1000;

let cached: AuditData | null = null;

export function buildAuditData(): AuditData {
  if (cached) return cached;
  const rand = mulberry32(20261113);

  const sample = (count: number) => {
    const out: number[] = [];
    for (let i = 0; i < count; i += 1) {
      const cluster = clusters[Math.floor(rand() * clusters.length)] ?? clusters[0];
      for (let axis = 0; axis < 3; axis += 1) {
        out.push(round(clamp(cluster.c[axis] + gaussian(rand) * cluster.s)));
      }
    }
    return out;
  };

  const real = sample(REAL_COUNT);
  const synth = sample(SYNTH_COUNT);

  // A few synthetic records are placed almost on top of a real one. These are
  // the cases a privacy audit has to find.
  for (let k = 0; k < PLANTED; k += 1) {
    const s = Math.floor(rand() * SYNTH_COUNT);
    const r = Math.floor(rand() * REAL_COUNT);
    for (let axis = 0; axis < 3; axis += 1) {
      const offset = (rand() - 0.5) * 0.03;
      synth[s * 3 + axis] = round(clamp((real[r * 3 + axis] ?? 0) + offset));
    }
  }

  const nearest: number[] = [];
  const dist: number[] = [];
  const flagged: boolean[] = [];
  for (let s = 0; s < SYNTH_COUNT; s += 1) {
    let best = 0;
    let bestDist = Infinity;
    for (let r = 0; r < REAL_COUNT; r += 1) {
      const dx = (synth[s * 3] ?? 0) - (real[r * 3] ?? 0);
      const dy = (synth[s * 3 + 1] ?? 0) - (real[r * 3 + 1] ?? 0);
      const dz = (synth[s * 3 + 2] ?? 0) - (real[r * 3 + 2] ?? 0);
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < bestDist) {
        bestDist = d;
        best = r;
      }
    }
    nearest.push(best);
    dist.push(round(bestDist));
    flagged.push(bestDist < AUDIT_THRESHOLD);
  }

  cached = {
    real,
    synth,
    nearest,
    dist,
    flagged,
    flaggedCount: flagged.filter(Boolean).length,
  };
  return cached;
}

/** Rotate a point around the vertical axis, then tilt it toward the viewer. */
export function rotatePoint(
  x: number,
  y: number,
  z: number,
  yaw: number,
  pitch: number,
): [number, number, number] {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const y1 = y * cp - z1 * sp;
  const z2 = y * sp + z1 * cp;
  return [x1, y1, z2];
}

/**
 * Project a point to normalised device coordinates (-1 to 1, y up).
 * `w` grows with distance from the camera and is used for depth cues.
 */
export function projectPoint(
  x: number,
  y: number,
  z: number,
  yaw: number,
  pitch: number,
  aspect = 1,
) {
  const [rx, ry, rz] = rotatePoint(x, y, z, yaw, pitch);
  const w = AUDIT_CAMERA.distance - rz;
  const scale = AUDIT_CAMERA.focal / w;
  return {
    x: (rx * scale) / Math.max(aspect, 1),
    y: ry * scale * Math.min(aspect, 1),
    w,
  };
}

/** Depth cue: points further from the camera are drawn fainter. */
export function depthFade(w: number) {
  return Math.max(0.35, Math.min(1, 1.15 - (w - AUDIT_CAMERA.distance + 1.2) * 0.32));
}

/** Edges of the frame around the data, as pairs of corner coordinates. */
export function frameEdges(): number[][] {
  const edges: number[][] = [];
  const corners = [-1, 1];
  for (const a of corners) {
    for (const b of corners) {
      edges.push([-1, a, b, 1, a, b]);
      edges.push([a, -1, b, a, 1, b]);
      edges.push([a, b, -1, a, b, 1]);
    }
  }
  return edges;
}

/** Short tick marks along the three axes that meet at the bottom corner. */
export function axisTicks(): number[][] {
  const ticks: number[][] = [];
  const len = 0.06;
  for (let i = 0; i <= 4; i += 1) {
    const t = -1 + i * 0.5;
    ticks.push([t, -1, 1, t, -1 - len, 1]);
    ticks.push([-1, t, 1, -1 - len, t, 1]);
    ticks.push([-1, -1, t, -1 - len, -1, t]);
  }
  return ticks;
}
