"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type Status = "building" | "in-progress" | "shipped" | "ongoing" | "done";

const dotClass: Record<Status, string> = {
  building: "bg-signal status-pulse",
  "in-progress": "bg-signal status-pulse",
  shipped: "bg-pass",
  ongoing: "bg-pass",
  done: "bg-pass",
};

const textClass: Record<Status, string> = {
  building: "text-signal-ink",
  "in-progress": "text-signal-ink",
  shipped: "text-pass-ink",
  ongoing: "text-pass-ink",
  done: "text-pass-ink",
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
