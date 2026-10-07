import { getTranslations } from "next-intl/server";
import { GlowCard } from "@/components/ui/glow-card";
import { Readout } from "@/components/ui/readout";
import { SectionHeader } from "@/components/ui/section-header";

export async function About() {
  const t = await getTranslations("About");

  return (
    <>
      <SectionHeader id="about-title" eyebrow={t("eyebrow")} title={t("title")} />
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
        {/* DRAFT: Khasim to review */}
        <div className="max-w-[640px] space-y-4 leading-relaxed text-muted">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-3">
            <GlowCard>
              <Readout value="2+" label={t("years")} />
            </GlowCard>
            <GlowCard>
              <Readout value="1,000+" label={t("users")} />
            </GlowCard>
            <GlowCard>
              <Readout value={1} label={t("patent")} />
            </GlowCard>
            <GlowCard>
              <Readout value={3} label={t("languages")} />
            </GlowCard>
          </div>
          <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
            {t("languagesLine")}
          </p>
        </div>
      </div>
    </>
  );
}
