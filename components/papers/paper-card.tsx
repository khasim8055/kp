"use client";

import { useTranslations } from "next-intl";
import { DifficultyDots } from "@/components/papers/difficulty-dots";
import { GlowCard } from "@/components/ui/glow-card";
import { Tag } from "@/components/ui/tag";
import { Link } from "@/i18n/navigation";
import { isTodo, type PaperCardData } from "@/lib/content/paper-shared";

export function PaperCard({ paper }: { paper: PaperCardData }) {
  const t = useTranslations("Papers");
  const week = String(paper.week).padStart(2, "0");

  return (
    <article className="h-full">
      <GlowCard className="flex h-full flex-col">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-signal-ink">
          {t("week", { week })}
        </p>
        <h2 className="mt-3 font-serif text-2xl italic leading-snug">
          <Link
            href={`/papers/${paper.slug}`}
            className="hover:text-signal-ink"
          >
            {paper.title}
          </Link>
        </h2>
        <p className="mt-2 font-mono text-[12px] text-muted">
          {isTodo(paper.venue) ? t("missing") : paper.venue}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Tag>{isTodo(paper.verdict) ? t("missing") : paper.verdict}</Tag>
          {typeof paper.difficulty === "number" ? (
            <DifficultyDots
              value={paper.difficulty}
              label={t("difficulty", { value: paper.difficulty })}
            />
          ) : (
            <span className="font-mono text-[12px] text-muted">
              {t("missing")}
            </span>
          )}
        </div>
        <p className="mt-4 flex-1 text-sm leading-relaxed">
          {isTodo(paper.tldr) ? t("missing") : paper.tldr}
        </p>
      </GlowCard>
    </article>
  );
}
