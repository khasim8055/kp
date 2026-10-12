import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import type { JourneyStop } from "@/components/sections/journey-track";
import type { Status } from "@/components/ui/status-badge";
import { journeyStops } from "@/data/journey";
import { isUnfinishedValue } from "@/lib/unfinished";

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
  const stops: JourneyStop[] = journeyStops
    .map((stop) => {
      const status =
        "status" in stop ? (stop.status as Status) : undefined;
      return {
        id: stop.id,
        year: t(`stops.${stop.id}.year`),
        title: t(`stops.${stop.id}.title`),
        body: t(`stops.${stop.id}.body`),
        tag: status ? undefined : t(`stops.${stop.id}.tag`),
        status,
      };
    })
    .filter(
      (stop) =>
        !isUnfinishedValue(stop.year) &&
        !isUnfinishedValue(stop.title) &&
        !isUnfinishedValue(stop.body) &&
        stop.year !== "Next",
    );

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
