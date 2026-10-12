import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { HeatCell } from "@/lib/content/learning-shared";

const levelClass = {
  0: "bg-transparent",
  1: "bg-accent/30",
  2: "bg-accent/50",
  3: "bg-accent/70",
  4: "bg-accent",
} as const;

export function LearningHeatmap({
  cells,
  label,
  compact = false,
}: {
  cells: HeatCell[];
  label: string;
  compact?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <p className="sr-only">{label}</p>
      <div className={cn("flex w-max", compact ? "gap-0.5" : "gap-1")}>
        {cells.map((cell) => {
          const className = cn(
            "border border-border",
            compact ? "h-3.5 w-3.5" : "h-6 w-6",
            levelClass[cell.level],
          );
          if (!cell.slug) {
            return <span key={cell.start} className={className} aria-hidden />;
          }
          return (
            <Link
              key={cell.start}
              href={`/learning/${cell.slug}`}
              aria-label={cell.label}
              title={cell.label}
              className={className}
            >
              <span className="sr-only">{cell.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
