import { getTranslations } from "next-intl/server";
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
 * Every skill group is rendered in the page, with no tabs to click through.
 * A skill gets a level only where a project on this site backs it up.
 */
export async function Skills({ index }: { index?: string }) {
  const t = await getTranslations("Skills");

  return (
    <>
      <SectionHeader
        id="skills-title"
        index={index}
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2">
        {skillTabs.map((group) => {
          const proven = group.skills.filter((skill) => hasValidSkillLevel(skill.level));
          const other = group.skills.filter((skill) => !hasValidSkillLevel(skill.level));
          return (
            <section key={group.id} aria-labelledby={`skills-${group.id}`}>
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
                  <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
                    {other.map((skill, i) => (
                      <li key={skill.id}>
                        {skill.name}
                        {i < other.length - 1 ? (
                          <span className="ml-3 text-border" aria-hidden>
                            /
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
          );
        })}
      </div>
    </>
  );
}
