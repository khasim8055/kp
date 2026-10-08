"use client";

import { useEffect, useRef, useState } from "react";
import type { SkillLevel } from "@/data/skills";
import { cn } from "@/lib/utils";

const fillCount: Record<SkillLevel, number> = {
  production: 3,
  project: 2,
  studying: 1,
  TODO: 0,
};

const fillClass: Record<SkillLevel, string> = {
  production: "bg-pass",
  project: "bg-signal",
  studying: "bg-pulse",
  TODO: "bg-border",
};

export function SkillLevelBar({ level }: { level: SkillLevel }) {
  const ref = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(false);
  const count = fillCount[level];

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setFilled(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        setFilled(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex w-24 shrink-0 gap-1"
      role="img"
      aria-label={`${count} of 3`}
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className={cn(
            "h-1.5 flex-1 rounded-[2px] bg-border transition-[transform,opacity] duration-500",
            filled && index < count ? fillClass[level] : "opacity-40",
            filled && index < count ? "scale-x-100" : "origin-left scale-x-50",
          )}
          style={{ transitionDelay: filled ? `${index * 90}ms` : "0ms" }}
        />
      ))}
    </div>
  );
}
