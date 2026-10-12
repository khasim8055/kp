import { rejectUnfinished } from "@/lib/unfinished";

export type ResearchTrack = {
  id: string;
  name: string;
  progress: string;
};

/** Source list — unfinished progress is skipped at export. */
const allTracks: ResearchTrack[] = [];

/** Tracks with unfinished progress are skipped at render time. */
export const tracks = rejectUnfinished(allTracks, ["name", "progress"]);
