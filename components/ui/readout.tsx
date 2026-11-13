import { cn } from "@/lib/utils";

/** A measured value with its label. Static on purpose: numbers do not animate. */
export function Readout({
  value,
  label,
  className,
}: {
  value: number | string;
  label: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className={cn("font-mono text-[26px] leading-none text-signal sm:text-[30px]")}>
        {value}
      </p>
      <p className="mt-2 break-words font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
    </div>
  );
}
