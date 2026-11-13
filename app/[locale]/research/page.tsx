import { getTranslations } from "next-intl/server";
import { AuditFigure } from "@/components/figure/audit-figure";
import { PaperList } from "@/components/research/paper-list";
import { ResearchWork } from "@/components/research/research-work";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageHero } from "@/components/ui/page-hero";
import { profile } from "@/data/profile";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/locale";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

const interests = ["health", "evaluation", "robotics", "twins"] as const;

export async function generateMetadata({ params }: Props) {
  const locale = await resolveLocale(params);
  const nav = await getTranslations({ locale, namespace: "Nav" });
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMeta({
    locale,
    path: "/research",
    title: nav("research"),
    description: meta("pages.research"),
  });
}

export default async function ResearchPage({ params }: Props) {
  await resolveLocale(params);
  const t = await getTranslations("ResearchHome");
  const page = await getTranslations("ResearchPage");
  const papers = await getTranslations("Papers");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={page("title")}
        serif={t("question")}
      />
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-16">
        <section
          aria-labelledby="thesis-title"
          className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-14"
        >
          <div className="min-w-0">
            <Eyebrow>{page("thesisEyebrow")}</Eyebrow>
            <h2 id="thesis-title" className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight text-pretty md:text-[28px]">
              {t("thesisBody")}
            </h2>
            {/* DRAFT: Khasim to review */}
            <div className="mt-5 max-w-[620px] space-y-4 leading-relaxed text-muted">
              <p>{page("thesisP1")}</p>
              <p>{page("thesisP2")}</p>
              <p>{page("thesisP3")}</p>
            </div>
          </div>
          <AuditFigure className="mx-auto w-full max-w-[480px] lg:max-w-none" />
        </section>

        <section className="mt-16" aria-labelledby="work-title">
          <Eyebrow>{page("workEyebrow")}</Eyebrow>
          <h2 id="work-title" className="type-h2 mt-3">
            {page("workTitle")}
          </h2>
          <div className="mt-8">
            <ResearchWork heading="h3" />
          </div>
          <Link
            href="/experience"
            className="mt-6 inline-block text-sm text-signal-ink hover:text-foreground"
          >
            {page("workMore")}
          </Link>
        </section>

        <section className="mt-16" aria-labelledby="interests-title">
          <Eyebrow>{page("interestsEyebrow")}</Eyebrow>
          <h2 id="interests-title" className="type-h2 mt-3">
            {page("interestsTitle")}
          </h2>
          <dl className="fact-list mt-8">
            {interests.map((key) => (
              <div key={key}>
                <dt>{page(`interests.${key}.label`)}</dt>
                <dd>{page(`interests.${key}.body`)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-16" aria-labelledby="reading-title">
          <Eyebrow>{papers("breakdowns")}</Eyebrow>
          <h2 id="reading-title" className="type-h2 mt-3">
            {page("readingTitle")}
          </h2>
          <p className="mt-3 max-w-[640px] text-muted">{papers("cadence")}</p>
          <div className="mt-8">
            <PaperList heading="h3" />
          </div>
        </section>

        <div className="mt-14 flex flex-wrap items-center gap-4 rounded-[14px] border border-border bg-surface p-5">
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink">
            {t("collab")}
          </p>
          <Button asChild>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              {t("linkedin")}
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
