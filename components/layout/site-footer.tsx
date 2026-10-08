import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { profile } from "@/data/profile";

const siteLinks = [
  { href: "/", key: "home" },
  { href: "/research", key: "research" },
  { href: "/projects", key: "projects" },
  { href: "/experience", key: "experience" },
  { href: "/contact", key: "contact" },
] as const;

const labLinks = [
  { href: "/papers", key: "papers" },
  { href: "/learning", key: "learning" },
  { href: "/now", key: "now" },
] as const;

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
      <div className="mx-auto max-w-[1100px] px-4 py-12 md:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <Link
            href="/"
            className="font-display self-start text-2xl font-bold tracking-tight"
            aria-label={nav("home")}
          >
            KS
          </Link>
          <nav aria-label={t("nav")} className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 md:max-w-[640px]">
            <FooterColumn title={t("site")}>
              {siteLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground">
                    {nav(item.key)}
                  </Link>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title={t("lab")}>
              {labLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground">
                    {nav(item.key)}
                  </Link>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title={t("elsewhere")}>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  {t("linkedin")}
                </a>
              </li>
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  {t("github")}
                </a>
              </li>
            </FooterColumn>
          </nav>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-6 font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
          <p>{t("updated", { date: updated })}</p>
          <a href="/rss.xml" className="hover:text-foreground">
            {t("rss")}
          </a>
          <p>{t("built")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal-ink">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-muted">{children}</ul>
    </div>
  );
}
