import { getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/sections/contact-cta";
import { resolveLocale } from "@/lib/locale";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Nav" });
  return { title: t("contact") };
}

export default async function ContactPage({ params }: Props) {
  await resolveLocale(params);
  return <ContactCta heading="h1" />;
}
