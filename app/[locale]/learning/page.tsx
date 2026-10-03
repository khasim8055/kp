import { getTranslations } from "next-intl/server";
import { LearningHeatmap } from "@/components/learning/heatmap";
import { LearningLog } from "@/components/learning/learning-log";
import { PageHeader } from "@/components/ui/page-header";
import { heatmapWeeks, learningStreak } from "@/lib/content/learning-shared";
import { getLearningEntries, toLearningCard } from "@/lib/content/learning";
import { resolveLocale } from "@/lib/locale";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Learning" });
  return { title: t("indexTitle") };
}

export default async function LearningPage({ params }: Props) {
  await resolveLocale(params);
  const t = await getTranslations("Learning");
  const entries = getLearningEntries().map(toLearningCard);
  const streak = learningStreak(entries);
  const cells = heatmapWeeks(entries, new Date().toISOString().slice(0, 10));
  const logged = cells.filter((cell) => cell.level > 0).length;

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-16 md:py-20">
      <PageHeader eyebrow={t("indexEyebrow")} title={t("indexTitle")} />
      <div className="mb-8 flex flex-wrap gap-6 font-mono text-xs text-muted">
        <p>
          {t("currentStreak")}: {t("weeks", { count: streak.current })}
        </p>
        <p>
          {t("longestStreak")}: {t("weeks", { count: streak.longest })}
        </p>
      </div>
      <section className="mb-10">
        <h2 className="mb-3 font-mono text-xs text-accent">{t("heatmap")}</h2>
        <LearningHeatmap cells={cells} label={t("heatmapLabel", { count: logged })} />
        <ul className="mt-3 flex flex-wrap gap-4 font-mono text-[11px] text-muted">
          <li className="inline-flex items-center gap-1">
            <span className="h-3 w-3 border border-border" aria-hidden />
            {t("legendEmpty")}
          </li>
          <li className="inline-flex items-center gap-1">
            <span className="h-3 w-3 border border-border bg-accent/30" aria-hidden />
            {t("legendSome")}
          </li>
          <li className="inline-flex items-center gap-1">
            <span className="h-3 w-3 border border-border bg-accent" aria-hidden />
            {t("legendMore")}
          </li>
        </ul>
      </section>
      <LearningLog entries={entries} />
    </div>
  );
}
