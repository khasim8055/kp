"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { AuditLabels } from "@/components/figure/audit-canvas";

const AuditCanvas = dynamic(
  () =>
    import("@/components/figure/audit-canvas").then((mod) => mod.AuditCanvas),
  { ssr: false },
);

/**
 * Loads the WebGL layer only when it can be used: after the page is idle,
 * when the figure is near the viewport, and never for reduced motion.
 * Until then (and if anything fails) the static SVG stays in place.
 */
export function AuditLive({
  labels,
  priority = false,
}: {
  labels: AuditLabels;
  priority?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || show) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    let idle = 0;
    let timer = 0;

    const arm = () => {
      if (cancelled) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          observer?.disconnect();
          setShow(true);
        },
        { rootMargin: "200px" },
      );
      // The span itself has no box (display: contents), so watch the stage.
      observer.observe(node.closest("[data-audit]") ?? node);
    };

    // Start only after the page has finished loading and the main thread is
    // idle, so the 3D layer never competes with first paint or hydration.
    // Safari only gained requestIdleCallback recently, so keep a timer fallback.
    const win = window as Window & {
      requestIdleCallback?: Window["requestIdleCallback"];
      cancelIdleCallback?: Window["cancelIdleCallback"];
    };
    const whenIdle = () => {
      if (cancelled) return;
      if (typeof win.requestIdleCallback === "function") {
        idle = win.requestIdleCallback(arm, { timeout: priority ? 1500 : 3000 });
      } else {
        timer = window.setTimeout(arm, priority ? 300 : 1000);
      }
    };
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", whenIdle);
      if (idle) win.cancelIdleCallback?.(idle);
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [priority, show]);

  return (
    <span ref={ref} className="audit-live">
      {show ? <AuditCanvas labels={labels} /> : null}
    </span>
  );
}
