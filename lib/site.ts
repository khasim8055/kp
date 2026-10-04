export function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured && !configured.startsWith("TODO")) return configured;
  return "http://localhost:3000";
}

export function daysSince(isoDate: string, today = new Date()) {
  const start = Date.parse(`${isoDate}T00:00:00Z`);
  const end = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  if (Number.isNaN(start)) return 0;
  return Math.max(0, Math.round((end - start) / (24 * 60 * 60 * 1000)));
}

export function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
