import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import type { JourneyStop } from "@/components/sections/journey-track";
import { journeyStops } from "@/data/journey";

const JourneyTrack = dynamic(
  () =>
    import("@/components/sections/journey-track").then((mod) => mod.JourneyTrack),
  {
    loading: () => (
      <section
        id="journey"
        className="min-h-[50vh] border-t border-border"
        aria-labelledby="journey-title"
      >
        <div className="mx-auto max-w-[1100px] px-4 py-14">
          <div className="h-8 w-40 bg-border/60" />
          <div className="mt-4 h-12 w-72 max-w-full bg-border/40" />
        </div>
      </section>
    ),
  },
);

export async function Journey() {
  const t = await getTranslations("Journey");
  const stops: JourneyStop[] = journeyStops.map((stop) => ({
    id: stop.id,
    year: t(`stops.${stop.id}.year`),
    title: t(`stops.${stop.id}.title`),
    body: t(`stops.${stop.id}.body`),
    tag: "status" in stop ? undefined : t(`stops.${stop.id}.tag`),
    status: "status" in stop ? stop.status : undefined,
  }));

  return (
    <JourneyTrack
      eyebrow={t("eyebrow")}
      title={t("title")}
      serif={t("serif")}
      fullLabel={t("full")}
      stops={stops}
    />
  );
}
