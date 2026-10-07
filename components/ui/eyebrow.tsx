import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink",
        className,
      )}
    >
      <span className="inline-block h-1.5 w-1.5 shrink-0 bg-signal" aria-hidden />
      {children}
    </p>
  );
}
