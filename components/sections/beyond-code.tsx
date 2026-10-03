import { getTranslations } from "next-intl/server";
import { Chip } from "@/components/ui/chip";
import { SectionHeading } from "@/components/ui/section-heading";
import { achievements } from "@/data/achievements";

export async function BeyondCode() {
  const t = await getTranslations("Beyond");

  return (
    <>
      <SectionHeading
        id="beyond-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <dl className="grid gap-6 sm:grid-cols-2">
        <Item label={t("patent")}>
          <p>{achievements.patent.title}</p>
          <p className="mt-1 text-muted">{achievements.patent.detail}</p>
        </Item>
        <Item label={t("council")}>{achievements.studentCouncil}</Item>
        <Item label={t("interests")}>
          <ul className="flex flex-wrap gap-2">
            {achievements.interests.map((interest) => (
              <li key={interest}>
                <Chip>{interest}</Chip>
              </li>
            ))}
          </ul>
        </Item>
        <Item label={t("languages")}>
          {achievements.languages
            .map((language) => `${language.name} (${language.level})`)
            .join(", ")}
        </Item>
      </dl>
    </>
  );
}

function Item({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-mono text-xs text-accent">{label}</dt>
      <dd className="mt-2 text-sm leading-relaxed">{children}</dd>
    </div>
  );
}
