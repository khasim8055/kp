import { cn } from "@/lib/utils";

export function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-border bg-surface-2 px-2 py-0.5 font-mono text-[12px] text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
