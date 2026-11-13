import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const facts = ["based", "studying", "before", "languages"] as const;

export async function About({ index }: { index?: string }) {
  const t = await getTranslations("About");

  return (
    <>
      <SectionHeader id="about-title" index={index} eyebrow={t("eyebrow")} title={t("title")} />
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-14">
        {/* DRAFT: Khasim to review */}
        <div className="max-w-[640px] space-y-4 leading-relaxed text-muted" data-reveal>
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
          <p>{t("p4")}</p>
        </div>
        <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
          <Card>
            <dl className="fact-list fact-list-plain">
              {facts.map((key) => (
                <div key={key}>
                  <dt>{t(`facts.${key}.label`)}</dt>
                  <dd>{t(`facts.${key}.value`)}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
