import { cn } from "@/lib/utils";

export function DifficultyDots({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <span
      role="img"
      className="inline-flex items-center gap-1"
      aria-label={label}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          aria-hidden
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            index < value ? "bg-signal" : "border border-border",
          )}
        />
      ))}
    </span>
  );
}
