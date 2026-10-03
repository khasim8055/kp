import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import type { NavKey } from "@/lib/nav";
import { resolveLocale } from "@/lib/locale";

export async function pageMetadata(
  params: Promise<{ locale: string }>,
  key: NavKey,
) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Nav" });
  return { title: t(key) };
}

export async function PlaceholderPage({ titleKey }: { titleKey: NavKey }) {
  const nav = await getTranslations("Nav");
  const t = await getTranslations("Placeholder");

  return (
    <div className="mx-auto max-w-[760px] px-4 py-16">
      <SectionHeading
        id="placeholder-title"
        eyebrow={t("eyebrow")}
        title={nav(titleKey)}
      />
      <p className="text-muted">{t("body")}</p>
    </div>
  );
}
