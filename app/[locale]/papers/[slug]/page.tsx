import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { paperMdxComponents } from "@/components/mdx/paper-body";
import { DifficultyDots } from "@/components/papers/difficulty-dots";
import { PaperNav } from "@/components/papers/paper-nav";
import { ScoreBars } from "@/components/papers/score-bars";
import { Chip } from "@/components/ui/chip";
import { PageHeader } from "@/components/ui/page-header";
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
    <article className="mx-auto max-w-[760px] px-4 py-16 md:py-20">
      <Link href="/papers" className="text-sm text-accent">
        {t("viewAll")}
      </Link>
      <div className="mt-6">
        <PageHeader eyebrow={t("week", { week })} title={paper.title} />
      </div>
      <p className="font-mono text-[11px] text-muted">
        {paper.authors.join(", ")}
        {isTodo(paper.date) ? "" : ` · ${paper.date}`}
        {" · "}
        {isTodo(paper.venue) ? t("missing") : paper.venue}
        {` · ${paper.year}`}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Chip>{isTodo(paper.verdict) ? t("missing") : paper.verdict}</Chip>
        {typeof paper.difficulty === "number" ? (
          <DifficultyDots
            value={paper.difficulty}
            label={t("difficulty", { value: paper.difficulty })}
          />
        ) : null}
        {typeof paper.readingTime === "number" ? (
          <span className="font-mono text-[11px] text-muted">
            {t("minutes", { count: paper.readingTime })}
          </span>
        ) : null}
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {paper.topics.map((topic) => (
          <li key={topic}>
            <Chip>{isTodo(topic) ? t("missing") : topic}</Chip>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        {isUrl(paper.paperUrl) ? (
          <a href={paper.paperUrl} className="text-accent" target="_blank" rel="noopener noreferrer">
            {t("paperLink")}
          </a>
        ) : null}
        {isUrl(paper.codeUrl) ? (
          <a href={paper.codeUrl} className="text-accent" target="_blank" rel="noopener noreferrer">
            {t("codeLink")}
          </a>
        ) : null}
      </div>
      <p className="mt-6 border border-border px-4 py-3 text-lg leading-relaxed">
        {isTodo(paper.tldr) ? t("missing") : paper.tldr}
      </p>
      <section className="mt-8">
        <h2 className="text-sm font-medium">{t("scores")}</h2>
        {scoresReady ? (
          <div className="mt-3">
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
        <MDXRemote source={paper.body} components={paperMdxComponents} />
      </div>
      <PaperNav prev={prev} next={next} related={related} />
    </article>
  );
}
