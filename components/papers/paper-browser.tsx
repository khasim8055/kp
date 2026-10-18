"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { FilterSelect, TopicButton } from "@/components/papers/paper-filters";
import { PaperCard } from "@/components/papers/paper-card";
import { paperVerdicts } from "@/lib/content/schemas";
import {
  filterPapers,
  isTodo,
  type PaperCardData,
} from "@/lib/content/paper-shared";

export function PaperBrowser({
  papers,
  featuredSlug,
}: {
  papers: PaperCardData[];
  featuredSlug: string | null;
}) {
  const t = useTranslations("Papers");
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [verdict, setVerdict] = useState("all");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState<"newest" | "score">("newest");

  const topics = useMemo(() => {
    const values = new Set<string>();
    for (const paper of papers) {
      for (const item of paper.topics) {
        if (!isTodo(item)) values.add(item);
      }
    }
    return [...values].sort();
  }, [papers]);

  const years = useMemo(
    () => [...new Set(papers.map((paper) => paper.year))].sort((a, b) => b - a),
    [papers],
  );

  const listPapers = useMemo(
    () =>
      featuredSlug
        ? papers.filter((paper) => paper.slug !== featuredSlug)
        : papers,
    [papers, featuredSlug],
  );

  const visible = useMemo(
    () =>
      filterPapers(papers, { query, topic, verdict, year, sort, featuredSlug }),
    [papers, query, topic, verdict, year, sort, featuredSlug],
  );

  if (listPapers.length === 0) return null;

  return (
    <div>
      <div className="flex flex-col gap-3 border border-border bg-surface p-4">
        <label className="sr-only" htmlFor="paper-search">
          {t("search")}
        </label>
        <input
          id="paper-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("search")}
          className="border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-signal"
        />
        <div className="flex flex-wrap gap-2">
          <FilterSelect
            label={t("verdict")}
            value={verdict}
            onChange={setVerdict}
            options={[
              { value: "all", label: t("allVerdicts") },
              ...paperVerdicts.map((item) => ({ value: item, label: item })),
            ]}
          />
          <FilterSelect
            label={t("year")}
            value={year}
            onChange={setYear}
            options={[
              { value: "all", label: t("allYears") },
              ...years.map((item) => ({
                value: String(item),
                label: String(item),
              })),
            ]}
          />
          <FilterSelect
            label={t("sort")}
            value={sort}
            onChange={(value) =>
              setSort(value === "score" ? "score" : "newest")
            }
            options={[
              { value: "newest", label: t("sortNewest") },
              { value: "score", label: t("sortScore") },
            ]}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <TopicButton active={topic === "all"} onClick={() => setTopic("all")}>
            {t("allTopics")}
          </TopicButton>
          {topics.map((item) => (
            <TopicButton
              key={item}
              active={topic === item}
              onClick={() => setTopic(item)}
            >
              {item}
            </TopicButton>
          ))}
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="mt-6 text-sm text-muted">{t("empty")}</p>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {visible.map((paper) => (
            <li key={paper.slug}>
              <PaperCard paper={paper} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
