"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Site-wide motion, mounted once.
 *
 * Tilt: any element with `data-tilt` leans toward the pointer in 3D and gets a
 * glow under the cursor. One listener on the document serves every card.
 *
 * Reveal: any element with `data-reveal` rises into place in 3D the first time
 * it scrolls into view. Without JavaScript, or with reduced motion, everything
 * is simply visible.
 */
export function Effects() {
  const pathname = usePathname();

  // 3D tilt.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let current: HTMLElement | null = null;
    let frame = 0;
    let x = 0;
    let y = 0;

    const release = (node: HTMLElement) => {
      node.style.removeProperty("--rx");
      node.style.removeProperty("--ry");
      delete node.dataset.tilting;
    };
    const apply = () => {
      frame = 0;
      if (!current) return;
      const rect = current.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (x - rect.left) / rect.width));
      const py = Math.min(1, Math.max(0, (y - rect.top) / rect.height));
      // Large panels lean less than small cards, so the edges never swing far.
      const max = Math.max(2.5, Math.min(7, 2200 / Math.max(rect.width, rect.height)));
      current.style.setProperty("--rx", `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
      current.style.setProperty("--ry", `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
      current.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      current.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      current.dataset.tilting = "true";
    };
    const onMove = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-tilt]") : null;
      if (target !== current) {
        if (current) release(current);
        current = target;
      }
      if (!current) return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (current) release(current);
      current = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onLeave);
      if (current) release(current);
    };
  }, []);

  // 3D reveal on scroll. Runs again after each page change.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)")];
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("in"));
      return;
    }
    document.documentElement.classList.add("fx");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    nodes.forEach((node) => observer.observe(node));
    // Safety net: nothing may stay hidden if the observer never fires.
    const timer = window.setTimeout(() => {
      if (document.hidden) return;
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) node.classList.add("in");
      });
    }, 2500);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
