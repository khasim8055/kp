import type { ComponentProps } from "react";
import {
  CircleAlert,
  FlaskConical,
  Library,
  MessageCircleQuestion,
  Quote,
  Table,
  Workflow,
  Wrench,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

const icons: Record<string, typeof Quote> = {
  "TL;DR": Quote,
  Problem: CircleAlert,
  Method: Workflow,
  "Key results": Table,
  "What I'd question": MessageCircleQuestion,
  "How I'd use it": Wrench,
  "Reproduce it": FlaskConical,
  "Related papers": Library,
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
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed" {...props} />
  );
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

function TableWrap(props: ComponentProps<"table">) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  );
}

function Cell(props: ComponentProps<"td">) {
  return <td className="border border-border px-3 py-2 align-top" {...props} />;
}

function HeadCell(props: ComponentProps<"th">) {
  return (
    <th
      className="border border-border px-3 py-2 text-left font-mono text-[11px] font-normal text-muted"
      {...props}
    />
  );
}

export const paperMdxComponents = {
  h2: Heading,
  p: Paragraph,
  ul: List,
  a: Anchor,
  table: TableWrap,
  td: Cell,
  th: HeadCell,
};
