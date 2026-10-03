"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/nav";

export function CommandButton() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      dialogRef.current?.querySelector("a")?.focus();
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-9 items-center border border-border px-2 font-mono text-[11px]"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t("command")}
        onClick={() => setOpen(true)}
      >
        ⌘K
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[18vh]"
          onClick={() => setOpen(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-md border border-border bg-background p-2"
            onClick={(event) => event.stopPropagation()}
          >
            <p id={titleId} className="px-2 py-2 font-mono text-xs text-muted">
              {t("commandTitle")}
            </p>
            <ul>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-2 py-2 text-sm hover:bg-border/60"
                    onClick={() => setOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
