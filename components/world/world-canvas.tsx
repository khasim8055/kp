"use client";

import { useEffect, useRef } from "react";
import {
  createFrameGuard,
  linkProgram,
  lookAt,
  multiply,
  parseColor,
  perspective,
  type Rgb,
} from "@/lib/webgl";

/**
 * The agent world: the 3D scene behind every page.
 *
 * A grid floor runs to the horizon. Agent nodes hover above it, linked to
 * their neighbours, and pass pulses of light along the links. When a pulse
 * arrives the agent lights up and a ripple spreads on the floor under it.
 * Scrolling moves the camera forward through the scene.
 *
 * Plain WebGL, no library. The scene is a few hundred lines and points,
 * rebuilt on the CPU each frame.
 */

const LINE_VS = `
attribute vec3 aPos;
attribute vec4 aColor;
uniform mat4 uViewProj;
uniform vec4 uFog;
varying vec4 vColor;
void main() {
  gl_Position = uViewProj * vec4(aPos, 1.0);
  float d = gl_Position.w;
  float fog = smoothstep(uFog.x, uFog.y, d) * (1.0 - smoothstep(uFog.z, uFog.w, d));
  vColor = vec4(aColor.rgb, aColor.a * fog);
}`;

const LINE_FS = `
precision mediump float;
varying vec4 vColor;
void main() { gl_FragColor = vColor; }`;

const POINT_VS = `
attribute vec3 aPos;
attribute vec4 aColor;
attribute float aSize;
uniform mat4 uViewProj;
uniform vec4 uFog;
uniform float uPx;
varying vec4 vColor;
void main() {
  gl_Position = uViewProj * vec4(aPos, 1.0);
  float d = gl_Position.w;
  float fog = smoothstep(uFog.x, uFog.y, d) * (1.0 - smoothstep(uFog.z, uFog.w, d));
  gl_PointSize = max(1.0, aSize * uPx / max(d, 0.001));
  vColor = vec4(aColor.rgb, aColor.a * fog);
}`;

const POINT_FS = `
precision mediump float;
varying vec4 vColor;
void main() {
  float r = length(gl_PointCoord * 2.0 - 1.0);
  float core = smoothstep(0.42, 0.0, r);
  float halo = smoothstep(1.0, 0.0, r) * 0.45;
  gl_FragColor = vec4(vColor.rgb, vColor.a * (core + halo));
}`;

/** Length of the stretch of world that repeats as the camera moves forward. */
const LENGTH = 64;
const HALF_WIDTH = 13;
const FLOOR = 0;
const GRID_STEP = 1.25;

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

/** Unit icosahedron: 12 corners, 30 edges. */
function icosahedron() {
  const t = (1 + Math.sqrt(5)) / 2;
  const raw = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  const scale = 1 / Math.hypot(1, t);
  const corners = raw.map((v) => v.map((c) => c * scale));
  const edges: [number, number][] = [];
  for (let i = 0; i < corners.length; i += 1) {
    for (let j = i + 1; j < corners.length; j += 1) {
      const a = corners[i];
      const b = corners[j];
      if (!a || !b) continue;
      const d = Math.hypot((a[0] ?? 0) - (b[0] ?? 0), (a[1] ?? 0) - (b[1] ?? 0), (a[2] ?? 0) - (b[2] ?? 0));
      if (d < 1.1) edges.push([i, j]);
    }
  }
  return { corners, edges };
}

type Agent = {
  x: number;
  y: number;
  z: number;
  radius: number;
  spin: number;
  phase: number;
  hub: boolean;
  ping: number;
};

type Pulse = { link: number; t: number; speed: number; forward: boolean };

function wrapDistance(a: number, b: number) {
  const d = Math.abs(a - b);
  return Math.min(d, LENGTH - d);
}

function buildWorld(count: number, narrow: boolean) {
  const rand = mulberry32(4242);
  const agents: Agent[] = [];
  for (let i = 0; i < count; i += 1) {
    const side = i % 2 === 0 ? -1 : 1;
    const hub = i % 9 === 4;
    agents.push({
      // The middle lane stays empty so the camera never flies through an agent.
      // A portrait phone sees a narrow slice, so there the agents sit closer in.
      x: side * (narrow ? 1.5 + rand() * 4.2 : 3.4 + rand() * (HALF_WIDTH - 4.6)),
      y: FLOOR + (narrow ? 2.0 : 1.1) + rand() * 3.6,
      z: ((i + rand() * 0.8) / count) * LENGTH,
      radius: hub ? 0.7 : 0.34 + rand() * 0.22,
      spin: (rand() - 0.5) * 0.9,
      phase: rand() * Math.PI * 2,
      hub,
      ping: 0,
    });
  }

  const links: [number, number][] = [];
  const seen = new Set<string>();
  agents.forEach((agent, i) => {
    const near = agents
      .map((other, j) => ({
        j,
        d: i === j ? Infinity : Math.hypot(agent.x - other.x, agent.y - other.y, wrapDistance(agent.z, other.z)),
      }))
      .sort((a, b) => a.d - b.d)
      .slice(0, agent.hub ? 4 : 2);
    for (const { j, d } of near) {
      if (d > 16) continue;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      links.push([i, j]);
    }
  });

  const pulses: Pulse[] = [];
  const pulseCount = Math.max(6, Math.round(links.length * 0.4));
  for (let i = 0; i < pulseCount; i += 1) {
    pulses.push({
      link: Math.floor(rand() * links.length),
      t: rand(),
      speed: 0.25 + rand() * 0.35,
      forward: rand() > 0.5,
    });
  }
  return { agents, links, pulses, rand };
}

export function WorldCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.closest<HTMLElement>("[data-world]");
    if (!canvas || !host) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;
    const lineProgram = linkProgram(gl, LINE_VS, LINE_FS);
    const pointProgram = linkProgram(gl, POINT_VS, POINT_FS);
    if (!lineProgram || !pointProgram) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 768;
    const { agents, links, pulses, rand } = buildWorld(small ? 22 : 40, small);
    const shape = icosahedron();

    const lineData = new Float32Array(12000 * 7);
    const pointData = new Float32Array(400 * 8);
    const lineBuffer = gl.createBuffer();
    const pointBuffer = gl.createBuffer();
    // Looked up once. Asking the GPU for these every frame would be wasted work.
    const loc = {
      lineViewProj: gl.getUniformLocation(lineProgram, "uViewProj"),
      lineFog: gl.getUniformLocation(lineProgram, "uFog"),
      linePos: gl.getAttribLocation(lineProgram, "aPos"),
      lineCol: gl.getAttribLocation(lineProgram, "aColor"),
      pointViewProj: gl.getUniformLocation(pointProgram, "uViewProj"),
      pointFog: gl.getUniformLocation(pointProgram, "uFog"),
      pointPx: gl.getUniformLocation(pointProgram, "uPx"),
      pointPos: gl.getAttribLocation(pointProgram, "aPos"),
      pointCol: gl.getAttribLocation(pointProgram, "aColor"),
      pointSize: gl.getAttribLocation(pointProgram, "aSize"),
    };

    let dark = true;
    let colors = {
      grid: [0.49, 0.61, 1] as Rgb,
      agent: [0.93, 0.95, 0.94] as Rgb,
      pulse: [0.96, 0.73, 0.28] as Rgb,
      done: [0.2, 0.84, 0.69] as Rgb,
    };
    const readTheme = () => {
      const style = getComputedStyle(document.documentElement);
      dark = !document.documentElement.classList.contains("light");
      colors = {
        grid: parseColor(style.getPropertyValue("--pulse"), colors.grid),
        agent: parseColor(style.getPropertyValue(dark ? "--text" : "--pulse"), colors.agent),
        pulse: parseColor(style.getPropertyValue("--signal"), colors.pulse),
        done: parseColor(style.getPropertyValue("--pass"), colors.done),
      };
    };
    readTheme();

    let width = 1;
    let height = 1;
    let dpr = 1;
    const resize = () => {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(width * dpr);
      const h = Math.round(height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    };
    resize();

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (event: PointerEvent) => {
      pointer.tx = (event.clientX / width - 0.5) * 2;
      pointer.ty = (event.clientY / height - 0.5) * 2;
      active = performance.now();
    };
    const onScroll = () => {
      active = performance.now();
    };

    let lines = 0;
    let points = 0;
    const line = (
      ax: number, ay: number, az: number,
      bx: number, by: number, bz: number,
      c: Rgb, alpha: number,
    ) => {
      if (lines >= 11998) return;
      let o = lines * 7;
      lineData[o] = ax; lineData[o + 1] = ay; lineData[o + 2] = az;
      lineData[o + 3] = c[0]; lineData[o + 4] = c[1]; lineData[o + 5] = c[2]; lineData[o + 6] = alpha;
      o += 7;
      lineData[o] = bx; lineData[o + 1] = by; lineData[o + 2] = bz;
      lineData[o + 3] = c[0]; lineData[o + 4] = c[1]; lineData[o + 5] = c[2]; lineData[o + 6] = alpha;
      lines += 2;
    };
    const point = (x: number, y: number, z: number, size: number, c: Rgb, alpha: number) => {
      if (points >= 399) return;
      const o = points * 8;
      pointData[o] = x; pointData[o + 1] = y; pointData[o + 2] = z;
      pointData[o + 3] = c[0]; pointData[o + 4] = c[1]; pointData[o + 5] = c[2]; pointData[o + 6] = alpha;
      pointData[o + 7] = size;
      points += 1;
    };
    const ring = (x: number, z: number, radius: number, c: Rgb, alpha: number, steps: number) => {
      for (let s = 0; s < steps; s += 1) {
        const a0 = (s / steps) * Math.PI * 2;
        const a1 = ((s + 1) / steps) * Math.PI * 2;
        line(
          x + Math.cos(a0) * radius, FLOOR + 0.01, z + Math.sin(a0) * radius,
          x + Math.cos(a1) * radius, FLOOR + 0.01, z + Math.sin(a1) * radius,
          c, alpha,
        );
      }
    };

    let travel = 0;
    let drift = 0;
    let time = 0;
    let last = 0;
    let raf = 0;
    let active = 0;
    let stopped = false;
    let live = false;
    const guard = createFrameGuard();
    const position = new Float32Array(agents.length * 3);

    const frame = (dt: number) => {
      time += dt;
      if (!reduce) drift += dt * 0.55;
      const target = (reduce ? 0 : window.scrollY * 0.012) + drift;
      travel += (target - travel) * (reduce ? 1 : 1 - Math.exp(-dt * 5));
      pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 3));
      pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 3));

      lines = 0;
      points = 0;
      const alpha = dark ? 1 : 0.85;
      // On a narrow portrait screen the floor lines bunch up behind the text.
      const gridAlpha = alpha * (small ? 0.65 : 1) * (dark ? 1 : 0.7);

      // Floor grid. Lines along the direction of travel are split up so the
      // distance fade is smooth along their length.
      const columns = Math.floor(HALF_WIDTH / GRID_STEP);
      const segments = 16;
      for (let k = -columns; k <= columns; k += 1) {
        const x = k * GRID_STEP;
        const major = k % 4 === 0;
        const strength = (major ? 0.9 : 0.5) * gridAlpha;
        for (let s = 0; s < segments; s += 1) {
          const z0 = -(s / segments) * LENGTH;
          const z1 = -((s + 1) / segments) * LENGTH;
          line(x, FLOOR, z0, x, FLOOR, z1, colors.grid, strength);
          // Every fourth line is drawn twice, a hair apart, so it reads thicker.
          if (major) line(x + 0.03, FLOOR, z0, x + 0.03, FLOOR, z1, colors.grid, strength);
        }
      }
      const rows = Math.floor(LENGTH / GRID_STEP);
      const edge = columns * GRID_STEP;
      for (let j = 0; j < rows; j += 1) {
        const d = (((j * GRID_STEP - travel) % LENGTH) + LENGTH) % LENGTH;
        const major = j % 4 === 0;
        line(-edge, FLOOR, -d, edge, FLOOR, -d, colors.grid, (major ? 0.9 : 0.5) * gridAlpha);
        if (major) line(-edge, FLOOR, -d - 0.03, edge, FLOOR, -d - 0.03, colors.grid, 0.9 * gridAlpha);
      }

      // Agents.
      agents.forEach((agent, i) => {
        const d = (((agent.z - travel) % LENGTH) + LENGTH) % LENGTH;
        const x = agent.x;
        const y = agent.y + Math.sin(time * 0.7 + agent.phase) * 0.14;
        const z = -d;
        position[i * 3] = x;
        position[i * 3 + 1] = y;
        position[i * 3 + 2] = z;
        agent.ping = Math.max(0, agent.ping - dt * 0.9);

        const angle = time * agent.spin + agent.phase;
        const ca = Math.cos(angle);
        const sa = Math.sin(angle);
        const cb = Math.cos(angle * 0.6);
        const sb = Math.sin(angle * 0.6);
        const radius = agent.radius * (1 + agent.ping * 0.35);
        const color = agent.ping > 0.02 ? colors.done : colors.agent;
        const shell = (0.5 + agent.ping * 0.5) * alpha;
        const corner = (index: number, scale: number) => {
          const v = shape.corners[index] ?? [0, 0, 0];
          const vx = (v[0] ?? 0) * ca + (v[2] ?? 0) * sa;
          const vz = -(v[0] ?? 0) * sa + (v[2] ?? 0) * ca;
          const vy = (v[1] ?? 0) * cb - vz * sb;
          const vz2 = (v[1] ?? 0) * sb + vz * cb;
          return [x + vx * scale, y + vy * scale, z + vz2 * scale] as const;
        };
        for (const [a, b] of shape.edges) {
          const p = corner(a, radius);
          const q = corner(b, radius);
          line(p[0], p[1], p[2], q[0], q[1], q[2], color, shell);
        }
        if (agent.hub) {
          // Hubs get a second, larger shell turning the other way.
          for (const [a, b] of shape.edges) {
            const p = corner(a, -radius * 1.55);
            const q = corner(b, -radius * 1.55);
            line(p[0], p[1], p[2], q[0], q[1], q[2], colors.grid, 0.28 * alpha);
          }
        }
        point(x, y, z, agent.hub ? 0.5 : 0.3, color, (0.75 + agent.ping * 0.25) * alpha);

        // Tether to the floor, a marker under the agent, and the arrival ripple.
        line(x, y - radius, z, x, FLOOR, z, colors.grid, 0.16 * alpha);
        ring(x, z, 0.26, colors.grid, 0.4 * alpha, 10);
        if (agent.ping > 0.02) {
          ring(x, z, 0.4 + (1 - agent.ping) * 2.4, colors.done, agent.ping * 0.7 * alpha, 28);
        }
      });

      // Links, skipping pairs that sit on opposite sides of the repeat seam.
      const linked = (index: number) => {
        const pair = links[index];
        if (!pair) return null;
        const [a, b] = pair;
        const az = position[a * 3 + 2] ?? 0;
        const bz = position[b * 3 + 2] ?? 0;
        if (Math.abs(az - bz) > LENGTH / 2) return null;
        return { a, b };
      };
      for (let i = 0; i < links.length; i += 1) {
        const pair = linked(i);
        if (!pair) continue;
        line(
          position[pair.a * 3] ?? 0, position[pair.a * 3 + 1] ?? 0, position[pair.a * 3 + 2] ?? 0,
          position[pair.b * 3] ?? 0, position[pair.b * 3 + 1] ?? 0, position[pair.b * 3 + 2] ?? 0,
          colors.grid, 0.34 * alpha,
        );
      }

      // Pulses: messages travelling from one agent to the next.
      for (const pulse of pulses) {
        if (!reduce) pulse.t += dt * pulse.speed;
        if (pulse.t >= 1) {
          const pair = links[pulse.link];
          const arrived = pair ? agents[pulse.forward ? pair[1] : pair[0]] : null;
          if (arrived) arrived.ping = 1;
          pulse.link = Math.floor(rand() * links.length);
          pulse.t = 0;
          pulse.speed = 0.25 + rand() * 0.35;
          pulse.forward = rand() > 0.5;
        }
        const pair = linked(pulse.link);
        if (!pair) continue;
        const from = pulse.forward ? pair.a : pair.b;
        const to = pulse.forward ? pair.b : pair.a;
        for (let tail = 0; tail < 4; tail += 1) {
          const t = pulse.t - tail * 0.035;
          if (t < 0) break;
          point(
            (position[from * 3] ?? 0) + ((position[to * 3] ?? 0) - (position[from * 3] ?? 0)) * t,
            (position[from * 3 + 1] ?? 0) + ((position[to * 3 + 1] ?? 0) - (position[from * 3 + 1] ?? 0)) * t,
            (position[from * 3 + 2] ?? 0) + ((position[to * 3 + 2] ?? 0) - (position[from * 3 + 2] ?? 0)) * t,
            0.5 - tail * 0.09,
            colors.pulse,
            (1 - tail * 0.25) * alpha,
          );
        }
      }

      // Camera: just above the floor, looking down the middle lane.
      const fov = (58 * Math.PI) / 180;
      const eye: [number, number, number] = [
        Math.sin(time * 0.09) * 0.5 + pointer.x * 0.7,
        2.7 - pointer.y * 0.25,
        0,
      ];
      const look: [number, number, number] = [pointer.x * 2.2, 0.9 - pointer.y * 0.5, -14];
      const viewProj = multiply(perspective(fov, width / height, 0.1, LENGTH * 1.2), lookAt(eye, look));

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      // Light adds up on the dark theme. On the light theme it is plain ink.
      if (dark) gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      else gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const fogNearStart = 0.4;
      const fogNearEnd = 3.2;
      const fogFarStart = LENGTH * 0.3;
      const fogFarEnd = LENGTH * 0.92;

      gl.useProgram(lineProgram);
      gl.uniformMatrix4fv(loc.lineViewProj, false, viewProj);
      gl.uniform4f(loc.lineFog, fogNearStart, fogNearEnd, fogFarStart, fogFarEnd);
      gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, lineData.subarray(0, lines * 7), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(loc.linePos);
      gl.vertexAttribPointer(loc.linePos, 3, gl.FLOAT, false, 28, 0);
      gl.enableVertexAttribArray(loc.lineCol);
      gl.vertexAttribPointer(loc.lineCol, 4, gl.FLOAT, false, 28, 12);
      gl.drawArrays(gl.LINES, 0, lines);

      gl.useProgram(pointProgram);
      gl.uniformMatrix4fv(loc.pointViewProj, false, viewProj);
      gl.uniform4f(loc.pointFog, fogNearStart, fogNearEnd, fogFarStart, fogFarEnd);
      gl.uniform1f(loc.pointPx, (height * dpr) / (2 * Math.tan(fov / 2)));
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, pointData.subarray(0, points * 8), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(loc.pointPos);
      gl.vertexAttribPointer(loc.pointPos, 3, gl.FLOAT, false, 32, 0);
      gl.enableVertexAttribArray(loc.pointCol);
      gl.vertexAttribPointer(loc.pointCol, 4, gl.FLOAT, false, 32, 12);
      gl.enableVertexAttribArray(loc.pointSize);
      gl.vertexAttribPointer(loc.pointSize, 1, gl.FLOAT, false, 32, 28);
      gl.drawArrays(gl.POINTS, 0, points);
      gl.disableVertexAttribArray(loc.pointSize);

      if (!live) {
        live = true;
        host.dataset.live = "true";
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      // Full frame rate while the visitor scrolls or moves the pointer.
      // Otherwise 30 frames a second is plenty, and always on touch devices.
      const busy = !coarse && now - active < 900;
      if (!busy && last && now - last < 31) return;
      if (guard.tick(now)) {
        stop(true);
        return;
      }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      frame(dt);
    };

    const stop = (forGood: boolean) => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (forGood) {
        stopped = true;
        delete host.dataset.live;
      }
    };
    const sync = () => {
      const shouldRun = !document.hidden && !stopped && !reduce;
      if (shouldRun && !raf) {
        last = 0;
        guard.resume();
        raf = requestAnimationFrame(loop);
      } else if (!shouldRun && raf) {
        stop(false);
      }
    };

    const redraw = () => {
      readTheme();
      if (reduce && !stopped) frame(0);
    };
    const themeWatch = new MutationObserver(redraw);
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onResize = () => {
      resize();
      if (reduce && !stopped) frame(0);
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      stop(true);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!coarse) window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", sync);
    canvas.addEventListener("webglcontextlost", onLost);

    // With reduced motion the world is drawn once and stays still.
    if (reduce) frame(0);
    else sync();

    return () => {
      cancelAnimationFrame(raf);
      themeWatch.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", onLost);
      delete host.dataset.live;
    };
  }, []);

  return <canvas ref={ref} className="world-canvas" aria-hidden="true" />;
}
