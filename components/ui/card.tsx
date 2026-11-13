import { cn } from "@/lib/utils";

/**
 * The site's card: a glowing panel that leans toward the pointer in 3D.
 * The tilt itself is driven by `Effects`, through the `data-tilt` attribute.
 * `tone="signal"` gives the amber edge used for the one card that matters most.
 */
export function Card({
  children,
  className,
  tone = "pulse",
  tilt = true,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "pulse" | "signal";
  tilt?: boolean;
}) {
  return (
    <div
      data-tilt={tilt ? "" : undefined}
      className={cn("card3d p-5", tone === "signal" && "card3d-signal", className)}
    >
      {children}
    </div>
  );
}
