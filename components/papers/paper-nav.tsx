import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { PaperCardData } from "@/lib/content/papers";

export async function PaperNav({
  prev,
  next,
  related,
}: {
  prev: PaperCardData | null;
  next: PaperCardData | null;
  related: PaperCardData[];
}) {
  const t = await getTranslations("Papers");

  return (
    <div className="mt-12 space-y-8 border-t border-border pt-8">
      <div className="flex flex-wrap justify-between gap-4 text-sm">
        {prev ? (
          <Link href={`/papers/${prev.slug}`} className="text-accent">
            {t("prev")}: {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/papers/${next.slug}`} className="text-accent">
            {t("next")}: {next.title}
          </Link>
        ) : null}
      </div>
      {related.length > 0 ? (
        <section>
          <h2 className="text-sm font-medium">{t("related")}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {related.map((paper) => (
              <li key={paper.slug}>
                <Link href={`/papers/${paper.slug}`} className="text-accent">
                  {paper.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
