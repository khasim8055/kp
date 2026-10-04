import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/lib/locale";

export const alt = "Khasim Bin Saleh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Meta" });

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
          <div style={{ fontSize: 72, lineHeight: 1.1 }}>{t("title")}</div>
          <div style={{ marginTop: 24, fontSize: 32, color: "#78716C" }}>
            {t("description")}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
