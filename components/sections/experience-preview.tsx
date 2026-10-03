import { getTranslations } from "next-intl/server";
import { Timeline } from "@/components/sections/timeline";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/i18n/navigation";
import { experience } from "@/data/experience";

export async function ExperiencePreview() {
  const t = await getTranslations("Experience");

  return (
    <>
      <SectionHeading
        id="experience-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
        action={
          <Link href="/experience" className="text-sm text-accent">
            {t("viewAll")}
          </Link>
        }
      />
      <Timeline items={experience} />
    </>
  );
}
