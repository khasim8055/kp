"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";

export function ReadingProgress({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Papers");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [now, setNow] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setNow(Math.round(value * 100));
  });

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-background"
        role="progressbar"
        aria-label={t("readingProgress")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={now}
      >
        <motion.div
          className="journey-glow h-full origin-left"
          style={{ scaleX }}
        />
      </div>
      <div ref={ref}>{children}</div>
    </>
  );
}
