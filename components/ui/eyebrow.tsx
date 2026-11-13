import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index?: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink",
        className,
      )}
    >
      {index ? (
        <span className="text-muted" aria-hidden>
          {index}
        </span>
      ) : (
        <span className="inline-block h-1.5 w-1.5 shrink-0 bg-signal" aria-hidden />
      )}
      {children}
    </p>
  );
}
