import { getTranslations } from "next-intl/server";
import { GlowSpine } from "@/components/sections/glow-spine";
import { Timeline } from "@/components/sections/timeline";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlowCard } from "@/components/ui/glow-card";
import { PageHero } from "@/components/ui/page-hero";
import { plainEyebrow } from "@/lib/plain-eyebrow";
import { education, experience } from "@/data/experience";
import { resolveLocale } from "@/lib/locale";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Nav" });
  return { title: t("experience") };
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
        <section className="mt-16">
          <Eyebrow>{plainEyebrow(t("educationEyebrow"))}</Eyebrow>
          <h2
            id="education-title"
            className="mt-3 font-display text-3xl font-bold tracking-tight"
          >
            {t("educationTitle")}
          </h2>
          <div className="mt-8">
            <GlowSpine>
              {education.map((item) => (
                <li
                  key={`${item.school}-${item.start}`}
                  className="relative pl-8"
                >
                  <span
                    className="absolute left-[3px] top-6 h-2 w-2 -translate-x-1/2 rounded-full bg-signal shadow-[0_0_8px_var(--signal)]"
                    aria-hidden
                  />
                  <GlowCard>
                    <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-signal-ink">
                      {t("range", { start: item.start, end: item.end })} ·{" "}
                      {item.location}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">
                      {item.program}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{item.school}</p>
                    <p className="mt-4 text-sm leading-relaxed">
                      {item.detail}
                    </p>
                  </GlowCard>
                </li>
              ))}
            </GlowSpine>
          </div>
        </section>
      </div>
    </>
  );
}
