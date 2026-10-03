import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { skillGroups } from "@/data/skills";

export async function Skills() {
  const t = await getTranslations("Skills");

  return (
    <>
      <SectionHeading
        id="skills-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {skillGroups.map((group) => (
          <li key={group.key} className="border border-border p-4">
            <h3 className="text-sm font-medium">{t(group.key)}</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}
