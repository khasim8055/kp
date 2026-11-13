"use client";

import { useEffect, useRef } from "react";
import { parseColor, type Rgb } from "@/lib/webgl";

type Vec = [number, number, number];

// A unit icosahedron: the same cage the agents in the background wear.
const PHI = (1 + Math.sqrt(5)) / 2;
const RAW: Vec[] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
];
const LENGTH = Math.hypot(1, PHI);
const VERTS: Vec[] = RAW.map(([x, y, z]) => [x / LENGTH, y / LENGTH, z / LENGTH]);
const EDGES: [number, number][] = [];
for (let a = 0; a < RAW.length; a += 1) {
  for (let b = a + 1; b < RAW.length; b += 1) {
    const [ax, ay, az] = RAW[a] as Vec;
    const [bx, by, bz] = RAW[b] as Vec;
    if (Math.abs(Math.hypot(ax - bx, ay - by, az - bz) - 2) < 0.01) EDGES.push([a, b]);
  }
}

const rgba = (c: Rgb, alpha: number) =>
  `rgba(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)}, ${alpha.toFixed(3)})`;

/**
 * The turning wire cage around a contact node, with one pulse of light
 * running along its edges. It spins faster while its link is hovered or
 * focused. Decoration only: the link works without it.
 */
export function NodeCage() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const link = canvas?.closest("a");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let line: Rgb = [0.6, 0.7, 1];
    let pulse: Rgb = [0.96, 0.73, 0.28];
    const readTheme = () => {
      line = parseColor(getComputedStyle(canvas).color, line);
      pulse = parseColor(getComputedStyle(document.documentElement).getPropertyValue("--signal"), pulse);
    };

    let size = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      size = Math.round(canvas.clientWidth * dpr);
      canvas.width = size;
      canvas.height = size;
    };

    let yaw = Math.random() * Math.PI * 2;
    let speed = 0.35;
    let target = 0.35;
    let time = 0;
    let edge = 0;
    let from = 0;
    let along = 0;
    const flat = new Float32Array(VERTS.length * 3);

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const pitch = 0.42 + Math.sin(time * 0.4) * 0.12;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const half = size / 2;
      const radius = size * 0.34;
      VERTS.forEach(([x, y, z], i) => {
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y1 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const scale = 4 / (4 - z2);
        flat[i * 3] = half + x1 * radius * scale;
        flat[i * 3 + 1] = half - y1 * radius * scale;
        flat[i * 3 + 2] = (z2 + 1) / 2;
      });

      ctx.lineWidth = 1.1 * dpr;
      ctx.lineCap = "round";
      for (const [a, b] of EDGES) {
        const depth = ((flat[a * 3 + 2] ?? 0) + (flat[b * 3 + 2] ?? 0)) / 2;
        ctx.strokeStyle = rgba(line, 0.14 + depth * 0.62);
        ctx.beginPath();
        ctx.moveTo(flat[a * 3] ?? 0, flat[a * 3 + 1] ?? 0);
        ctx.lineTo(flat[b * 3] ?? 0, flat[b * 3 + 1] ?? 0);
        ctx.stroke();
      }
      for (let i = 0; i < VERTS.length; i += 1) {
        const depth = flat[i * 3 + 2] ?? 0;
        ctx.fillStyle = rgba(line, 0.25 + depth * 0.7);
        ctx.beginPath();
        ctx.arc(flat[i * 3] ?? 0, flat[i * 3 + 1] ?? 0, (1 + depth * 1.3) * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      // The pulse, with a short tail behind it.
      const pair = EDGES[edge];
      if (pair) {
        const start = from === pair[0] ? pair[0] : pair[1];
        const end = from === pair[0] ? pair[1] : pair[0];
        for (let tail = 3; tail >= 0; tail -= 1) {
          const t = Math.max(0, along - tail * 0.09);
          const x = (flat[start * 3] ?? 0) + ((flat[end * 3] ?? 0) - (flat[start * 3] ?? 0)) * t;
          const y = (flat[start * 3 + 1] ?? 0) + ((flat[end * 3 + 1] ?? 0) - (flat[start * 3 + 1] ?? 0)) * t;
          ctx.shadowColor = rgba(pulse, 0.9);
          ctx.shadowBlur = tail === 0 ? 10 * dpr : 0;
          ctx.fillStyle = rgba(pulse, tail === 0 ? 1 : 0.5 - tail * 0.13);
          ctx.beginPath();
          ctx.arc(x, y, (tail === 0 ? 2.6 : 1.8) * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
    };

    const step = (dt: number) => {
      time += dt;
      speed += (target - speed) * (1 - Math.exp(-dt * 4));
      yaw += speed * dt;
      along += dt * (0.9 + speed * 0.9);
      if (along >= 1) {
        along = 0;
        const pair = EDGES[edge];
        const arrived = pair ? (from === pair[0] ? pair[1] : pair[0]) : 0;
        const next = EDGES.map((item, i) => ({ item, i })).filter(
          ({ item, i }) => i !== edge && (item[0] === arrived || item[1] === arrived),
        );
        const pick = next[Math.floor(Math.random() * next.length)];
        if (pick) edge = pick.i;
        from = arrived;
      }
    };

    let raf = 0;
    let last = 0;
    let visible = false;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (last && now - last < 31) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      step(dt);
      draw();
    };
    const sync = () => {
      const run = visible && !document.hidden && !reduce;
      if (run && !raf) {
        last = 0;
        raf = requestAnimationFrame(loop);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const faster = () => {
      target = 1.7;
    };
    const slower = () => {
      target = 0.35;
    };
    const redraw = () => {
      readTheme();
      if (!raf && size) draw();
    };

    readTheme();
    resize();
    from = EDGES[0]?.[0] ?? 0;
    draw();
    canvas.dataset.ready = "true";

    const view = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      sync();
    });
    view.observe(canvas);
    const box = new ResizeObserver(() => {
      resize();
      if (!raf && size) draw();
    });
    box.observe(canvas);
    const theme = new MutationObserver(redraw);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    document.addEventListener("visibilitychange", sync);
    link?.addEventListener("pointerenter", faster);
    link?.addEventListener("pointerleave", slower);
    link?.addEventListener("focus", faster);
    link?.addEventListener("blur", slower);

    return () => {
      cancelAnimationFrame(raf);
      view.disconnect();
      box.disconnect();
      theme.disconnect();
      document.removeEventListener("visibilitychange", sync);
      link?.removeEventListener("pointerenter", faster);
      link?.removeEventListener("pointerleave", slower);
      link?.removeEventListener("focus", faster);
      link?.removeEventListener("blur", slower);
    };
  }, []);

  return <canvas ref={ref} className="node-cage" aria-hidden="true" />;
}
