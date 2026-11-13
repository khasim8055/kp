import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { StatusBadge, type Status } from "@/components/ui/status-badge";

const items = [
  { key: "thesis", status: "in-progress" as Status },
  { key: "agents", status: "done" as Status },
  { key: "patterns", status: "done" as Status },
] as const;

/** The three pieces of research work, each with its real status. */
export async function ResearchWork({ heading = "h3" }: { heading?: "h2" | "h3" }) {
  const t = await getTranslations("ResearchHome");
  const Heading = heading;

  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {items.map((item, i) => (
        <li key={item.key} data-reveal style={{ "--i": i } as React.CSSProperties}>
          <Card className="h-full">
            <StatusBadge status={item.status} />
            <Heading className="mt-3 font-display text-lg font-bold tracking-tight">
              {t(`${item.key}Title`)}
            </Heading>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {t(`${item.key}Body`)}
            </p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
