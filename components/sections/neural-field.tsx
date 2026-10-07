"use client";

import { useEffect, useRef } from "react";
import { fitCanvas, parseCssColor, type Rgb } from "@/components/sections/canvas-color";

type Node = { x: number; y: number; ox: number; oy: number; phase: number };

function makeNodes(width: number, height: number, count: number): Node[] {
  return Array.from({ length: count }, () => {
    const x = Math.random() * width;
    const y = Math.random() * height;
    return { x, y, ox: x, oy: y, phase: Math.random() * Math.PI * 2 };
  });
}

export function NeuralField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    let nodes: Node[] = [];
    let builtWidth = 0;
    let frame = 0;
    let last = 0;
    let visible = true;
    let elapsed = 0;
    let wait = 2200;
    let path: number[] = [];
    let progress = 0;
    const mouse = { x: -9999, y: -9999, on: false };

    const colors = () => {
      const style = getComputedStyle(canvas);
      return {
        pulse: parseCssColor(style.getPropertyValue("--pulse")),
        signal: parseCssColor(style.getPropertyValue("--signal")),
      };
    };

    const ensure = (width: number, height: number) => {
      const count = width < 768 ? 30 : 70;
      if (!nodes.length || nodes.length !== count || Math.abs(width - builtWidth) > 80) {
        nodes = makeNodes(width, height, count);
        builtWidth = width;
        path = [];
      }
    };

    const reachFor = (width: number) => Math.min(168, Math.max(96, width * 0.12));

    const draw = (width: number, height: number, moving: boolean, dt: number) => {
      ensure(width, height);
      const reach = reachFor(width);
      const { pulse, signal } = colors();
      if (moving) {
        for (const node of nodes) {
          node.ox += Math.cos(performance.now() * 0.00018 + node.phase) * 0.18;
          node.oy += Math.sin(performance.now() * 0.00015 + node.phase) * 0.18;
          if (node.ox < 0) node.ox += width;
          if (node.ox > width) node.ox -= width;
          if (node.oy < 0) node.oy += height;
          if (node.oy > height) node.oy -= height;
          let tx = node.ox;
          let ty = node.oy;
          if (mouse.on) {
            const dx = node.x - mouse.x;
            const dy = node.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 120 && dist > 0.01) {
              const push = ((120 - dist) / 120) * 36;
              tx += (dx / dist) * push;
              ty += (dy / dist) * push;
            }
          }
          node.x += (tx - node.x) * 0.08;
          node.y += (ty - node.y) * 0.08;
        }
        if (!path.length) {
          elapsed += dt;
          if (elapsed > wait) {
            path = walk(nodes, reach);
            progress = 0;
            elapsed = 0;
            wait = 2000 + Math.random() * 1000;
          }
        } else {
          progress += dt / 1400;
          if (progress >= path.length - 1) path = [];
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(pulse, 0.16);
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          if (!a || !b) continue;
          if (Math.hypot(a.x - b.x, a.y - b.y) > reach) continue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = rgba(pulse, 0.55);
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (moving && path.length > 1) {
        const index = Math.min(path.length - 2, Math.floor(progress));
        const from = nodes[path[index] ?? 0];
        const to = nodes[path[index + 1] ?? 0];
        if (from && to) {
          const t = progress - index;
          const x = from.x + (to.x - from.x) * t;
          const y = from.y + (to.y - from.y) * t;
          ctx.fillStyle = `rgb(${signal[0]}, ${signal[1]}, ${signal[2]})`;
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.arc(x, y, 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    };

    const paint = (moving: boolean, dt = 16) => {
      const { width, height } = fitCanvas(canvas, ctx);
      if (width < 2 || height < 2) return;
      draw(width, height, moving, dt);
    };

    const ro = new ResizeObserver(() => paint(false));
    ro.observe(canvas);
    paint(false);
    if (reduce) return () => ro.disconnect();

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      mouse.on = inside;
      mouse.x = x;
      mouse.y = y;
    };
    if (fine) window.addEventListener("mousemove", onMove);

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    io.observe(canvas);

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      if (now - last < 16) return;
      const dt = last ? Math.min(34, now - last) : 16;
      last = now;
      paint(true, dt);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      if (fine) window.removeEventListener("mousemove", onMove);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
  );
}

function walk(nodes: Node[], reach: number) {
  if (!nodes.length) return [];
  const hops = [Math.floor(Math.random() * nodes.length)];
  for (let step = 0; step < 5; step += 1) {
    const current = nodes[hops[hops.length - 1] ?? 0];
    if (!current) break;
    const neighbors: number[] = [];
    for (let i = 0; i < nodes.length; i += 1) {
      if (hops.includes(i)) continue;
      const node = nodes[i];
      if (!node) continue;
      if (Math.hypot(node.x - current.x, node.y - current.y) < reach) neighbors.push(i);
    }
    if (!neighbors.length) break;
    hops.push(neighbors[Math.floor(Math.random() * neighbors.length)] ?? hops[0] ?? 0);
  }
  return hops.length > 1 ? hops : [];
}

function rgba(color: Rgb, alpha: number) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}
