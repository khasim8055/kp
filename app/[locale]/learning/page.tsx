import { getTranslations } from "next-intl/server";
import { LearningHeatmap } from "@/components/learning/heatmap";
import { LearningLog } from "@/components/learning/learning-log";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageHero } from "@/components/ui/page-hero";
import { Readout } from "@/components/ui/readout";
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
    <>
      <PageHero
        eyebrow={t("indexEyebrow")}
        title={t("indexTitle")}
        serif={t("serif")}
      />
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-16">
        <div className="mb-10 flex flex-wrap gap-10">
          <Readout
            value={t("weeks", { count: streak.current })}
            label={t("currentStreak")}
          />
          <Readout
            value={t("weeks", { count: streak.longest })}
            label={t("longestStreak")}
          />
        </div>
        <section className="mb-12">
          <Eyebrow>{t("heatmap")}</Eyebrow>
          <div className="mt-4">
            <LearningHeatmap
              cells={cells}
              label={t("heatmapLabel", { count: logged })}
            />
          </div>
          <ul className="mt-3 flex flex-wrap gap-4 font-mono text-[12px] text-muted">
            <li className="inline-flex items-center gap-2">
              <span className="h-3 w-3 border border-border" aria-hidden />
              {t("legendEmpty")}
            </li>
            <li className="inline-flex items-center gap-2">
              <span
                className="h-3 w-3 border border-border bg-signal/30"
                aria-hidden
              />
              {t("legendSome")}
            </li>
            <li className="inline-flex items-center gap-2">
              <span
                className="h-3 w-3 border border-border bg-signal"
                aria-hidden
              />
              {t("legendMore")}
            </li>
          </ul>
        </section>
        <LearningLog entries={entries} />
      </div>
    </>
  );
}
