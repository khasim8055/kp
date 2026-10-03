import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ZodType } from "zod";

export type MdxDocument<T> = T & { body: string; file: string };

export function readMdxCollection<T>(
  folder: string,
  schema: ZodType<T>,
  options?: { matchSlug?: boolean },
): MdxDocument<T>[] {
  const dir = path.join(process.cwd(), "content", folder);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      for (const key of ["date", "dateStart", "dateEnd"] as const) {
        const value = data[key];
        if (value instanceof Date) {
          data[key] = value.toISOString().slice(0, 10);
        }
      }
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        const details = parsed.error.issues
          .map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
          .join("\n");
        throw new Error(`Invalid frontmatter in content/${folder}/${file}\n${details}`);
      }
      const slug = (parsed.data as { slug?: string }).slug;
      const expected = file.replace(/\.mdx$/, "");
      if (options?.matchSlug !== false && slug && slug !== expected) {
        throw new Error(
          `Slug "${slug}" does not match filename content/${folder}/${file}`,
        );
      }
      return { ...parsed.data, body: content, file };
    });
}
