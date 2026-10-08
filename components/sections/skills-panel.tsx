"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { SkillLevelBar } from "@/components/sections/skill-level-bar";
import { skillTabs, type SkillLevel } from "@/data/skills";
import { cn } from "@/lib/utils";

const levelKey: Record<SkillLevel, "production" | "project" | "studying" | "todo"> = {
  production: "production",
  project: "project",
  studying: "studying",
  TODO: "todo",
};

const levelText: Record<SkillLevel, string> = {
  production: "text-pass-ink",
  project: "text-signal-ink",
  studying: "text-pulse",
  TODO: "text-muted",
};

export function SkillsPanel() {
  const t = useTranslations("Skills");
  const baseId = useId();
  const [active, setActive] = useState(skillTabs[0]?.id ?? "aiml");
  const tab = skillTabs.find((item) => item.id === active) ?? skillTabs[0];

  function selectTab(nextId: (typeof skillTabs)[number]["id"]) {
    setActive(nextId);
    requestAnimationFrame(() => {
      document.getElementById(`${baseId}-${nextId}`)?.focus();
    });
  }

  function onTabKey(event: React.KeyboardEvent<HTMLDivElement>) {
    const index = skillTabs.findIndex((item) => item.id === active);
    if (index < 0) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectTab(skillTabs[(index + 1) % skillTabs.length]?.id ?? active);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectTab(skillTabs[(index - 1 + skillTabs.length) % skillTabs.length]?.id ?? active);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectTab(skillTabs[0]?.id ?? active);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectTab(skillTabs[skillTabs.length - 1]?.id ?? active);
    }
  }

  if (!tab) return null;

  return (
    <div className="mt-10">
      <div
        role="tablist"
        aria-label={t("tabsLabel")}
        className="flex flex-wrap gap-2"
        onKeyDown={onTabKey}
      >
        {skillTabs.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              id={`${baseId}-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              className={cn(
                "border px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.16em]",
                selected
                  ? "border-signal bg-signal text-[var(--on-signal)]"
                  : "border-border text-muted hover:text-foreground",
              )}
              onClick={() => setActive(item.id)}
            >
              {t(`tabs.${item.id}`)}
            </button>
          );
        })}
      </div>
      <div
        id={`${baseId}-panel-${tab.id}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-${tab.id}`}
        className="mt-6"
      >
        <p className="font-serif text-[28px] italic leading-snug text-balance md:text-[32px]">
          {t(`summaries.${tab.id}`)}
        </p>
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {tab.skills.map((skill) => (
            <li
              key={skill.id}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium">{skill.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {skill.usedInKey ? t(`usedIn.${skill.usedInKey}`) : t("usedPending")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <SkillLevelBar level={skill.level} />
                <span
                  className={cn(
                    "w-28 font-mono text-[11px] uppercase tracking-[0.16em]",
                    levelText[skill.level],
                  )}
                >
                  {t(`levels.${levelKey[skill.level]}`)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
