import { getTranslations } from "next-intl/server";
import { GlowCard } from "@/components/ui/glow-card";
import { SectionHeader } from "@/components/ui/section-header";
import { evidenceItems } from "@/data/evidence";
import { isUnfinishedValue } from "@/lib/unfinished";

export async function Evidence() {
  const t = await getTranslations("Evidence");
  const items = evidenceItems
    .map((item) => {
      const title = t(`items.${item.titleKey}`);
      return { ...item, title };
    })
    .filter((item) => !isUnfinishedValue(item.title));

  if (items.length === 0) return null;

  return (
    <>
      <SectionHeader
        id="evidence-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.id} className={items.length === 1 ? "md:col-span-2" : undefined}>
            <GlowCard className="overflow-hidden p-0">
              {item.type === "video" ? (
                <video
                  className="aspect-video w-full bg-black object-contain"
                  controls
                  playsInline
                  preload="metadata"
                  poster={item.poster}
                  aria-label={item.title}
                >
                  <source src={item.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={item.src}
                  alt={item.title}
                  className="aspect-video w-full object-cover"
                />
              )}
              <p className="border-t border-border px-4 py-3 font-mono text-[12px] uppercase tracking-[0.16em] text-muted">
                {item.title}
              </p>
            </GlowCard>
          </li>
        ))}
      </ul>
    </>
  );
}
