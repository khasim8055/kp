import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/i18n/navigation";
import { currentWork } from "@/data/current-work";

export async function CurrentWork() {
  const t = await getTranslations("CurrentWork");

  return (
    <>
      <SectionHeading
        id="current-work-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <ul className="grid gap-4 sm:grid-cols-2">
        {currentWork.map((item) => (
          <li key={item.title} className="border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium">
                {"href" in item && item.href?.startsWith("/") ? (
                  <Link href={item.href} className="hover:text-accent">
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </h3>
              <span className="shrink-0 border border-border px-2 py-0.5 font-mono text-[11px] text-muted">
                {t(item.status)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {item.detail}
            </p>
            {"href" in item && item.href && !item.href.startsWith("/") ? (
              <a
                href={item.href}
                className="mt-3 inline-block text-sm text-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("site")}
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
