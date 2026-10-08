import { readMdxCollection, type MdxDocument } from "@/lib/content/mdx";
import { projectSchema, type ProjectFrontmatter } from "@/lib/content/schemas";

export type Project = MdxDocument<ProjectFrontmatter>;

export function formatProjectDate(date: string) {
  const [year, month] = date.split("-");
  return month ? `${month}/${year}` : year;
}

export function getProjects() {
  return readMdxCollection("projects", projectSchema).sort(
    (a, b) => a.featured - b.featured,
  );
}

export function getProject(slug: string) {
  return getProjects().find((project) => project.slug === slug) ?? null;
}

export function extractBuiltDetails(body: string, limit = 3) {
  const match = body.match(/## What I built\s*\n([\s\S]*?)(?=\n##\s|$)/i);
  if (!match?.[1]) return [];
  const section = match[1].trim();
  const bullets = [...section.matchAll(/^[-*]\s+(.+)$/gm)].map((item) => item[1]?.trim() ?? "");
  if (bullets.some(Boolean)) return bullets.filter(Boolean).slice(0, limit);
  return section
    .split(/(?<=\.)\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}

export function splitStat(stat: string) {
  const match = stat.match(/^([+\-<>]?\s*[\d.,]+%?\+?|[<>]\s*\d+\w*|Art\.\s*\d+)\s+(.*)$/i);
  if (!match) return { value: stat, label: "" };
  return { value: (match[1] ?? stat).trim(), label: (match[2] ?? "").trim() };
}
