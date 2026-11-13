import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Link } from "@/i18n/navigation";
import { getPapers, isTodo } from "@/lib/content/papers";

/** Newest paper breakdowns as plain rows. Published when ready, no schedule. */
export async function PaperList({
  limit,
  heading = "h4",
}: {
  limit?: number;
  heading?: "h3" | "h4";
}) {
  const t = await getTranslations("Papers");
  const papers = getPapers().filter((paper) => !isTodo(paper.date));
  const shown = typeof limit === "number" ? papers.slice(0, limit) : papers;
  const Heading = heading;

  if (shown.length === 0) {
    return <p className="text-sm text-muted">{t("none")}</p>;
  }

  return (
    <ul className="grid gap-4">
      {shown.map((paper, i) => (
        <li key={paper.slug} data-reveal style={{ "--i": i % 3 } as React.CSSProperties}>
          <Card>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[12px] text-muted">
              <time dateTime={paper.date}>{paper.date}</time>
              <span>{paper.venue}</span>
              {isTodo(paper.verdict) ? null : <Tag>{paper.verdict}</Tag>}
            </div>
            <Heading className="mt-2 font-serif text-[24px] italic leading-snug text-balance md:text-[28px]">
              <Link href={`/papers/${paper.slug}`} className="hover:text-signal-ink">
                {paper.title}
              </Link>
            </Heading>
            {isTodo(paper.tldr) ? null : (
              <p className="mt-2 max-w-[720px] text-sm leading-relaxed text-muted">
                {paper.tldr}
              </p>
            )}
          </Card>
        </li>
      ))}
    </ul>
  );
}
