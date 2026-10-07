"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export function GlowCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseMove={(event) => {
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        node.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
        node.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
      }}
      className={cn(
        "glow-card relative overflow-hidden rounded-[14px] border border-border bg-surface p-5",
        className,
      )}
    >
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
