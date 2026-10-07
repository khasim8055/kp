import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge, type Status } from "@/components/ui/status-badge";
import { Tag } from "@/components/ui/tag";
import { profile } from "@/data/profile";

const cards = [
  { key: "thesis", status: "in-progress" as Status },
  { key: "agents", status: "done" as Status },
  { key: "patterns", status: "done" as Status },
] as const;

const interests = [
  "interestAgent",
  "interestEval",
  "interestPrivacy",
  "interestVoice",
  "interestRobotics",
] as const;

export async function Research() {
  const t = await getTranslations("ResearchHome");

  return (
    <>
      <SectionHeader id="research-title" eyebrow={t("eyebrow")} title={t("title")} />
      <GlowCard className="glow-card-signal mt-10 p-6 md:p-8">
        <p className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink">
          <span
            className="status-pulse inline-block h-1.5 w-1.5 rounded-full bg-signal"
            aria-hidden="true"
          />
          {t("coreEyebrow")}
        </p>
        <p className="mt-4 font-serif text-[44px] italic leading-tight text-balance text-foreground">
          {t("question")}
        </p>
        {/* DRAFT: Khasim to review */}
        <div className="mt-5 max-w-[720px] space-y-3 leading-relaxed text-muted">
          <p>{t("coreP1")}</p>
          <p>{t("coreP2")}</p>
          <p>{t("coreP3")}</p>
        </div>
      </GlowCard>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <li key={card.key}>
            <GlowCard className="h-full">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-bold tracking-tight">
                  {t(`${card.key}Title`)}
                </h3>
                <StatusBadge status={card.status} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {t(`${card.key}Body`)}
              </p>
            </GlowCard>
          </li>
        ))}
      </ul>
      <ul className="mt-8 flex flex-wrap gap-2">
        {interests.map((key) => (
          <li key={key}>
            <Tag>{t(key)}</Tag>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap items-center gap-4 border border-border bg-surface p-5">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink">
          {t("collab")}
        </p>
        <Button asChild>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            {t("linkedin")}
          </a>
        </Button>
      </div>
    </>
  );
}
