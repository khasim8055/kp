"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const WorldCanvas = dynamic(
  () => import("@/components/world/world-canvas").then((mod) => mod.WorldCanvas),
  { ssr: false },
);

/** Starts the WebGL world once the page has loaded and the browser is idle. */
export function WorldLive() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    let cancelled = false;
    let idle = 0;
    let timer = 0;
    const win = window as Window & {
      requestIdleCallback?: Window["requestIdleCallback"];
      cancelIdleCallback?: Window["cancelIdleCallback"];
    };
    const start = () => {
      if (!cancelled) setShow(true);
    };
    const whenIdle = () => {
      if (cancelled) return;
      if (typeof win.requestIdleCallback === "function") {
        idle = win.requestIdleCallback(start, { timeout: 1200 });
      } else {
        timer = window.setTimeout(start, 300);
      }
    };
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", whenIdle);
      if (idle) win.cancelIdleCallback?.(idle);
      window.clearTimeout(timer);
    };
  }, [show]);

  return show ? <WorldCanvas /> : null;
}
