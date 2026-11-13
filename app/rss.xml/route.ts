import { getPapers } from "@/lib/content/papers";
import { siteUrl, xmlEscape } from "@/lib/site";
import { isTodo } from "@/lib/utils";

export function GET() {
  const base = siteUrl();
  const items = getPapers()
    .map((paper) => ({
      title: paper.title,
      link: `${base}/papers/${paper.slug}`,
      date: isTodo(paper.date) ? "" : paper.date,
      description: isTodo(paper.tldr) ? paper.title : paper.tldr,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>Khasim Bin Saleh</title>
<link>${xmlEscape(base)}</link>
<description>Paper breakdowns by Khasim Bin Saleh, published whenever one is ready.</description>
${items
  .map(
    (item) => `<item>
<title>${xmlEscape(item.title)}</title>
<link>${xmlEscape(item.link)}</link>
<guid>${xmlEscape(item.link)}</guid>
<description>${xmlEscape(item.description)}</description>
${item.date ? `<pubDate>${new Date(`${item.date}T00:00:00Z`).toUTCString()}</pubDate>` : ""}
</item>`,
  )
  .join("")}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
