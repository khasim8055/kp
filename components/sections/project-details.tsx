"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ProjectDetails({ bullets }: { bullets: string[] }) {
  const t = useTranslations("Projects");
  const [open, setOpen] = useState(false);

  if (!bullets.length) return null;

  return (
    <div className="mt-4">
      <button
        type="button"
        className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--signal)]"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? t("hideDetails") : t("details")}
      </button>
      {open ? (
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" aria-hidden />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
