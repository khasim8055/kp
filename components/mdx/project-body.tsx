import type { ComponentProps } from "react";

function Heading(props: ComponentProps<"h2">) {
  return (
    <h2
      className="mt-10 font-display text-2xl font-bold tracking-tight"
      {...props}
    />
  );
}

function Paragraph(props: ComponentProps<"p">) {
  return <p className="mt-3 leading-relaxed" {...props} />;
}

function List(props: ComponentProps<"ul">) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed" {...props} />
  );
}

function Anchor(props: ComponentProps<"a">) {
  return (
    <a
      className="text-signal-ink"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
}

export const projectMdxComponents = {
  h2: Heading,
  p: Paragraph,
  ul: List,
  a: Anchor,
};
