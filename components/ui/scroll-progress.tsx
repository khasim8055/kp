"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function ScrollProgress() {
  const t = useTranslations("Nav");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const next = height > 0 ? Math.round((window.scrollY / height) * 100) : 0;
      setProgress(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-0.5"
      role="progressbar"
      aria-label={t("scrollProgress")}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div className="h-full bg-signal" style={{ width: `${progress}%` }} />
    </div>
  );
}
