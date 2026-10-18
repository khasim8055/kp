import type { PaperFrontmatter } from "@/lib/content/schemas";
import { isTodo } from "@/lib/utils";

export type PaperCardData = PaperFrontmatter;

export { isTodo };

export function isUrl(value: string) {
  return value.length > 0 && !isTodo(value);
}

export function paperOfTheWeek(papers: PaperCardData[]) {
  const dated = papers.filter((paper) => !isTodo(paper.date));
  return (
    [...dated].sort(
      (a, b) => b.date.localeCompare(a.date) || b.week - a.week,
    )[0] ?? null
  );
}

export function paperNeighbors(papers: PaperCardData[], slug: string) {
  const index = papers.findIndex((paper) => paper.slug === slug);
  return {
    prev: index > 0 ? papers[index - 1] : null,
    next: index >= 0 ? (papers[index + 1] ?? null) : null,
  };
}

export function relatedPapers(papers: PaperCardData[], paper: PaperCardData) {
  const topics = new Set(paper.topics.filter((topic) => !isTodo(topic)));
  return papers.filter(
    (other) =>
      other.slug !== paper.slug &&
      other.topics.some((topic) => topics.has(topic)),
  );
}

export function meanScore(paper: PaperCardData) {
  const values = Object.values(paper.scores);
  if (!values.every((value): value is number => typeof value === "number")) {
    return null;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function filterPapers(
  papers: PaperCardData[],
  filters: {
    query: string;
    topic: string;
    verdict: string;
    year: string;
    sort: "newest" | "score";
    featuredSlug: string | null;
  },
) {
  const needle = filters.query.trim().toLowerCase();
  const filtering =
    needle.length > 0 ||
    filters.topic !== "all" ||
    filters.verdict !== "all" ||
    filters.year !== "all" ||
    filters.sort !== "newest";

  const matched = papers.filter((paper) => {
    if (filters.topic !== "all" && !paper.topics.includes(filters.topic)) {
      return false;
    }
    if (filters.verdict !== "all" && paper.verdict !== filters.verdict) return false;
    if (filters.year !== "all" && String(paper.year) !== filters.year) return false;
    if (!needle) return true;
    const haystack = [
      paper.title,
      paper.tldr,
      paper.venue,
      paper.authors.join(" "),
      paper.topics.join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });

  const sorted = [...matched].sort((a, b) => {
    if (filters.sort === "score") {
      return (meanScore(b) ?? -1) - (meanScore(a) ?? -1);
    }
    const aDate = isTodo(a.date) ? "" : a.date;
    const bDate = isTodo(b.date) ? "" : b.date;
    return bDate.localeCompare(aDate) || b.week - a.week;
  });

  if (!filtering && filters.featuredSlug) {
    const withoutFeatured = sorted.filter(
      (paper) => paper.slug !== filters.featuredSlug,
    );
    // Keep the only paper visible in the grid when it is also featured.
    return withoutFeatured.length > 0 ? withoutFeatured : sorted;
  }
  return sorted;
}
