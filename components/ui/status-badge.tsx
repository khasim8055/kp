import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type Status = "building" | "in-progress" | "shipped" | "ongoing" | "done";

const live: Record<Status, boolean> = {
  building: true,
  "in-progress": true,
  ongoing: true,
  shipped: false,
  done: false,
};

const messageKey = {
  building: "building",
  "in-progress": "inProgress",
  shipped: "shipped",
  ongoing: "ongoing",
  done: "done",
} as const;

/** Finished work is green and still. Work in progress is amber and pulses. */
export function StatusBadge({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  const t = useTranslations("Status");
  const isLive = live[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[12px]",
        isLive ? "text-signal-ink" : "text-pass-ink",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block h-1.5 w-1.5 rounded-full",
          isLive ? "status-pulse bg-signal" : "bg-pass",
        )}
        aria-hidden
      />
      {t(messageKey[status])}
    </span>
  );
}
