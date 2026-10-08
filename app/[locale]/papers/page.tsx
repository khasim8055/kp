import { getTranslations } from "next-intl/server";
import { PaperBrowser } from "@/components/papers/paper-browser";
import { PaperCard } from "@/components/papers/paper-card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageHero } from "@/components/ui/page-hero";
import { getPapers, paperOfTheWeek, toCardData } from "@/lib/content/papers";
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
    <>
      <PageHero
        eyebrow={t("indexEyebrow")}
        title={t("indexTitle")}
        serif={t("serif")}
      />
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-16">
        {featured ? (
          <section className="mb-10">
            <Eyebrow>{t("paperOfTheWeek")}</Eyebrow>
            <div className="mt-4">
              <PaperCard paper={featured} />
            </div>
          </section>
        ) : null}
        <PaperBrowser papers={papers} featuredSlug={featured?.slug ?? null} />
      </div>
    </>
  );
}
