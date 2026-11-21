import { Download } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cvFile } from "@/data/cv";
import { profile } from "@/data/profile";

/**
 * Centered hero. It has no picture of its own: the 3D agent world behind the
 * page shows through here at full strength.
 */
export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="no-veil relative -mt-20 flex min-h-[100svh] flex-col overflow-hidden"
    >
      <div className="hero-vignette" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-[900px] flex-1 flex-col items-center justify-center px-4 pb-28 pt-28 text-center">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 id="hero-title" className="type-h1 hero-name mt-5 text-balance">
          {profile.name}
        </h1>
        <p className="hero-open mt-5">
          <span className="hero-open-dot" aria-hidden="true" />
          {t("open")}
        </p>
        <p className="mt-6 font-serif text-[32px] italic leading-tight text-balance text-foreground sm:text-[40px] md:text-[50px]">
          {t("question")}
        </p>
        <p className="mt-5 max-w-[600px] text-muted md:text-lg">{t("line")}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <a href="#projects">{t("projects")}</a>
          </Button>
          {cvFile ? (
            <Button asChild variant="outline">
              <a href={cvFile} download>
                <Download className="h-4 w-4" aria-hidden />
                {t("cv")}
              </a>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <a href="#research">{t("research")}</a>
            </Button>
          )}
          <Button asChild variant="outline">
            <a href="#contact">{t("contact")}</a>
          </Button>
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
