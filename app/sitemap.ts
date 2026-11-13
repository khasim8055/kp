import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getNow } from "@/lib/content/now";
import { getPapers } from "@/lib/content/papers";
import { getProjects } from "@/lib/content/projects";
import { localizedPath } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { isTodo } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const url = (locale: string, path: string) => {
    const local = localizedPath(locale, path);
    return local === "/" ? `${base}/` : `${base}${local}`;
  };

  const now = getNow();
  const pages: { path: string; lastModified?: string }[] = [
    { path: "" },
    { path: "/projects" },
    { path: "/research" },
    { path: "/papers" },
    { path: "/experience" },
    { path: "/contact" },
    {
      path: "/now",
      lastModified: now && !isTodo(now.updated) ? now.updated : undefined,
    },
    ...getProjects().map((project) => ({ path: `/projects/${project.slug}` })),
    ...getPapers().map((paper) => ({
      path: `/papers/${paper.slug}`,
      lastModified: isTodo(paper.date) ? undefined : paper.date,
    })),
  ];

  return pages.flatMap(({ path, lastModified }) =>
    routing.locales.map((locale) => ({
      url: url(locale, path),
      ...(lastModified ? { lastModified } : {}),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((item) => [item, url(item, path)]),
        ),
      },
    })),
  );
}
