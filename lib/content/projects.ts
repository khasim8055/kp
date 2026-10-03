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
