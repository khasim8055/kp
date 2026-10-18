import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FlowBoxVariant = "default" | "amber" | "red";

const boxVariantClass: Record<FlowBoxVariant, string> = {
  default: "border-border bg-surface text-foreground",
  amber: "border-signal/60 bg-signal/15 text-signal-ink",
  red: "border-[#e85d5d]/60 bg-[#e85d5d]/15 text-[#b42318] dark:text-[#f5b5b0]",
};

export function FlowBox({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: FlowBoxVariant;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border px-3 py-2 text-sm leading-snug",
        boxVariantClass[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FlowArrow({ label }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center gap-1 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted"
      aria-hidden
    >
      {label ? <span>{label}</span> : null}
      <span className="text-signal-ink">↓</span>
    </div>
  );
}

export function FlowLane({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 border border-border bg-background/40 p-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal-ink">
        {label}
      </p>
      <div className="flex flex-col items-stretch gap-2">{children}</div>
    </div>
  );
}

export function FlowSplit({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 md:gap-4">{children}</div>
  );
}

export function FlowStep({
  n,
  children,
  variant = "default",
}: {
  n?: number;
  children: ReactNode;
  variant?: FlowBoxVariant;
}) {
  return (
    <div className="flex gap-3">
      {typeof n === "number" ? (
        <span className="mt-2 w-5 shrink-0 font-mono text-[11px] text-muted">
          {n}.
        </span>
      ) : null}
      <FlowBox variant={variant} className="min-w-0 flex-1">
        {children}
      </FlowBox>
    </div>
  );
}

export function FlowDiagram({
  title,
  caption,
  note,
  children,
}: {
  title?: string;
  caption?: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <figure className="mt-6 border border-border bg-surface-2/40 p-4 md:p-5">
      {title ? (
        <figcaption className="font-mono text-[12px] uppercase tracking-[0.18em] text-signal-ink">
          {title}
        </figcaption>
      ) : null}
      <div className={cn("flex flex-col gap-2", title ? "mt-4" : undefined)}>
        {children}
      </div>
      {note ? (
        <p className="mt-4 border-t border-border pt-3 text-sm leading-relaxed text-muted">
          {note}
        </p>
      ) : null}
      {caption ? (
        <p className="mt-3 text-sm leading-relaxed text-muted italic">
          {caption}
        </p>
      ) : null}
    </figure>
  );
}
