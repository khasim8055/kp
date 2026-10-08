"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function GlowCard({
  children,
  className,
  tilt = false,
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const tiltOn = useRef(false);

  useEffect(() => {
    if (!tilt) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    tiltOn.current = fine && !reduce;
  }, [tilt]);

  return (
    <div
      ref={ref}
      onMouseMove={(event) => {
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        node.style.setProperty("--glow-x", `${x}px`);
        node.style.setProperty("--glow-y", `${y}px`);
        if (!tiltOn.current) return;
        const rx = ((y / rect.height) - 0.5) * -8;
        const ry = ((x / rect.width) - 0.5) * 8;
        node.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }}
      onMouseLeave={() => {
        const node = ref.current;
        if (!node) return;
        if (tiltOn.current) node.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      }}
      className={cn(
        "glow-card relative overflow-hidden rounded-[14px] border border-border bg-surface p-5",
        tilt && "transition-transform duration-150 will-change-transform",
        className,
      )}
    >
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
