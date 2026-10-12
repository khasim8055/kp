import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { paperMdxComponents, questionBlock } from "@/components/mdx/paper-body";
import {
  stripUnfinishedMdx,
  stripUnfinishedSource,
} from "@/lib/unfinished-mdx";
import { DifficultyDots } from "@/components/papers/difficulty-dots";
import { PaperNav } from "@/components/papers/paper-nav";
import { ReadingProgress } from "@/components/papers/reading-progress";
import { ScoreBars } from "@/components/papers/score-bars";
import { Tag } from "@/components/ui/tag";
import { PageHero } from "@/components/ui/page-hero";
import { Link } from "@/i18n/navigation";
import {
  getPaper,
  getPapers,
  isTodo,
  isUrl,
  paperNeighbors,
  relatedPapers,
  toCardData,
} from "@/lib/content/papers";
import { resolveLocale } from "@/lib/locale";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPapers().map((paper) => ({ slug: paper.slug }));
}

export async function generateMetadata({ params }: Props) {
  await resolveLocale(params);
  const { slug } = await params;
  const paper = getPaper(slug);
  return { title: paper?.title ?? "Paper" };
}

export default async function PaperPage({ params }: Props) {
  await resolveLocale(params);
  const { slug } = await params;
  const paper = getPaper(slug);
  if (!paper) notFound();

  const t = await getTranslations("Papers");
  const papers = getPapers().map(toCardData);
  const card = toCardData(paper);
  const { prev, next } = paperNeighbors(papers, paper.slug);
  const related = relatedPapers(papers, card);
  const scores = Object.entries(paper.scores);
  const scoresReady = scores.every(([, value]) => typeof value === "number");
  const week = String(paper.week).padStart(2, "0");

  return (
    <>
      <PageHero
        width="760"
        eyebrow={t("week", { week })}
        title={paper.title}
        serif={t("serif")}
      />
      <ReadingProgress>
        <article className="mx-auto max-w-[760px] px-4 py-14 md:py-16">
          <Link
            href="/papers"
            className="font-mono text-[12px] uppercase tracking-[0.16em] text-signal-ink"
          >
            {t("viewAll")}
          </Link>
          <p className="mt-6 font-mono text-[12px] text-muted">
            {paper.authors.join(", ")}
            {isTodo(paper.date) ? "" : ` · ${paper.date}`}
            {" · "}
            {isTodo(paper.venue) ? t("missing") : paper.venue}
            {` · ${paper.year}`}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Tag>{isTodo(paper.verdict) ? t("missing") : paper.verdict}</Tag>
            {typeof paper.difficulty === "number" ? (
              <DifficultyDots
                value={paper.difficulty}
                label={t("difficulty", { value: paper.difficulty })}
              />
            ) : null}
            {typeof paper.readingTime === "number" ? (
              <span className="font-mono text-[12px] text-muted">
                {t("minutes", { count: paper.readingTime })}
              </span>
            ) : null}
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {paper.topics.map((topic) => (
              <li key={topic}>
                <Tag>{isTodo(topic) ? t("missing") : topic}</Tag>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            {isUrl(paper.paperUrl) ? (
              <a
                href={paper.paperUrl}
                className="text-signal-ink"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("paperLink")}
              </a>
            ) : null}
            {isUrl(paper.codeUrl) ? (
              <a
                href={paper.codeUrl}
                className="text-signal-ink"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("codeLink")}
              </a>
            ) : null}
          </div>
          <p className="mt-6 border border-border bg-surface px-4 py-3 font-serif text-2xl italic leading-snug">
            {isTodo(paper.tldr) ? t("missing") : paper.tldr}
          </p>
          <section className="mt-8">
            <h2 className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink">
              {t("scores")}
            </h2>
            {scoresReady ? (
              <div className="mt-4">
                <ScoreBars
                  rows={scores.map(([key, value]) => ({
                    key,
                    label: t(key as "novelty"),
                    value: value as number,
                  }))}
                />
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">{t("scoresMissing")}</p>
            )}
          </section>
          <div className="mt-2 text-[15px] leading-relaxed">
            <MDXRemote
              source={stripUnfinishedSource(paper.body)}
              components={paperMdxComponents}
              options={{
                mdxOptions: {
                  rehypePlugins: [stripUnfinishedMdx, questionBlock],
                },
              }}
            />
          </div>
          <PaperNav prev={prev} next={next} related={related} />
        </article>
      </ReadingProgress>
    </>
  );
}
