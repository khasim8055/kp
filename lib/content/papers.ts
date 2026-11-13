import { readMdxCollection, type MdxDocument } from "@/lib/content/mdx";
import { sortByDate } from "@/lib/content/paper-shared";
import { paperSchema, type PaperFrontmatter } from "@/lib/content/schemas";

export type { PaperCardData } from "@/lib/content/paper-shared";
export {
  filterPapers,
  isTodo,
  isUrl,
  meanScore,
  paperNeighbors,
  latestPaper,
  relatedPapers,
} from "@/lib/content/paper-shared";

export type Paper = MdxDocument<PaperFrontmatter>;

export function getPapers() {
  return sortByDate(
    readMdxCollection("papers", paperSchema, { matchSlug: false }),
  );
}

export function getPaper(slug: string) {
  return getPapers().find((paper) => paper.slug === slug) ?? null;
}

export function toCardData(paper: Paper) {
  return {
    title: paper.title,
    slug: paper.slug,
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
