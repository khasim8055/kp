import { getTranslations } from "next-intl/server";
import { SkillSphere, type SphereWord } from "@/components/sections/skill-sphere";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import {
  hasValidSkillLevel,
  skillTabs,
  type ValidSkillLevel,
} from "@/data/skills";
import { cn } from "@/lib/utils";

const levelText: Record<ValidSkillLevel, string> = {
  production: "text-pass-ink",
  project: "text-signal-ink",
  studying: "text-pulse-ink",
};

const levelFill: Record<ValidSkillLevel, string> = {
  production: "bg-pass",
  project: "bg-signal",
  studying: "bg-pulse",
};

const levelSteps: Record<ValidSkillLevel, number> = {
  production: 3,
  project: 2,
  studying: 1,
};

/**
 * A 3D sphere of every skill, next to the same skills as readable groups.
 * A skill gets a level only where a project on this site backs it up.
 */
export async function Skills({ index }: { index?: string }) {
  const t = await getTranslations("Skills");
  // The sphere shows a short selection: every skill with a level first, then
  // short names until it is full. The list next to it has every skill.
  const all: SphereWord[] = skillTabs.flatMap((group) =>
    group.skills.map((skill) => ({
      label: skill.name.replace(/\s*\(.*\)$/, ""),
      level: hasValidSkillLevel(skill.level) ? skill.level : null,
    })),
  );
  const short = all.filter((word) => word.label.length <= 12);
  const words = [
    ...short.filter((word) => word.level),
    ...short.filter((word) => !word.level),
  ].slice(0, 22);

  return (
    <>
      <SectionHeader
        id="skills-title"
        index={index}
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10">
        <div className="lg:sticky lg:top-28" data-reveal>
          <SkillSphere words={words} />
          <ul className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em]">
            <li className="text-pass-ink">{t("levels.production")}</li>
            <li className="text-signal-ink">{t("levels.project")}</li>
            <li className="text-pulse-ink">{t("levels.studying")}</li>
          </ul>
        </div>
        <div className="grid gap-4">
          {skillTabs.map((group, groupIndex) => {
            const proven = group.skills.filter((skill) => hasValidSkillLevel(skill.level));
            const other = group.skills.filter((skill) => !hasValidSkillLevel(skill.level));
            return (
              <div key={group.id} data-reveal style={{ "--i": groupIndex % 3 } as React.CSSProperties}>
                <Card>
                  <section aria-labelledby={`skills-${group.id}`}>
                    <h3
                      id={`skills-${group.id}`}
                      className="font-display text-xl font-bold tracking-tight"
                    >
                      {t(`tabs.${group.id}`)}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{t(`summaries.${group.id}`)}</p>
                    {proven.length > 0 ? (
                      <ul className="mt-4 divide-y divide-border border-y border-border">
                        {proven.map((skill) => {
                          const level = skill.level as ValidSkillLevel;
                          return (
                            <li
                              key={skill.id}
                              className="flex items-center justify-between gap-4 py-2.5"
                            >
                              <div className="min-w-0">
                                <p className="break-words text-[15px] font-medium">{skill.name}</p>
                                {skill.usedInKey ? (
                                  <p className="text-[13px] text-muted">
                                    {t(`usedIn.${skill.usedInKey}`)}
                                  </p>
                                ) : null}
                              </div>
                              <div className="flex shrink-0 items-center gap-3">
                                <span className="flex w-12 gap-1" aria-hidden>
                                  {[0, 1, 2].map((step) => (
                                    <span
                                      key={step}
                                      className={cn(
                                        "h-1.5 flex-1 rounded-[2px]",
                                        step < levelSteps[level] ? levelFill[level] : "bg-border",
                                      )}
                                    />
                                  ))}
                                </span>
                                <span
                                  className={cn(
                                    "w-[92px] font-mono text-[11px] uppercase tracking-[0.14em]",
                                    levelText[level],
                                  )}
                                >
                                  {t(`levels.${level}`)}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                    {other.length > 0 ? (
                      <>
                        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                          {t("also")}
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {other.map((skill) => (
                            <li
                              key={skill.id}
                              className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[13px] text-muted"
                            >
                              {skill.name}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </section>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
