import { getTranslations } from "next-intl/server";
import {
  JourneyTrack,
  type JourneyStop,
} from "@/components/sections/journey-track";
import { journeyStops } from "@/data/journey";

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
