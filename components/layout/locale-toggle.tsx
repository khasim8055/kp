"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LocaleToggle() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      className="flex items-center border border-border font-mono text-[11px]"
      role="group"
      aria-label={t("language")}
    >
      {routing.locales.map((item) => (
        <LocaleLink
          key={item}
          locale={item}
          pathname={pathname}
          current={locale === item}
        />
      ))}
    </div>
  );
}

function LocaleLink({
  locale,
  pathname,
  current,
}: {
  locale: Locale;
  pathname: string;
  current: boolean;
}) {
  return (
    <Link
      href={pathname}
      locale={locale}
      hrefLang={locale}
      aria-current={current ? "true" : undefined}
      className={cn(
        "px-2 py-1.5 uppercase",
        current
          ? "bg-accent text-accent-foreground"
          : "text-muted hover:text-foreground",
      )}
    >
      {locale}
    </Link>
  );
}
