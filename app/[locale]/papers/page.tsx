import { getTranslations } from "next-intl/server";
import { PaperBrowser } from "@/components/papers/paper-browser";
import { PaperCard } from "@/components/papers/paper-card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageHero } from "@/components/ui/page-hero";
import { getPapers, latestPaper, toCardData } from "@/lib/content/papers";
import { resolveLocale } from "@/lib/locale";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Papers" });
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMeta({
    locale,
    path: "/papers",
    title: t("indexTitle"),
    description: meta("pages.papers"),
  });
}

export default async function PapersPage({ params }: Props) {
  await resolveLocale(params);
  const t = await getTranslations("Papers");
  const papers = getPapers().map(toCardData);
  const featured = latestPaper(papers);

  return (
    <>
      <PageHero
        eyebrow={t("indexEyebrow")}
        title={t("indexTitle")}
        serif={t("serif")}
      >
        <p className="mt-4 max-w-[36rem] text-muted">{t("cadence")}</p>
      </PageHero>
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-16">
        {featured ? (
          <section className="mb-10">
            <Eyebrow>{t("latest")}</Eyebrow>
            <div className="mt-4">
              <PaperCard paper={featured} />
            </div>
          </section>
        ) : (
          <p className="text-muted">{t("none")}</p>
        )}
        <PaperBrowser papers={papers} featuredSlug={featured?.slug ?? null} />
      </div>
    </>
  );
}
