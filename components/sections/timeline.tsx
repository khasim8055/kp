import { getTranslations } from "next-intl/server";
import type { ExperienceItem } from "@/data/experience";

export async function Timeline({ items }: { items: ExperienceItem[] }) {
  const t = await getTranslations("Experience");

  return (
    <ol className="space-y-8 border-l border-border pl-5">
      {items.map((item) => (
        <li key={`${item.org}-${item.start}`} className="relative">
          <span
            className="absolute -left-[23px] top-1.5 h-2 w-2 border border-accent bg-background"
            aria-hidden
          />
          <p className="font-mono text-[11px] text-muted">
            {t("range", { start: item.start, end: item.end })} · {item.location}
          </p>
          <h3 className="mt-1 font-medium">{item.role}</h3>
          <p className="text-sm text-muted">{item.org}</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed">
            {item.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
