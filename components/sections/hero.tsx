import { getTranslations } from "next-intl/server";
import { NeuralSlot } from "@/components/sections/hero-canvas";
import { RoleLine } from "@/components/sections/role-line";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { profile } from "@/data/profile";

export async function Hero() {
  const t = await getTranslations("Hero");
  const roles = [t("role1"), t("role2"), t("role3"), t("role4")];

  return (
    <section
      aria-labelledby="hero-title"
      className="relative -mt-20 flex min-h-[100svh] flex-col overflow-hidden bg-background"
    >
      <NeuralSlot defer />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, transparent 18%, var(--bg) 72%), linear-gradient(to bottom, transparent 50%, var(--bg) 100%)",
        }}
      />
      <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-[1100px] flex-1 flex-col justify-center px-4 pb-28 pt-28">
        <div className="w-full min-w-0 max-w-[720px]">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 id="hero-title" className="type-h1 mt-4 text-balance">
            {profile.name}
          </h1>
          <RoleLine roles={roles} />
          <p className="mt-6 font-serif text-[32px] italic leading-tight text-balance text-foreground sm:text-[40px] md:text-[48px]">
            {t("question")}
          </p>
          <p className="mt-5 max-w-[540px] text-muted md:text-lg">{t("line")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild>
              <a href="#research">{t("explore")}</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#projects">{t("built")}</a>
            </Button>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink">
          {t("scroll")}
        </span>
        <span className="scroll-cue-line" aria-hidden="true">
          <span className="scroll-cue-dot" />
        </span>
      </div>
    </section>
  );
}
