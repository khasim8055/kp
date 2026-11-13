"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type SphereWord = {
  label: string;
  level: "production" | "project" | "studying" | null;
};

const levelClass: Record<NonNullable<SphereWord["level"]>, string> = {
  production: "text-pass-ink",
  project: "text-signal-ink",
  studying: "text-pulse-ink",
};

/**
 * Every skill as a word on a slowly turning 3D sphere. Words at the front are
 * large and bright, words at the back small and faint. It follows the pointer.
 * Decoration only: the same skills are listed as text next to it.
 */
export function SkillSphere({ words }: { words: SphereWord[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = [...root.querySelectorAll<HTMLElement>("[data-word]")];
    const count = items.length;
    if (!count) return;

    // Evenly spread points on a sphere.
    const points = items.map((_, i) => {
      const y = 1 - (2 * (i + 0.5)) / count;
      const ring = Math.sqrt(1 - y * y);
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      return [Math.cos(angle) * ring, y, Math.sin(angle) * ring] as const;
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let yaw = 0.4;
    let pitch = -0.25;
    let spinYaw = 0.22;
    let spinPitch = 0.05;
    let raf = 0;
    let last = 0;
    let visible = false;

    const place = () => {
      const size = root.clientWidth;
      const radius = size * 0.36;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      items.forEach((item, i) => {
        const point = points[i];
        if (!point) return;
        const x1 = point[0] * cy + point[2] * sy;
        const z1 = -point[0] * sy + point[2] * cy;
        const y1 = point[1] * cp - z1 * sp;
        const z2 = point[1] * sp + z1 * cp;
        const depth = (z2 + 1) / 2;
        const scale = 0.6 + depth * 0.7;
        item.style.transform = `translate(-50%, -50%) translate3d(${(x1 * radius).toFixed(1)}px, ${(y1 * radius).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        // Words on the far side fade almost out, so the front stays readable.
        item.style.opacity = (0.06 + depth * depth * 0.94).toFixed(2);
        item.style.zIndex = String(Math.round(depth * 100));
      });
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (last && now - last < 31) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      yaw += spinYaw * dt;
      pitch += spinPitch * dt;
      place();
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

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      spinYaw = px * 1.6;
      spinPitch = py * 1.1;
    };
    const onLeave = () => {
      spinYaw = 0.22;
      spinPitch = 0.05;
    };

    place();
    root.dataset.ready = "true";
    const view = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      sync();
    });
    view.observe(root);
    const size = new ResizeObserver(place);
    size.observe(root);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", sync);

    return () => {
      cancelAnimationFrame(raf);
      view.disconnect();
      size.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div ref={ref} className="skill-sphere" aria-hidden="true">
      <span className="skill-sphere-core" />
      <span className="skill-sphere-rings">
        <span className="skill-ring" />
        <span className="skill-ring" />
        <span className="skill-ring" />
      </span>
      {words.map((word) => (
        <span
          key={word.label}
          data-word
          className={cn("skill-word", word.level ? levelClass[word.level] : "text-foreground")}
        >
          {word.label}
        </span>
      ))}
    </div>
  );
}
