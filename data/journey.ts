import type { Status } from "@/components/ui/status-badge";

/** Oldest first. Text lives in messages under Journey.stops.<id>. */
export const journeyStops: { id: string; status?: Status }[] = [
  { id: "btech" },
  { id: "coschool" },
  { id: "berlin" },
  { id: "research" },
  { id: "klindok", status: "done" },
  { id: "thesis", status: "in-progress" },
  { id: "kiko", status: "ongoing" },
];
