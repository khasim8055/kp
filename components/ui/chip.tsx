import { cn } from "@/lib/utils";

export function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-border px-2 py-0.5 font-mono text-[11px] leading-5 text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
