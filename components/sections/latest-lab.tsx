import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/i18n/navigation";
import { Chip } from "@/components/ui/chip";
import { getLearningEntries, toLearningCard } from "@/lib/content/learning";
import { learningStreak, newestLearning } from "@/lib/content/learning-shared";
import { getPapers, isTodo, paperOfTheWeek } from "@/lib/content/papers";

export async function LatestLab() {
  const t = await getTranslations("Lab");
  const paper = paperOfTheWeek(getPapers());
  const learningEntries = getLearningEntries().map(toLearningCard);
  const learning = newestLearning(learningEntries);
  const streak = learningStreak(learningEntries);
  const week = String(paper?.week ?? 0).padStart(2, "0");
  const learnWeek = String(learning?.week ?? 0).padStart(2, "0");

  return (
    <>
      <SectionHeading
        id="lab-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
        action={
          <Chip>
            {t("streak", { week: streak.week, count: streak.current })}
          </Chip>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {paper ? (
          <article className="flex flex-col border border-border p-5">
            <p className="font-mono text-xs text-accent">
              {t("paperLabel", { week })}
            </p>
            <h3 className="mt-3 font-serif text-xl leading-snug">
              {paper.title}
            </h3>
            <p className="mt-2 font-mono text-xs text-muted">
              {isTodo(paper.venue) ? t("paperMissing") : paper.venue}
            </p>
            <p className="mt-4 flex-1 text-sm leading-relaxed">
              {isTodo(paper.tldr) ? t("paperMissing") : paper.tldr}
            </p>
            <Link
              href={`/papers/${paper.slug}`}
              className="mt-4 text-sm text-accent"
            >
              {t("readPaper")}
            </Link>
          </article>
        ) : (
          <article className="border border-border p-5 text-sm text-muted">
            {t("paperMissing")}
          </article>
        )}
        {learning ? (
          <article className="flex flex-col border border-border p-5">
            <p className="font-mono text-xs text-accent">
              {t("weekLabel", { week: learnWeek })}
            </p>
            <h3 className="mt-3 text-xl leading-snug">{learning.title}</h3>
            <p className="mt-2 font-mono text-xs text-muted">
              {t("range", { start: learning.dateStart, end: learning.dateEnd })}
            </p>
            {learning.summary ? (
              <p className="mt-4 flex-1 text-sm leading-relaxed">{learning.summary}</p>
            ) : null}
            <Link
              href={`/learning/${learning.slug}`}
              className="mt-4 text-sm text-accent"
            >
              {t("readWeek")}
            </Link>
          </article>
        ) : (
          <article className="border border-border p-5 text-sm text-muted">
            {t("learningMissing")}
          </article>
        )}
      </div>
    </>
  );
}
