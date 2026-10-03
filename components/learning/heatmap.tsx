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
    <div className="overflow-x-auto" role="img" aria-label={label}>
      <div className="flex w-max gap-1">
        {cells.map((cell) => {
          const className = cn(
            "h-3.5 w-3.5 border border-border",
            levelClass[cell.level],
          );
          if (!cell.slug) {
            return <span key={cell.start} title={cell.label} className={className} />;
          }
          return (
            <Link
              key={cell.start}
              href={`/learning/${cell.slug}`}
              title={cell.label}
              className={className}
            />
          );
        })}
      </div>
    </div>
  );
}
