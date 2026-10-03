import type { ComponentProps } from "react";
import { ArrowRight, CircleHelp, Hammer, Lightbulb } from "lucide-react";
import { Link } from "@/i18n/navigation";

const icons: Record<string, typeof Lightbulb> = {
  "What I learned": Lightbulb,
  "What I built or tried": Hammer,
  "What confused me": CircleHelp,
  "Next week": ArrowRight,
};

function Heading({ children, ...props }: ComponentProps<"h2">) {
  const label = typeof children === "string" ? children : "";
  const Icon = icons[label];
  return (
    <h2
      className="mt-10 flex items-center gap-2 text-xl font-medium tracking-tight"
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden /> : null}
      {children}
    </h2>
  );
}

function Paragraph(props: ComponentProps<"p">) {
  return <p className="mt-3 leading-relaxed" {...props} />;
}

function List(props: ComponentProps<"ul">) {
  return <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed" {...props} />;
}

function Anchor({ href = "", children }: ComponentProps<"a">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className="text-accent">
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className="text-accent" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export const learningMdxComponents = {
  h2: Heading,
  p: Paragraph,
  ul: List,
  a: Anchor,
};
