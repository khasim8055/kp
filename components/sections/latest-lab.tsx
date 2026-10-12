import { getTranslations } from "next-intl/server";
import { LearningHeatmap } from "@/components/learning/heatmap";
import { LabScoreBars, type LabScore } from "@/components/sections/lab-scores";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { Readout } from "@/components/ui/readout";
import { SectionHeader } from "@/components/ui/section-header";
import { Tag } from "@/components/ui/tag";
import { tracks } from "@/data/tracks";
import { Link } from "@/i18n/navigation";
import {
  heatmapWeeks,
  learningStreak,
  newestLearning,
} from "@/lib/content/learning-shared";
import { getLearningEntries, toLearningCard } from "@/lib/content/learning";
import { getPapers, isTodo, paperOfTheWeek } from "@/lib/content/papers";
import { cn } from "@/lib/utils";

const scoreKeys = [
  "novelty",
  "rigor",
  "reproducibility",
  "practicalImpact",
] as const;

export async function LatestLab() {
  const t = await getTranslations("Lab");
  const scores = await getTranslations("Papers");
  const papers = getPapers();
  const paper = paperOfTheWeek(papers);
  const learningEntries = getLearningEntries().map(toLearningCard);
  const learning = newestLearning(learningEntries);
  const streak = learningStreak(learningEntries);
  const papersRead = papers.filter((item) => !isTodo(item.date)).length;
  const weeksLogged = learningEntries.filter(
    (item) => !isTodo(item.dateStart),
  ).length;
  const today = new Date().toISOString().slice(0, 10);
  const cells = heatmapWeeks(learningEntries, today).slice(-12);
  const scoreRows: LabScore[] = scoreKeys.map((key) => {
    const value = paper?.scores[key];
    return {
      key,
      label: scores(key),
      value: typeof value === "number" ? value : null,
    };
  });

  return (
    <>
      <SectionHeader
        id="lab-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
        serifLine={t("serif")}
      />
      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <GlowCard>
          <Readout value={streak.current} label={t("streak", { count: streak.current })} />
        </GlowCard>
        <GlowCard>
          <Readout value={papersRead} label={t("papers", { count: papersRead })} />
        </GlowCard>
        <GlowCard>
          <Readout value={weeksLogged} label={t("weeks", { count: weeksLogged })} />
        </GlowCard>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <GlowCard className="flex h-full flex-col">
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink">
            {t("paperOfWeek")}
          </p>
          {paper ? (
            <>
              <h3 className="mt-4 font-serif text-[28px] leading-tight text-balance italic md:text-[32px]">
                <Link
                  href={`/papers/${paper.slug}`}
                  className="hover:text-signal-ink"
                >
                  {paper.title}
                </Link>
              </h3>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Tag>
                  {isTodo(paper.venue) ? t("paperMissing") : paper.venue}
                </Tag>
                <VerdictBadge
                  verdict={
                    isTodo(paper.verdict) ? t("paperMissing") : paper.verdict
                  }
                  known={!isTodo(paper.verdict)}
                />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {isTodo(paper.tldr) ? t("paperMissing") : paper.tldr}
              </p>
              <div className="mt-6">
                <LabScoreBars rows={scoreRows} missing={t("scoreMissing")} />
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted">{t("paperMissing")}</p>
          )}
        </GlowCard>
        <GlowCard className="flex h-full flex-col">
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink">
            {t("learned")}
          </p>
          {learning ? (
            <>
              <h3 className="mt-4 font-display text-xl font-bold leading-tight tracking-tight">
                <Link
                  href={`/learning/${learning.slug}`}
                  className="hover:text-signal-ink"
                >
                  {learning.title}
                </Link>
              </h3>
              {learning.summary ? (
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
                  {learning.summary}
                </p>
              ) : null}
              <ul className="mt-4 flex flex-wrap gap-2">
                {learning.tags.map((tag) => (
                  <li key={tag}>
                    <Tag>{tag}</Tag>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <LearningHeatmap cells={cells} label={t("heatmap")} compact />
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted">{t("learningMissing")}</p>
          )}
        </GlowCard>
      </div>
      {tracks.length > 0 ? (
        <div className="mt-10">
          <h3 className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink">
            {t("tracks")}
          </h3>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {tracks.map((track) => (
              <li key={track.id}>
                <GlowCard className="h-full">
                  <h4 className="font-display text-lg font-bold tracking-tight">
                    {track.name}
                  </h4>
                  <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
                    {track.progress}
                  </p>
                  <div className="mt-2 h-px bg-border" aria-hidden />
                </GlowCard>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/papers">{t("allPapers")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/learning">{t("allLearning")}</Link>
        </Button>
      </div>
    </>
  );
}

function VerdictBadge({ verdict, known }: { verdict: string; known: boolean }) {
  const pass =
    known && (verdict === "Must read" || verdict === "Worth reading");
  const signal = known && verdict === "Skim";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[12px]",
        pass ? "text-pass-ink" : signal ? "text-signal-ink" : "text-muted",
      )}
    >
      <span
        className={cn(
          "inline-block h-1.5 w-1.5 rounded-full",
          pass ? "bg-pass" : signal ? "bg-signal" : "bg-muted",
        )}
        aria-hidden
      />
      {verdict}
    </span>
  );
}
