import type { LearningFrontmatter } from "@/lib/content/schemas";
import { isTodo } from "@/lib/utils";

const DAY = 24 * 60 * 60 * 1000;

export type LearningCard = LearningFrontmatter & {
  slug: string;
  summary: string;
};

export function learningStreak(items: { week: number; dateEnd: string }[]) {
  const sorted = [...items]
    .filter((item) => !isTodo(item.dateEnd))
    .sort((a, b) => a.dateEnd.localeCompare(b.dateEnd));
  let longest = 0;
  let current = 0;
  let previous: number | null = null;

  for (const item of sorted) {
    const time = Date.parse(`${item.dateEnd}T00:00:00Z`);
    if (previous === null || time - previous <= 8 * DAY) {
      current += 1;
    } else {
      current = 1;
    }
    longest = Math.max(longest, current);
    previous = time;
  }

  return {
    week: sorted.at(-1)?.week ?? 0,
    current,
    longest,
  };
}

export function newestLearning(items: LearningCard[]) {
  return (
    [...items]
      .filter((item) => !isTodo(item.dateEnd))
      .sort((a, b) => b.dateEnd.localeCompare(a.dateEnd))[0] ?? null
  );
}

function utcMonday(isoDate: string) {
  const time = Date.parse(`${isoDate}T00:00:00Z`);
  const day = new Date(time).getUTCDay();
  const delta = day === 0 ? 6 : day - 1;
  return time - delta * DAY;
}

function iso(time: number) {
  return new Date(time).toISOString().slice(0, 10);
}

export type HeatCell = {
  start: string;
  level: 0 | 1 | 2 | 3 | 4;
  slug: string | null;
  label: string;
};

function hoursLevel(hours: number, max: number): 1 | 2 | 3 | 4 {
  if (max <= 0) return 1;
  const ratio = hours / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

export function heatmapWeeks(
  entries: LearningCard[],
  today: string,
): HeatCell[] {
  const dated = entries.filter((entry) => !isTodo(entry.dateStart));
  const endMonday = Math.max(
    utcMonday(today),
    ...dated.map((entry) => utcMonday(entry.dateEnd && !isTodo(entry.dateEnd) ? entry.dateEnd : entry.dateStart)),
  );
  const numericHours = dated
    .map((entry) => entry.hoursSpent)
    .filter((hours): hours is number => typeof hours === "number");
  const maxHours = Math.max(0, ...numericHours);

  return Array.from({ length: 52 }, (_, index) => {
    const start = endMonday - (51 - index) * 7 * DAY;
    const end = start + 6 * DAY;
    const entry = dated.find((item) => {
      const time = Date.parse(`${item.dateStart}T00:00:00Z`);
      return time >= start && time <= end;
    });
    const startIso = iso(start);
    if (!entry) {
      return {
        start: startIso,
        level: 0,
        slug: null,
        label: startIso,
      };
    }
    const level =
      typeof entry.hoursSpent === "number"
        ? hoursLevel(entry.hoursSpent, maxHours)
        : 1;
    return {
      start: startIso,
      level,
      slug: entry.slug,
      label: `${entry.title}, ${entry.dateStart}`,
    };
  });
}
