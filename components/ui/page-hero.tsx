import { LazyNeuralField } from "@/components/ui/lazy-neural-field";
import { Eyebrow } from "@/components/ui/eyebrow";
import { plainEyebrow } from "@/lib/plain-eyebrow";
import { cn } from "@/lib/utils";

export { plainEyebrow } from "@/lib/plain-eyebrow";

export function PageHero({
  eyebrow,
  title,
  serif,
  width = "1100",
}: {
  eyebrow: string;
  title: string;
  serif: string;
  width?: "1100" | "760";
}) {
  return (
    <header className="relative -mt-20 overflow-hidden border-b border-border">
      <LazyNeuralField density={0.45} still />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/25 via-background/72 to-background" />
      <div
        className={cn(
          "relative mx-auto px-4 pb-14 pt-32 md:pb-16 md:pt-36",
          width === "760" ? "max-w-[760px]" : "max-w-[1100px]",
        )}
      >
        <Eyebrow>{plainEyebrow(eyebrow)}</Eyebrow>
        <h1 className="type-h2 mt-4 text-balance">{title}</h1>
        <p className="mt-4 max-w-[36rem] text-balance font-serif text-[24px] italic leading-snug sm:text-[26px] md:text-[32px]">
          {serif}
        </p>
      </div>
    </header>
  );
}
