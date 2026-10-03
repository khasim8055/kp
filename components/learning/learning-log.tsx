"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { isTodo } from "@/lib/utils";
import type { LearningCard } from "@/lib/content/learning-shared";

export function LearningLog({ entries }: { entries: LearningCard[] }) {
  const t = useTranslations("Learning");
  const [topic, setTopic] = useState("all");

  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      for (const tag of entry.tags) {
        if (isTodo(tag)) continue;
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [entries]);

  const visible = [...entries]
    .filter((entry) => topic === "all" || entry.tags.includes(topic))
    .sort((a, b) => b.dateEnd.localeCompare(a.dateEnd) || b.week - a.week);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <TopicButton active={topic === "all"} onClick={() => setTopic("all")}>
          {t("allTopics")}
        </TopicButton>
        {topics.map(([tag, count]) => (
          <TopicButton key={tag} active={topic === tag} onClick={() => setTopic(tag)}>
            {tag} {count}
          </TopicButton>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="mt-6 text-sm text-muted">{t("empty")}</p>
      ) : (
        <ol className="mt-8 space-y-8 border-l border-border pl-5">
          {visible.map((entry) => (
            <li key={entry.slug} className="relative">
              <span
                className="absolute -left-[23px] top-1.5 h-2 w-2 border border-accent bg-background"
                aria-hidden
              />
              <p className="font-mono text-[11px] text-muted">
                {t("week", { week: String(entry.week).padStart(2, "0") })}
                {" · "}
                {t("range", { start: entry.dateStart, end: entry.dateEnd })}
              </p>
              <h2 className="mt-1 text-xl font-medium">
                <Link href={`/learning/${entry.slug}`} className="hover:text-accent">
                  {entry.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-muted">
                {typeof entry.hoursSpent === "number"
                  ? t("hours", { count: entry.hoursSpent })
                  : t("hoursMissing")}
                {entry.mood ? ` · ${entry.mood}` : ""}
              </p>
              {entry.summary ? (
                <p className="mt-3 text-sm leading-relaxed">{entry.summary}</p>
              ) : null}
              <Link href={`/learning/${entry.slug}`} className="mt-3 inline-block text-sm text-accent">
                {t("readWeek")}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function TopicButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "border border-accent px-2 py-0.5 font-mono text-[11px] text-accent"
          : "border border-border px-2 py-0.5 font-mono text-[11px] text-muted"
      }
    >
      {children}
    </button>
  );
}
