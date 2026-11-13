import { readMdxCollection, type MdxDocument } from "@/lib/content/mdx";
import { projectSchema, type ProjectFrontmatter } from "@/lib/content/schemas";

export type Project = MdxDocument<ProjectFrontmatter>;

function formatMonth(date: string) {
  const [year, month] = date.split("-");
  return month ? `${month}/${year}` : (year ?? date);
}

/** "03/2026 to 11/2026", or a single date when there is no end. */
export function formatProjectDate(date: string, end?: string) {
  return end ? `${formatMonth(date)} to ${formatMonth(end)}` : formatMonth(date);
}

export function getProjects() {
  return readMdxCollection("projects", projectSchema).sort(
    (a, b) => a.featured - b.featured,
  );
}

export function getProject(slug: string) {
  return getProjects().find((project) => project.slug === slug) ?? null;
}

/** Finished work first, then everything still in progress. */
export function groupProjects(projects: Project[]) {
  return {
    done: projects.filter((project) => project.status === "done"),
    ongoing: projects.filter((project) => project.status !== "done"),
  };
}

export function projectNeighbors(projects: Project[], slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0 || projects.length < 2) return { prev: null, next: null };
  return {
    prev: index > 0 ? (projects[index - 1] ?? null) : null,
    next: projects[index + 1] ?? null,
  };
}

export function splitStat(stat: string) {
  const match = stat.match(/^([+\-<>]?\s*[\d.,]+%?\+?|[<>]\s*\d+\w*)\s+(.*)$/i);
  if (!match) return { value: stat, label: "" };
  return { value: (match[1] ?? stat).trim(), label: (match[2] ?? "").trim() };
}
