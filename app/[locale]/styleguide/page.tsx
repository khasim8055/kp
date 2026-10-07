import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Readout } from "@/components/ui/readout";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionReveal } from "@/components/ui/section-reveal";
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
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("intro")}
        serifLine={t("serifLine")}
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Sample title={t("darkSample")} theme="dark" eyebrow={t("eyebrow")} serifLine={t("serifLine")} />
        <Sample title={t("lightSample")} theme="light" eyebrow={t("eyebrow")} serifLine={t("serifLine")} />
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
      <SectionReveal className="mt-6">
        <Card>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <p className="mt-3">{t("reveal")}</p>
        </Card>
      </SectionReveal>
    </div>
  );
}

function Sample({
  title,
  theme,
  eyebrow,
  serifLine,
}: {
  title: string;
  theme: "dark" | "light";
  eyebrow: string;
  serifLine: string;
}) {
  return (
    <div className={`${theme} rounded-[14px] border border-border bg-background p-5 text-foreground`}>
      <p className="mb-4 font-mono text-[12px] text-muted">{title}</p>
      <Eyebrow>{eyebrow}</Eyebrow>
      <p className="type-serif mt-4 text-[30px]">{serifLine}</p>
    </div>
  );
}
