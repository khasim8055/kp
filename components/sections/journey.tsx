import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tag } from "@/components/ui/tag";
import { journeyStops } from "@/data/journey";
import { Link } from "@/i18n/navigation";

/**
 * The path so far, oldest first, on a glowing rail. Each stop is a 3D card
 * that swings into place as it scrolls into view. No pinned scrolling.
 */
export async function Journey({ index }: { index?: string }) {
  const t = await getTranslations("Journey");

  return (
    <>
      <SectionHeader
        id="journey-title"
        index={index}
        eyebrow={t("eyebrow")}
        title={t("title")}
        serifLine={t("serif")}
      />
      <ol className="journey-rail mt-12">
        {journeyStops.map((stop, i) => (
          <li
            key={stop.id}
            className="journey-stop"
            data-reveal="flip"
            style={{ "--i": i % 4 } as React.CSSProperties}
          >
            <span className="journey-node" aria-hidden="true" />
            <Card className="h-full">
              <p className="font-mono text-[13px] text-signal-ink">
                {t(`stops.${stop.id}.year`)}
              </p>
              <h3 className="mt-2 font-display text-lg font-bold leading-tight tracking-tight text-pretty">
                {t(`stops.${stop.id}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t(`stops.${stop.id}.body`)}
              </p>
              <div className="mt-3">
                {stop.status ? (
                  <StatusBadge status={stop.status} />
                ) : (
                  <Tag>{t(`stops.${stop.id}.tag`)}</Tag>
                )}
              </div>
            </Card>
          </li>
        ))}
      </ol>
      <Link
        href="/experience"
        className="mt-8 inline-flex items-center gap-2 text-sm text-signal-ink hover:text-foreground"
      >
        {t("full")}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </>
  );
}
