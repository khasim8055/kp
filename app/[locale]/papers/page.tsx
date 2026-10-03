import { getTranslations } from "next-intl/server";
import { PaperBrowser } from "@/components/papers/paper-browser";
import { PaperCard } from "@/components/papers/paper-card";
import { PageHeader } from "@/components/ui/page-header";
import {
  getPapers,
  paperOfTheWeek,
  toCardData,
} from "@/lib/content/papers";
import { resolveLocale } from "@/lib/locale";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Papers" });
  return { title: t("indexTitle") };
}

export default async function PapersPage({ params }: Props) {
  await resolveLocale(params);
  const t = await getTranslations("Papers");
  const papers = getPapers().map(toCardData);
  const featured = paperOfTheWeek(papers);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-16 md:py-20">
      <PageHeader eyebrow={t("indexEyebrow")} title={t("indexTitle")} />
      {featured ? (
        <section className="mb-8">
          <p className="mb-3 font-mono text-xs text-accent">{t("paperOfTheWeek")}</p>
          <PaperCard paper={featured} />
        </section>
      ) : null}
      <PaperBrowser papers={papers} featuredSlug={featured?.slug ?? null} />
    </div>
  );
}
