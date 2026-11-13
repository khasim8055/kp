import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  index,
  title,
  subtitle,
  serifLine,
  id,
  className,
}: {
  eyebrow: string;
  /** Section number, shown like a heading number in a paper. */
  index?: string;
  title: string;
  subtitle?: string;
  serifLine?: string;
  id?: string;
  className?: string;
}) {
  return (
    <header className={cn("max-w-[760px]", className)} data-reveal>
      <Eyebrow index={index}>{eyebrow}</Eyebrow>
      <h2 id={id} className="type-h2 mt-3 text-balance">
        {title}
      </h2>
      {serifLine ? <p className="type-serif mt-4 text-balance">{serifLine}</p> : null}
      {subtitle ? <p className="mt-3 text-muted">{subtitle}</p> : null}
    </header>
  );
}
