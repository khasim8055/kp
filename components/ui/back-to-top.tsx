"use client";

import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function BackToTop() {
  const t = useTranslations("Nav");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label={t("backToTop")}
      className={
        visible
          ? "fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground"
          : "pointer-events-none fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground opacity-0"
      }
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      <ArrowUp className="h-4 w-4" aria-hidden />
    </button>
  );
}
