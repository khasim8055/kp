import { getTranslations } from "next-intl/server";
import { Timeline } from "@/components/sections/timeline";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
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

  return (
    <div className="mx-auto max-w-[760px] px-4 py-16 md:py-20">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} />
      <Timeline items={experience} />
      <section className="mt-16">
        <SectionHeading
          id="education-title"
          eyebrow={t("educationEyebrow")}
          title={t("educationTitle")}
        />
        <ol className="space-y-8 border-l border-border pl-5">
          {education.map((item) => (
            <li key={`${item.school}-${item.start}`} className="relative">
              <span
                className="absolute -left-[23px] top-1.5 h-2 w-2 border border-accent bg-background"
                aria-hidden
              />
              <p className="font-mono text-[11px] text-muted">
                {t("range", { start: item.start, end: item.end })} ·{" "}
                {item.location}
              </p>
              <h3 className="mt-1 font-medium">{item.program}</h3>
              <p className="text-sm text-muted">{item.school}</p>
              <p className="mt-3 text-sm leading-relaxed">{item.detail}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
