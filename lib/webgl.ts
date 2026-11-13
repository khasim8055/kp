/** Small WebGL helpers shared by the site's two scenes. No dependencies. */

export type Rgb = [number, number, number];

/** Read a CSS colour value such as "#f5b947" or "rgb(245, 185, 71)". */
export function parseColor(value: string, fallback: Rgb): Rgb {
  const v = value.trim();
  if (v.startsWith("#")) {
    let hex = v.slice(1);
    if (hex.length === 3) hex = hex.split("").map((part) => part + part).join("");
    const n = Number.parseInt(hex.slice(0, 6), 16);
    if (Number.isNaN(n)) return fallback;
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const match = v.match(/(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)/);
  if (match) return [Number(match[1]) / 255, Number(match[2]) / 255, Number(match[3]) / 255];
  return fallback;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function linkProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const vertex = compile(gl, gl.VERTEX_SHADER, vs);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fs);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  return program;
}

/**
 * Slow-device guard. Call `tick` once per drawn frame. If twelve frames in a
 * row come in under roughly 20 a second (weak GPU or software rendering),
 * `tick` returns true once and the scene should stop for good and leave its
 * static fallback in place.
 *
 * One long gap is a pause, not a slow frame: the scene left the screen or the
 * tab went to the background. The count then starts again. Four long gaps in
 * a row are not a pause: the device cannot keep up at all, and the scene
 * stops too. Call `resume` whenever the frame loop restarts.
 */
export function createFrameGuard(slowFrameMs = 50) {
  let done = false;
  let count = 0;
  let sum = 0;
  let prev = 0;
  let stalls = 0;
  return {
    resume() {
      prev = 0;
      stalls = 0;
    },
    tick(now: number) {
      if (done) return false;
      const delta = prev ? now - prev : 0;
      prev = now;
      if (!delta) return false;
      if (delta > 250) {
        count = 0;
        sum = 0;
        stalls += 1;
        if (stalls < 4) return false;
        done = true;
        return true;
      }
      stalls = 0;
      count += 1;
      // The first frames include shader compilation, so they are not counted.
      if (count <= 3) return false;
      sum += delta;
      if (count < 15) return false;
      done = true;
      return sum / 12 > slowFrameMs;
    },
  };
}

/** Column-major 4x4 matrices, as WebGL expects. */
export type Mat4 = Float32Array;

export function perspective(fovY: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fovY / 2);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) / (near - far);
  m[11] = -1;
  m[14] = (2 * far * near) / (near - far);
  return m;
}

export function lookAt(
  eye: [number, number, number],
  target: [number, number, number],
): Mat4 {
  let zx = eye[0] - target[0];
  let zy = eye[1] - target[1];
  let zz = eye[2] - target[2];
  const zl = Math.hypot(zx, zy, zz) || 1;
  zx /= zl;
  zy /= zl;
  zz /= zl;
  // right = up x z, with up = (0, 1, 0)
  let xx = zz;
  let xz = -zx;
  const xl = Math.hypot(xx, xz) || 1;
  xx /= xl;
  xz /= xl;
  // true up = z x right
  const yx = zy * xz;
  const yy = zz * xx - zx * xz;
  const yz = -zy * xx;
  const m = new Float32Array(16);
  m[0] = xx;
  m[1] = yx;
  m[2] = zx;
  m[4] = 0;
  m[5] = yy;
  m[6] = zy;
  m[8] = xz;
  m[9] = yz;
  m[10] = zz;
  m[12] = -(xx * eye[0] + xz * eye[2]);
  m[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2]);
  m[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2]);
  m[15] = 1;
  return m;
}

export function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col += 1) {
    for (let row = 0; row < 4; row += 1) {
      let sum = 0;
      for (let k = 0; k < 4; k += 1) {
        sum += (a[k * 4 + row] ?? 0) * (b[col * 4 + k] ?? 0);
      }
      out[col * 4 + row] = sum;
    }
  }
  return out;
}
