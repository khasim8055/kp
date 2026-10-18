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
  if (!prev && !next && related.length === 0) return null;

  return (
    <div className="mt-12 space-y-8 border-t border-border pt-8">
      {prev || next ? (
        <div className="flex flex-wrap justify-between gap-4 text-sm">
          {prev ? (
            <Link href={`/papers/${prev.slug}`} className="text-signal-ink">
              {t("prev")}: {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/papers/${next.slug}`} className="text-signal-ink">
              {t("next")}: {next.title}
            </Link>
          ) : null}
        </div>
      ) : null}
      {related.length > 0 ? (
        <section>
          <h2 className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink">
            {t("related")}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {related.map((paper) => (
              <li key={paper.slug}>
                <Link
                  href={`/papers/${paper.slug}`}
                  className="text-signal-ink"
                >
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
