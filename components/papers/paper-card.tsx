"use client";

import { useTranslations } from "next-intl";
import { DifficultyDots } from "@/components/papers/difficulty-dots";
import { Chip } from "@/components/ui/chip";
import { Link } from "@/i18n/navigation";
import { isTodo, type PaperCardData } from "@/lib/content/paper-shared";

export function PaperCard({ paper }: { paper: PaperCardData }) {
  const t = useTranslations("Papers");
  const week = String(paper.week).padStart(2, "0");

  return (
    <article className="flex h-full flex-col border border-border p-4">
      <p className="font-mono text-[11px] text-accent">
        {t("week", { week })}
      </p>
      <h3 className="mt-2 font-serif text-xl leading-snug">
        <Link href={`/papers/${paper.slug}`} className="hover:text-accent">
          {paper.title}
        </Link>
      </h3>
      <p className="mt-2 font-mono text-[11px] text-muted">
        {isTodo(paper.venue) ? t("missing") : paper.venue}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {isTodo(paper.verdict) ? (
          <Chip>{t("missing")}</Chip>
        ) : (
          <Chip>{paper.verdict}</Chip>
        )}
        {typeof paper.difficulty === "number" ? (
          <DifficultyDots
            value={paper.difficulty}
            label={t("difficulty", { value: paper.difficulty })}
          />
        ) : (
          <span className="font-mono text-[11px] text-muted">{t("missing")}</span>
        )}
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed">
        {isTodo(paper.tldr) ? t("missing") : paper.tldr}
      </p>
    </article>
  );
}
