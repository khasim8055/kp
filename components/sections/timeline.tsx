import { getTranslations } from "next-intl/server";
import { GlowSpine } from "@/components/sections/glow-spine";
import { GlowCard } from "@/components/ui/glow-card";
import type { ExperienceItem } from "@/data/experience";

export async function Timeline({ items }: { items: ExperienceItem[] }) {
  const t = await getTranslations("Experience");

  return (
    <GlowSpine>
      {items.map((item) => (
        <li key={`${item.org}-${item.start}`} className="relative pl-8">
          <span
            className="absolute left-[3px] top-6 h-2 w-2 -translate-x-1/2 rounded-full bg-signal shadow-[0_0_8px_var(--signal)]"
            aria-hidden
          />
          <GlowCard>
            <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-signal-ink">
              {t("range", { start: item.start, end: item.end })} ·{" "}
              {item.location}
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">
              {item.role}
            </h3>
            <p className="mt-1 text-sm text-muted">{item.org}</p>
            <ul className="mt-4 space-y-3">
              {item.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal"
                    aria-hidden
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </GlowCard>
        </li>
      ))}
    </GlowSpine>
  );
}
