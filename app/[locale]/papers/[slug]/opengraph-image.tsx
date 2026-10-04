import { ImageResponse } from "next/og";
import { getPaper } from "@/lib/content/papers";
import { isTodo } from "@/lib/utils";

export const alt = "Paper breakdown";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const paper = getPaper(slug);
  const title = paper?.title ?? "Paper";
  const verdict = paper && !isTodo(paper.verdict) ? paper.verdict : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAFAF9",
          color: "#1C1917",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 28, color: "#0F766E" }}>Khasim Bin Saleh</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 60, lineHeight: 1.15 }}>{title}</div>
          {verdict ? (
            <div
              style={{
                marginTop: 28,
                fontSize: 28,
                color: "#0F766E",
                border: "2px solid #0F766E",
                padding: "8px 16px",
                alignSelf: "flex-start",
              }}
            >
              {verdict}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size },
  );
}
