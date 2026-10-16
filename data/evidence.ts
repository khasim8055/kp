import { isUnfinishedValue } from "@/lib/unfinished";

export type EvidenceItem = {
  id: string;
  type: "video" | "image";
  src: string;
  /** Optional poster for video. */
  poster?: string;
  /** Message key under Evidence.items.<id>.title */
  titleKey: string;
};

const allEvidence: EvidenceItem[] = [
  {
    id: "recording-01",
    type: "video",
    src: "/evidence/recording-01.mp4",
    titleKey: "recording01",
  },
];

/** Drop items with missing media or unfinished title keys. */
export const evidenceItems = allEvidence.filter(
  (item) => !isUnfinishedValue(item.src) && !isUnfinishedValue(item.titleKey),
);
