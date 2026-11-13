import { getTranslations } from "next-intl/server";
import { HomePage } from "@/components/sections/home-page";
import { resolveLocale } from "@/lib/locale";
import { jsonLdString, pageMeta, personJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    ...pageMeta({ locale, path: "", description: t("description") }),
    title: { absolute: t("titleHome") },
  };
}

export default async function Page({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Meta" });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(personJsonLd(t("description"))),
        }}
      />
      <HomePage />
    </>
  );
}
