import { getLocale, getTranslations } from "next-intl/server";
import { ContactNodes } from "@/components/contact/contact-nodes";
import { Link } from "@/i18n/navigation";

// Only the pages the top navigation cannot reach.
const links = [
  { href: "/experience", key: "experience" },
  { href: "/papers", key: "papers" },
  { href: "/now", key: "now" },
] as const;

/**
 * One slim line of links. On pages that do not have the contact section,
 * the footer opens with the LinkedIn and GitHub nodes, so every page ends
 * on them. `globals.css` hides that dock where the section is present.
 */
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
    <footer>
      <div className="footer-dock border-t border-border">
        <div className="mx-auto max-w-[1100px] px-4 py-12 md:py-14">
          <ContactNodes />
        </div>
      </div>
      <div className="footer-line border-t border-border">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label={t("nav")}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {links.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground">
                    {nav(item.key)}
                  </Link>
                </li>
              ))}
              <li>
                <a href="/rss.xml" className="hover:text-foreground">
                  {t("rss")}
                </a>
              </li>
            </ul>
          </nav>
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
            {t("updated", { date: updated })}
          </p>
        </div>
      </div>
    </footer>
  );
}
