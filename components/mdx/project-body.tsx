import type { ComponentProps } from "react";

function Heading(props: ComponentProps<"h2">) {
  return (
    <h2
      className="mt-12 font-display text-2xl font-bold tracking-tight"
      {...props}
    />
  );
}

function Paragraph(props: ComponentProps<"p">) {
  return <p className="mt-3 leading-relaxed" {...props} />;
}

function List(props: ComponentProps<"ul">) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed marker:text-signal" {...props} />
  );
}

function Anchor(props: ComponentProps<"a">) {
  return (
    <a
      className="text-signal-ink underline-offset-4 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
}

function TableWrap(props: ComponentProps<"table">) {
  return (
    <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Table">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  );
}

function Cell(props: ComponentProps<"td">) {
  return (
    <td className="border border-border px-3 py-2 align-top font-mono text-[13px]" {...props} />
  );
}

function HeadCell(props: ComponentProps<"th">) {
  return (
    <th
      scope="col"
      className="border border-border px-3 py-2 text-left font-mono text-[11px] font-normal uppercase tracking-[0.12em] text-muted"
      {...props}
    />
  );
}

export const projectMdxComponents = {
  h2: Heading,
  p: Paragraph,
  ul: List,
  a: Anchor,
  table: TableWrap,
  td: Cell,
  th: HeadCell,
};
