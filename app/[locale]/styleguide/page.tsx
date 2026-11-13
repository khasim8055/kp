import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuditFigure } from "@/components/figure/audit-figure";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Readout } from "@/components/ui/readout";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge, type Status } from "@/components/ui/status-badge";
import { Tag } from "@/components/ui/tag";
import { resolveLocale } from "@/lib/locale";

const statuses: Status[] = ["building", "in-progress", "shipped", "ongoing", "done"];

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Styleguide" });
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default async function StyleguidePage({ params }: Props) {
  await resolveLocale(params);
  const t = await getTranslations("Styleguide");

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-16">
      <SectionHeader
        index="00"
        eyebrow={t("eyebrow")}
        title={t("title")}
        serifLine={t("serifLine")}
        subtitle={t("intro")}
      />
      <div className="rule-ticks mt-10" aria-hidden="true" />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Sample title={t("darkSample")} theme="dark" eyebrow={t("eyebrow")} serifLine={t("serifLine")} tag={t("tag")} />
        <Sample title={t("lightSample")} theme="light" eyebrow={t("eyebrow")} serifLine={t("serifLine")} tag={t("tag")} />
      </div>
      <div className="mt-10 flex flex-wrap gap-4">
        {statuses.map((status) => (
          <StatusBadge key={status} status={status} />
        ))}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <Readout value={12} label={t("readoutLabel")} />
        </Card>
        <Card>
          <Readout value="1,000+" label={t("readoutStatic")} />
        </Card>
      </div>
      <Card className="mt-6">
        <p>{t("cardBody")}</p>
        <div className="mt-4">
          <Tag>{t("tag")}</Tag>
        </div>
      </Card>
      <div className="mt-10 max-w-[480px]">
        <AuditFigure />
      </div>
    </div>
  );
}

function Sample({
  title,
  theme,
  eyebrow,
  serifLine,
  tag,
}: {
  title: string;
  theme: "dark" | "light";
  eyebrow: string;
  serifLine: string;
  tag: string;
}) {
  return (
    <div className={`${theme} rounded-[14px] border border-border bg-background p-5 text-foreground`}>
      <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.2em] text-muted">{title}</p>
      <Eyebrow>{eyebrow}</Eyebrow>
      <p className="type-serif mt-3">{serifLine}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Tag>{tag}</Tag>
        <StatusBadge status="done" />
        <StatusBadge status="in-progress" />
      </div>
    </div>
  );
}
