"use client";

import { Menu, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LocaleToggle } from "@/components/layout/locale-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Link, usePathname } from "@/i18n/navigation";
import { homeNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function FloatingNav({ command }: { command: React.ReactNode }) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The hero is watched too, so no link stays lit once the visitor is back at the top.
    const nodes = ["top", ...homeNav.map((item) => item.id)]
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target.id) return;
        setActive(visible.target.id === "top" ? null : visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const button = menuButton.current;
    menuPanel.current?.querySelector<HTMLElement>("a")?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  function isCurrent(id: string) {
    if (pathname === "/") return active === id;
    const item = homeNav.find((entry) => entry.id === id);
    return Boolean(
      item?.routes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
      ),
    );
  }

  function goToSection(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    setOpen(false);
    if (pathname !== "/") return;
    const node = document.getElementById(id);
    if (!node) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-4">
        <div className="pointer-events-auto flex max-w-full items-center gap-1 rounded-full border border-border bg-background/70 px-2 py-1.5 shadow-[0_8px_30px_rgb(0_0_0/0.18)] backdrop-blur-md">
          <Link
            href="/"
            className="font-display rounded-full px-2 text-sm font-bold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal)]"
            aria-label={`KS · ${t("home")}`}
          >
            KS
          </Link>
          <nav aria-label={t("primary")} className="hidden lg:block">
            <ul className="flex items-center">
              {homeNav.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/#${item.id}`}
                    aria-current={isCurrent(item.id) ? "true" : undefined}
                    onClick={(event) => goToSection(event, item.id)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal)]",
                      isCurrent(item.id) ? "text-signal-ink" : "text-muted hover:text-foreground",
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden items-center gap-1 lg:flex">
            <LocaleToggle />
            <ThemeToggle />
            {command}
          </div>
          <button
            ref={menuButton}
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal)] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t("close") : t("menu")}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </header>
      {open ? (
        <div
          ref={menuPanel}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label={t("primary")}
          className="fixed inset-0 z-40 flex flex-col bg-background px-6 pt-24 lg:hidden"
        >
          <ul className="flex flex-col gap-2">
            {homeNav.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/#${item.id}`}
                  aria-current={isCurrent(item.id) ? "true" : undefined}
                  onClick={(event) => goToSection(event, item.id)}
                  className={cn(
                    "font-display block py-2 text-4xl font-bold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--signal)]",
                    isCurrent(item.id) ? "text-signal-ink" : "text-foreground",
                  )}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex items-center gap-2">
            <LocaleToggle />
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal)]"
              aria-label={`${t("command")} ⌘K`}
              onClick={() => {
                setOpen(false);
                window.dispatchEvent(new Event("command-menu:open"));
              }}
            >
              <Search className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
