import { getTranslations } from "next-intl/server";
import { SkillsPanel } from "@/components/sections/skills-panel";
import { SectionHeader } from "@/components/ui/section-header";

export async function Skills() {
  const t = await getTranslations("Skills");

  return (
    <>
      <SectionHeader
        id="skills-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <SkillsPanel />
    </>
  );
}
