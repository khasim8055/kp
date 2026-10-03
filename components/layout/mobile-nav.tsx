"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { NavLinks } from "@/components/layout/nav-links";

export function MobileNav() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center border border-border"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? t("close") : t("menu")}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <X className="h-4 w-4" aria-hidden />
        ) : (
          <Menu className="h-4 w-4" aria-hidden />
        )}
      </button>
      {open ? (
        <nav
          id="mobile-nav"
          aria-label={t("primary")}
          className="absolute inset-x-0 top-full border-b border-border bg-background"
        >
          <NavLinks orientation="col" onNavigate={() => setOpen(false)} />
        </nav>
      ) : null}
    </div>
  );
}
