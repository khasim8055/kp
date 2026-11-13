import { getTranslations } from "next-intl/server";
import { Spine, SpineItem } from "@/components/sections/spine";
import { Timeline } from "@/components/sections/timeline";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageHero } from "@/components/ui/page-hero";
import { education, experience } from "@/data/experience";
import { resolveLocale } from "@/lib/locale";
import { plainEyebrow } from "@/lib/plain-eyebrow";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await resolveLocale(params);
  const nav = await getTranslations({ locale, namespace: "Nav" });
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMeta({
    locale,
    path: "/experience",
    title: nav("experience"),
    description: meta("pages.experience"),
  });
}

export default async function ExperiencePage({ params }: Props) {
  await resolveLocale(params);
  const t = await getTranslations("Experience");
  const journey = await getTranslations("Journey");

  return (
    <>
      <PageHero
        width="760"
        eyebrow={t("eyebrow")}
        title={t("title")}
        serif={journey("serif")}
      />
      <div className="mx-auto max-w-[760px] px-4 py-14 md:py-16">
        <Timeline items={experience} />
        <section className="mt-16" aria-labelledby="education-title">
          <Eyebrow>{plainEyebrow(t("educationEyebrow"))}</Eyebrow>
          <h2
            id="education-title"
            className="mt-3 font-display text-3xl font-bold tracking-tight"
          >
            {t("educationTitle")}
          </h2>
          <div className="mt-8">
            <Spine>
              {education.map((item) => (
                <SpineItem key={`${item.school}-${item.start}`}>
                  <Card>
                    <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-signal-ink">
                      {t("range", { start: item.start, end: item.end })} · {item.location}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">
                      {item.program}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{item.school}</p>
                    <p className="mt-4 text-sm leading-relaxed">{item.detail}</p>
                  </Card>
                </SpineItem>
              ))}
            </Spine>
          </div>
        </section>
      </div>
    </>
  );
}
