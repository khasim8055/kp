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
}: {
  cells: HeatCell[];
  label: string;
}) {
  return (
    <div className="overflow-x-auto">
      <p className="sr-only">{label}</p>
      <div className="flex w-max gap-1">
        {cells.map((cell) => {
          const className = cn(
            "h-6 w-6 border border-border",
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
            />
          );
        })}
      </div>
    </div>
  );
}
