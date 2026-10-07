"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type Status = "building" | "in-progress" | "shipped" | "ongoing" | "done";

const dotClass: Record<Status, string> = {
  building: "bg-accent status-pulse",
  "in-progress": "bg-warn status-pulse",
  shipped: "bg-accent-2",
  ongoing: "bg-accent-2",
  done: "bg-accent-2",
};

const textClass: Record<Status, string> = {
  building: "text-accent-ink",
  "in-progress": "text-warn-ink",
  shipped: "text-accent-2-ink",
  ongoing: "text-accent-2-ink",
  done: "text-accent-2-ink",
};

const messageKey = {
  building: "building",
  "in-progress": "inProgress",
  shipped: "shipped",
  ongoing: "ongoing",
  done: "done",
} as const;

export function StatusBadge({ status }: { status: Status }) {
  const t = useTranslations("Status");

  return (
    <span className={cn("inline-flex items-center gap-2 font-mono text-[12px]", textClass[status])}>
      <span className={cn("inline-block h-1.5 w-1.5 rounded-full", dotClass[status])} aria-hidden />
      {t(messageKey[status])}
    </span>
  );
}
