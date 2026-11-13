import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/section-header";
import { achievements } from "@/data/achievements";

const facts = ["based", "studying", "before", "languages"] as const;

export async function About({ index }: { index?: string }) {
  const t = await getTranslations("About");

  return (
    <>
      <SectionHeader id="about-title" index={index} eyebrow={t("eyebrow")} title={t("title")} />
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
        {/* DRAFT: Khasim to review */}
        <div className="max-w-[640px] space-y-4 leading-relaxed text-muted">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
          <p>{t("p4")}</p>
        </div>
        <dl className="fact-list">
          {facts.map((key) => (
            <div key={key}>
              <dt>{t(`facts.${key}.label`)}</dt>
              <dd>{t(`facts.${key}.value`)}</dd>
            </div>
          ))}
          <div>
            <dt>{t("facts.patent.label")}</dt>
            <dd>
              {achievements.patent.title}
              <span className="mt-1 block text-muted">{t("facts.patent.value")}</span>
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
}
