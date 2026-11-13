import { getTranslations } from "next-intl/server";
import { AuditFigure } from "@/components/figure/audit-figure";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { profile } from "@/data/profile";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative -mt-20 overflow-hidden bg-background"
    >
      <div className="mx-auto grid w-full min-w-0 max-w-[1100px] items-center gap-10 px-4 pb-14 pt-32 lg:min-h-[100svh] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-12 lg:pb-20 lg:pt-28">
        <div className="min-w-0">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 id="hero-title" className="type-h1 mt-4 text-balance">
            {profile.name}
          </h1>
          <p className="mt-6 font-serif text-[32px] italic leading-tight text-balance text-foreground sm:text-[40px] lg:text-[46px]">
            {t("question")}
          </p>
          <p className="mt-5 max-w-[560px] text-muted md:text-lg">{t("line")}</p>
          <p className="mt-4 max-w-[560px] border-l-2 border-border pl-4 text-sm leading-relaxed text-muted">
            {t("now")}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild>
              <a href="#projects">{t("projects")}</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#research">{t("research")}</a>
            </Button>
            <Button asChild variant="ghost">
              <a href="#contact">{t("contact")}</a>
            </Button>
          </div>
        </div>
        <AuditFigure priority className="mx-auto w-full max-w-[520px] lg:max-w-none" />
      </div>
      <div className="rule-ticks" aria-hidden="true" />
    </section>
  );
}
