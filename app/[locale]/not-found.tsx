import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="mx-auto max-w-[760px] px-4 py-24">
      <p className="font-mono text-xs text-accent">{t("eyebrow")}</p>
      <h1 className="mt-2 text-2xl font-medium tracking-tight">{t("title")}</h1>
      <p className="mt-3 text-muted">{t("body")}</p>
      <Link href="/" className="mt-6 inline-block text-sm text-accent">
        {t("home")}
      </Link>
    </div>
  );
}
