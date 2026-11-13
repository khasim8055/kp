import { getTranslations } from "next-intl/server";
import { AuditFigure } from "@/components/figure/audit-figure";
import { PaperList } from "@/components/research/paper-list";
import { ResearchWork } from "@/components/research/research-work";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { Link } from "@/i18n/navigation";

export async function Research({ index }: { index?: string }) {
  const t = await getTranslations("ResearchHome");
  const papers = await getTranslations("Papers");

  return (
    <>
      <SectionHeader
        id="research-title"
        index={index}
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12">
        <div className="border-l-2 border-signal pl-5 md:pl-7" data-reveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink">
            {t("coreEyebrow")}
          </p>
          {/* DRAFT: Khasim to review */}
          <p className="type-serif mt-3 text-balance">{t("question")}</p>
          <div className="mt-4 max-w-[620px] space-y-3 leading-relaxed text-muted">
            <p>{t("coreP1")}</p>
            <p>{t("coreP2")}</p>
          </div>
        </div>
        <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
          <AuditFigure className="mx-auto w-full max-w-[440px]" />
        </div>
      </div>
      <div className="mt-10">
        <ResearchWork />
      </div>
      <div className="mt-12">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="font-mono text-[12px] uppercase tracking-[0.2em] text-foreground">
            {papers("breakdowns")}
          </h3>
          <p className="text-sm text-muted">{papers("cadence")}</p>
        </div>
        <div className="mt-4">
          <PaperList limit={2} />
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/research">{t("more")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/papers">{papers("viewAll")}</Link>
        </Button>
      </div>
    </>
  );
}
