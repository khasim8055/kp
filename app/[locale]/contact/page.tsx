import { getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/sections/contact-cta";
import { resolveLocale } from "@/lib/locale";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await resolveLocale(params);
  const nav = await getTranslations({ locale, namespace: "Nav" });
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMeta({
    locale,
    path: "/contact",
    title: nav("contact"),
    description: meta("pages.contact"),
  });
}

export default async function ContactPage({ params }: Props) {
  await resolveLocale(params);
  return <ContactCta heading="h1" />;
}
