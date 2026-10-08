import { getTranslations } from "next-intl/server";
import { preload } from "react-dom";
import { NeuralSlot, PortraitSlot } from "@/components/sections/hero-canvas";
import { RoleLine } from "@/components/sections/role-line";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { profile } from "@/data/profile";

export async function Hero() {
  const t = await getTranslations("Hero");
  const roles = [t("role1"), t("role2"), t("role3"), t("role4")];
  preload("/profile-320.jpg", { as: "image", fetchPriority: "high" });

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
            "radial-gradient(ellipse at center, transparent 28%, var(--bg) 78%), linear-gradient(to bottom, transparent 42%, var(--bg) 100%)",
        }}
      />
      <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-[1100px] flex-1 flex-col items-center gap-10 px-4 pb-24 pt-28 md:flex-row md:items-center md:justify-between md:gap-12">
        <div className="w-full min-w-0 max-w-[640px]">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 id="hero-title" className="type-h1 mt-4 text-balance">
            {profile.name}
          </h1>
          <RoleLine roles={roles} />
          <p className="mt-5 font-serif text-[32px] italic leading-tight text-balance text-foreground sm:text-[40px] md:text-[44px]">
            {t("question")}
          </p>
          <p className="mt-4 max-w-[540px] text-muted">{t("line")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href="#research">{t("explore")}</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#projects">{t("built")}</a>
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="portrait-slot relative h-[220px] w-[220px] md:h-[320px] md:w-[320px]">
            {/* Plain img is the fallback for reduced motion, no JS, and screen readers. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/profile-640.jpg"
              srcSet="/profile-320.jpg 320w, /profile-640.jpg 640w"
              sizes="(max-width: 768px) 220px, 320px"
              alt={t("photoAlt")}
              width={320}
              height={320}
              fetchPriority="high"
              decoding="sync"
              className="portrait-photo absolute inset-0 h-full w-full object-cover"
            />
            <PortraitSlot />
          </div>
          <p className="mt-4 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-pass-ink">
            <span className="status-pulse inline-block h-1.5 w-1.5 rounded-full bg-pass" aria-hidden="true" />
            {t("online")}
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink">{t("scroll")}</span>
        <span className="scroll-cue-line" aria-hidden="true">
          <span className="scroll-cue-dot" />
        </span>
      </div>
    </section>
  );
}
