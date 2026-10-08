"use client";

import { useEffect, useRef, useState } from "react";

export function Readout({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (typeof value !== "number") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / 600);
          setShown(Math.round(value * progress));
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        setShown(0);
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <div ref={ref}>
      <p className="font-mono text-[28px] leading-none text-signal sm:text-[36px]">{shown}</p>
      <p className="mt-2 break-words font-mono text-[11px] uppercase tracking-[0.16em] text-muted sm:text-[12px] sm:tracking-[0.2em]">
        {label}
      </p>
    </div>
  );
}
