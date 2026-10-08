"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

export function GlowSpine({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.35"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="relative">
      <div
        className="absolute bottom-3 left-[3px] top-3 w-px bg-border"
        aria-hidden
      />
      <motion.div
        className="journey-glow absolute left-[3px] top-3 w-px origin-top"
        style={{ height: "calc(100% - 1.5rem)", scaleY: reduce ? 1 : scaleY }}
        aria-hidden
      />
      <ol ref={ref} className="space-y-8">
        {children}
      </ol>
    </div>
  );
}
