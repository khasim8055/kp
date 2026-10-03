import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/nav";
import { profile } from "@/data/profile";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const locale = await getLocale();
  const updated = new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-6 px-4 py-10">
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-foreground">
                {nav(item.key)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted">
          <p>{t("updated", { date: updated })}</p>
          <a href="/rss.xml" className="hover:text-foreground">
            {t("rss")}
          </a>
          <p>{t("built")}</p>
          <p>{profile.name}</p>
        </div>
      </div>
    </footer>
  );
}
