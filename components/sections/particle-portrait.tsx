"use client";

import { useEffect, useRef } from "react";
import { fitCanvas, mixColor, parseCssColor } from "@/components/sections/canvas-color";

type Dot = {
  tx: number;
  ty: number;
  sx: number;
  sy: number;
  x: number;
  y: number;
  size: number;
  alpha: number;
  tint: number;
};

export function ParticlePortrait() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    const fine = window.matchMedia("(pointer: fine)").matches;
    let dots: Dot[] = [];
    let started = 0;
    let assembled = false;
    let frame = 0;
    let last = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999, on: false };
    const image = new Image();

    const sample = () => {
      const { width, height } = fitCanvas(canvas, ctx);
      if (!image.complete || width < 2 || !image.naturalWidth) return;
      const target = width < 280 ? 1200 : 2500;
      const cols = Math.round(Math.sqrt(target * 1.8 * (width / height)));
      const rows = Math.max(1, Math.round((target * 1.8) / cols));
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const offCtx = off.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;
      offCtx.drawImage(image, 0, 0, cols, rows);
      const pixels = offCtx.getImageData(0, 0, cols, rows).data;
      const next: Dot[] = [];
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const index = (y * cols + x) * 4;
          const brightness =
            ((pixels[index] ?? 0) + (pixels[index + 1] ?? 0) + (pixels[index + 2] ?? 0)) / (3 * 255);
          if (brightness > 0.8) continue;
          const depth = 1 - brightness;
          next.push({
            tx: ((x + 0.5) / cols) * width,
            ty: ((y + 0.5) / rows) * height,
            sx: Math.random() * width,
            sy: Math.random() * height,
            x: Math.random() * width,
            y: Math.random() * height,
            size: 0.55 + depth * 2.15,
            alpha: 0.28 + depth * 0.72,
            tint: brightness,
          });
        }
      }
      dots = next.length > target ? next.filter((_, i) => i % Math.ceil(next.length / target) === 0) : next;
      parent?.classList.add("portrait-live");
      if (!started) started = performance.now();
    };

    image.onload = sample;
    image.src = "/profile.jpg";

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouse.on = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      mouse.x = x;
      mouse.y = y;
    };
    if (fine) canvas.addEventListener("mousemove", onMove);
    const onLeave = () => {
      mouse.on = false;
    };
    canvas.addEventListener("mouseleave", onLeave);

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => sample());
    ro.observe(canvas);

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || document.hidden || !dots.length) return;
      if (now - last < 16) return;
      last = now;
      const { width, height } = fitCanvas(canvas, ctx);
      const style = getComputedStyle(canvas);
      const text = parseCssColor(style.getPropertyValue("--text"));
      const signal = parseCssColor(style.getPropertyValue("--signal"));
      const u = Math.min(1, (now - started) / 1600);
      const eased = 1 - (1 - u) ** 3;
      assembled = u >= 1;
      ctx.clearRect(0, 0, width, height);
      for (const dot of dots) {
        const flownX = dot.sx + (dot.tx - dot.sx) * eased;
        const flownY = dot.sy + (dot.ty - dot.sy) * eased;
        let x = flownX;
        let y = flownY;
        if (!assembled) {
          dot.x = flownX;
          dot.y = flownY;
        } else {
          let ox = 0;
          let oy = 0;
          if (mouse.on) {
            const dx = dot.tx - mouse.x;
            const dy = dot.ty - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 56 && dist > 0.01) {
              const force = (56 - dist) / 56;
              ox = (dx / dist) * force * 14;
              oy = (dy / dist) * force * 14;
            }
          }
          dot.x += (dot.tx + ox - dot.x) * 0.18;
          dot.y += (dot.ty + oy - dot.y) * 0.18;
          x = dot.x;
          y = dot.y;
        }
        ctx.globalAlpha = dot.alpha;
        ctx.fillStyle = mixColor(text, signal, 0.2 + dot.tint * 0.65);
        ctx.beginPath();
        ctx.arc(x, y, dot.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      parent?.classList.remove("portrait-live");
      if (fine) canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-auto absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
