"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const NeuralField = dynamic(
  () => import("@/components/sections/neural-field").then((mod) => mod.NeuralField),
  { ssr: false },
);

const ParticlePortrait = dynamic(
  () => import("@/components/sections/particle-portrait").then((mod) => mod.ParticlePortrait),
  { ssr: false },
);

function useNearViewport(rootMargin = "200px", deferMs = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || show) return;
    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    let timer = 0;

    const arm = () => {
      if (cancelled) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          setShow(true);
          observer?.disconnect();
        },
        { rootMargin },
      );
      observer.observe(node);
    };

    if (deferMs > 0) timer = window.setTimeout(arm, deferMs);
    else arm();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [deferMs, rootMargin, show]);

  return { ref, show };
}

export function NeuralSlot({
  density = 1,
  defer = false,
}: {
  density?: number;
  defer?: boolean;
}) {
  const { ref, show } = useNearViewport("160px", defer ? 700 : 0);
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {show ? <NeuralField density={density} /> : null}
    </div>
  );
}

export function PortraitSlot() {
  const { ref, show } = useNearViewport("80px", 900);
  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      {show ? <ParticlePortrait /> : null}
    </div>
  );
}
