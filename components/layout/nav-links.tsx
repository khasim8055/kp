"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function NavLinks({
  orientation = "row",
  onNavigate,
}: {
  orientation?: "row" | "col";
  onNavigate?: () => void;
}) {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  return (
    <ul
      className={
        orientation === "row" ? "flex items-center gap-5" : "flex flex-col py-2"
      }
    >
      {navItems.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={cn(
                "block text-sm transition-colors duration-200",
                orientation === "col" && "px-4 py-2",
                active ? "text-foreground" : "text-muted hover:text-foreground",
              )}
            >
              {t(item.key)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
