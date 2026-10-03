import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";

export async function About() {
  const t = await getTranslations("About");

  return (
    <>
      <SectionHeading
        id="about-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <div className="max-w-[760px] space-y-4 leading-relaxed">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
        <p>{t("p3")}</p>
      </div>
    </>
  );
}
