import { Eyebrow } from "@/components/ui/eyebrow";
import { plainEyebrow } from "@/lib/plain-eyebrow";
import { cn } from "@/lib/utils";

export { plainEyebrow } from "@/lib/plain-eyebrow";

export function PageHero({
  eyebrow,
  title,
  serif,
  width = "1100",
  children,
}: {
  eyebrow: string;
  title: string;
  serif?: string;
  width?: "1100" | "760";
  children?: React.ReactNode;
}) {
  return (
    <header className="relative -mt-20 border-b border-border">
      <div
        className={cn(
          "relative mx-auto px-4 pb-12 pt-32 md:pb-14 md:pt-36",
          width === "760" ? "max-w-[760px]" : "max-w-[1100px]",
        )}
      >
        <Eyebrow>{plainEyebrow(eyebrow)}</Eyebrow>
        <h1 className="type-h2 mt-4 text-balance">{title}</h1>
        {serif ? (
          <p className="mt-4 max-w-[36rem] text-balance font-serif text-[24px] italic leading-snug sm:text-[26px] md:text-[32px]">
            {serif}
          </p>
        ) : null}
        {children}
      </div>
      <div className="rule-ticks" aria-hidden="true" />
    </header>
  );
}
