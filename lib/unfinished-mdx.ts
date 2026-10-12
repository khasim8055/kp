import { isUnfinishedValue } from "@/lib/unfinished";

type Hast = {
  type: string;
  tagName?: string;
  value?: string;
  children?: Hast[];
  properties?: Record<string, unknown>;
};

const TODO_TOKEN = /\bTODO(?:_[A-Z0-9_]+)?\b/g;

function stripTodoTokens(text: string): string {
  return text
    .replace(TODO_TOKEN, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/^[\s.,;:!?]+/, "")
    .replace(/[\s.,;:!?]+$/, "")
    .trim();
}

function nodeText(node: Hast): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(nodeText).join("");
}

function isElement(node: Hast | undefined, tag?: string) {
  if (!node || node.type !== "element") return false;
  if (!tag) return true;
  return node.tagName === tag;
}

function cleanNode(node: Hast): Hast | null {
  if (node.type === "text") {
    const value = stripTodoTokens(node.value ?? "");
    if (!value) return null;
    return { ...node, value };
  }

  if (node.type !== "element") return node;

  if (isElement(node, "tr") && TODO_TOKEN.test(nodeText(node))) {
    return null;
  }

  const children = (node.children ?? [])
    .map(cleanNode)
    .filter((child): child is Hast => child != null);

  if (isElement(node, "p") || isElement(node, "li") || isElement(node, "td")) {
    if (isUnfinishedValue(nodeText({ ...node, children }))) return null;
  }

  if (
    children.length === 0 &&
    !["br", "hr", "img"].includes(node.tagName ?? "")
  ) {
    if (
      [
        "p",
        "li",
        "ul",
        "ol",
        "table",
        "thead",
        "tbody",
        "tr",
        "td",
        "th",
        "div",
      ].includes(node.tagName ?? "")
    ) {
      return null;
    }
  }

  return { ...node, children };
}

function dropEmptySections(nodes: Hast[]): Hast[] {
  const next: Hast[] = [];
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (!node) continue;
    if (isElement(node, "h2")) {
      const block: Hast[] = [];
      let j = i + 1;
      while (j < nodes.length && !isElement(nodes[j], "h2")) {
        const child = nodes[j];
        if (child) block.push(child);
        j += 1;
      }
      const hasBody = block.some((child) => !isUnfinishedValue(nodeText(child)));
      if (hasBody) {
        next.push(node, ...block);
      }
      i = j - 1;
      continue;
    }
    next.push(node);
  }
  return next;
}

/**
 * Strip unfinished TODO placeholders from MDX source before compile.
 * Handles raw HTML tables that rehype may not fully walk.
 */
export function stripUnfinishedSource(source: string): string {
  const withoutTodoRows = source
    .replace(
      /<tr>\s*<td>[^<]*<\/td>\s*<td>[^<]*TODO(?:_[A-Z0-9_]+)?[^<]*<\/td>\s*<\/tr>/gi,
      "",
    )
    .replace(
      /<tr>\s*<td>[^<]*TODO(?:_[A-Z0-9_]+)?[^<]*<\/td>\s*<td>[^<]*<\/td>\s*<\/tr>/gi,
      "",
    );

  const lines = withoutTodoRows.split("\n").map((line) => {
    if (/TODO(?:_[A-Z0-9_]+)?/.test(line) && isUnfinishedValue(stripTodoTokens(line))) {
      return "";
    }
    return line.replace(TODO_TOKEN, "").replace(/\s{2,}/g, " ").replace(/\s+$/g, "");
  });

  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Rehype plugin: drop unfinished TODO placeholders from MDX HTML trees. */
export function stripUnfinishedMdx() {
  return (tree: Hast) => {
    const cleaned = (tree.children ?? [])
      .map(cleanNode)
      .filter((child): child is Hast => child != null);
    tree.children = dropEmptySections(cleaned);
  };
}
