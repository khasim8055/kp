import { readMdxCollection } from "@/lib/content/mdx";
import { nowSchema, type NowFrontmatter } from "@/lib/content/schemas";

export type NowPage = NowFrontmatter & { body: string };

export function getNow(): NowPage | null {
  const [entry] = readMdxCollection(".", nowSchema, { matchSlug: false }).filter((item) =>
    item.file.endsWith("now.mdx"),
  );
  if (!entry) return null;
  return { title: entry.title, updated: entry.updated, body: entry.body };
}
