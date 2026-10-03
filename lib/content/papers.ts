import { readMdxCollection, type MdxDocument } from "@/lib/content/mdx";
import { paperSchema, type PaperFrontmatter } from "@/lib/content/schemas";

export type { PaperCardData } from "@/lib/content/paper-shared";
export {
  filterPapers,
  isTodo,
  isUrl,
  meanScore,
  paperNeighbors,
  paperOfTheWeek,
  relatedPapers,
} from "@/lib/content/paper-shared";

export type Paper = MdxDocument<PaperFrontmatter>;

export function getPapers() {
  return readMdxCollection("papers", paperSchema, { matchSlug: false }).sort(
    (a, b) => a.week - b.week,
  );
}

export function getPaper(slug: string) {
  return getPapers().find((paper) => paper.slug === slug) ?? null;
}

export function toCardData(paper: Paper) {
  return {
    title: paper.title,
    slug: paper.slug,
    week: paper.week,
    date: paper.date,
    authors: paper.authors,
    venue: paper.venue,
    year: paper.year,
    paperUrl: paper.paperUrl,
    codeUrl: paper.codeUrl,
    topics: paper.topics,
    difficulty: paper.difficulty,
    readingTime: paper.readingTime,
    verdict: paper.verdict,
    scores: paper.scores,
    tldr: paper.tldr,
  };
}
