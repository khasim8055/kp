"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const NeuralField = dynamic(
  () =>
    import("@/components/sections/neural-field").then((mod) => mod.NeuralField),
  { ssr: false },
);

export function LazyNeuralField({
  density = 0.45,
  still = true,
  deferMs = 200,
}: {
  density?: number;
  still?: boolean;
  deferMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || show) return;
    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          setShow(true);
          observer?.disconnect();
        },
        { rootMargin: "120px" },
      );
      observer.observe(node);
    }, deferMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [deferMs, show]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      {show ? <NeuralField density={density} still={still} /> : null}
    </div>
  );
}
