import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

const sectionIndex: Record<string, string> = {
  Problem: "01",
  Method: "02",
  "Key results": "03",
  "What I'd question": "04",
  "How I'd use it": "05",
  "Reproduce it": "06",
  "Related papers": "07",
};

type Hast = {
  type: string;
  tagName?: string;
  value?: string;
  children?: Hast[];
  properties?: { className?: string[] };
};

function nodeText(node: Hast): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(nodeText).join("");
}

function isH2(node: Hast | undefined) {
  return node?.type === "element" && node.tagName === "h2";
}

export function questionBlock() {
  return (tree: Hast) => {
    const children = tree.children;
    if (!children) return;
    const next: Hast[] = [];
    for (let i = 0; i < children.length; i += 1) {
      const node = children[i];
      if (!node) continue;
      const label = nodeText(node).replace(/[’‘]/g, "'").trim();
      if (isH2(node) && label === "What I'd question") {
        const block: Hast[] = [node];
        i += 1;
        while (i < children.length && !isH2(children[i])) {
          const child = children[i];
          if (child) block.push(child);
          i += 1;
        }
        i -= 1;
        next.push({
          type: "element",
          tagName: "div",
          properties: { className: ["question-block"] },
          children: block,
        });
      } else {
        next.push(node);
      }
    }
    tree.children = next;
  };
}

function headingLabel(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number")
    return String(children);
  if (Array.isArray(children)) return children.map(headingLabel).join("");
  return "";
}

function Heading({ children, ...props }: ComponentProps<"h2">) {
  const label = headingLabel(children).replace(/[’‘]/g, "'").trim();
  const number = sectionIndex[label];
  return (
    <h2
      className="mt-10 flex items-baseline gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.2em] text-signal-ink"
      {...props}
    >
      {number ? <span className="text-muted">{number}</span> : null}
      <span>{children}</span>
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
      <Link href={href} className="text-signal-ink">
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className="text-signal-ink"
      target="_blank"
      rel="noopener noreferrer"
    >
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
