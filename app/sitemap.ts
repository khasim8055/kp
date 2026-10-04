import type { MetadataRoute } from "next";
import { getLearningEntries } from "@/lib/content/learning";
import { getPapers } from "@/lib/content/papers";
import { getProjects } from "@/lib/content/projects";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

function localized(base: string, locale: string, path: string) {
  if (locale === routing.defaultLocale) return `${base}${path || "/"}`;
  return path ? `${base}/${locale}${path}` : `${base}/${locale}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const paths = [
    "",
    "/research",
    "/papers",
    "/learning",
    "/projects",
    "/experience",
    "/contact",
    "/now",
    ...getPapers().map((paper) => `/papers/${paper.slug}`),
    ...getProjects().map((project) => `/projects/${project.slug}`),
    ...getLearningEntries().map((entry) => `/learning/${entry.slug}`),
  ];

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localized(base, locale, path),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((item) => [item, localized(base, item, path)]),
        ),
      },
    })),
  );
}
