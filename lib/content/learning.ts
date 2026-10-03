import { readMdxCollection } from "@/lib/content/mdx";
import { learningSchema } from "@/lib/content/schemas";
import type { LearningCard } from "@/lib/content/learning-shared";

export type LearningEntry = LearningCard & { body: string };

export function entrySummary(body: string) {
  const blocks = body
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0 && !block.startsWith("#"));
  return blocks[0]?.replace(/\s+/g, " ") ?? "";
}

export function getLearningEntries(): LearningEntry[] {
  return readMdxCollection("learning", learningSchema)
    .map((entry) => ({
      ...entry,
      slug: entry.file.replace(/\.mdx$/, ""),
      summary: entrySummary(entry.body),
    }))
    .sort((a, b) => a.week - b.week);
}

export function getLearningEntry(slug: string) {
  return getLearningEntries().find((entry) => entry.slug === slug) ?? null;
}

export function toLearningCard(entry: LearningEntry): LearningCard {
  return {
    slug: entry.slug,
    week: entry.week,
    dateStart: entry.dateStart,
    dateEnd: entry.dateEnd,
    title: entry.title,
    tags: entry.tags,
    hoursSpent: entry.hoursSpent,
    mood: entry.mood,
    links: entry.links,
    summary: entry.summary,
  };
}
