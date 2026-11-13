import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { AUDIT_POSE, buildAuditData, projectPoint } from "@/lib/audit-field";
import { resolveLocale } from "@/lib/locale";

export const alt = "Khasim Bin Saleh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FIELD = 520;

function place(x: number, y: number, z: number) {
  const p = projectPoint(x, y, z, AUDIT_POSE.yaw, AUDIT_POSE.pitch, 1);
  return {
    left: (p.x * 0.5 + 0.5) * FIELD,
    top: (1 - (p.y * 0.5 + 0.5)) * FIELD,
  };
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Hero" });
  const data = buildAuditData();
  const rings = Array.from({ length: data.real.length / 3 }, (_, i) =>
    place(data.real[i * 3] ?? 0, data.real[i * 3 + 1] ?? 0, data.real[i * 3 + 2] ?? 0),
  );
  const dots = Array.from({ length: data.synth.length / 3 }, (_, i) => ({
    ...place(data.synth[i * 3] ?? 0, data.synth[i * 3 + 1] ?? 0, data.synth[i * 3 + 2] ?? 0),
    flagged: Boolean(data.flagged[i]),
  }));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#07090a",
          color: "#eef2f0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 660,
            padding: "68px 0 68px 72px",
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#f5b947" }}>
            {t("eyebrow")}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2 }}>
              Khasim Bin Saleh
            </div>
            <div style={{ marginTop: 26, fontSize: 38, lineHeight: 1.2, color: "#eef2f0" }}>
              {t("question")}
            </div>
          </div>
          <div style={{ fontSize: 22, color: "#8d9893" }}>khasimsaleh.com</div>
        </div>
        <div
          style={{
            display: "flex",
            position: "relative",
            width: FIELD,
            height: FIELD,
            marginTop: 55,
          }}
        >
          {rings.map((p, i) => (
            <div
              key={`r${i}`}
              style={{
                position: "absolute",
                left: p.left - 6,
                top: p.top - 6,
                width: 12,
                height: 12,
                borderRadius: 12,
                border: "2px solid rgba(238, 242, 240, 0.55)",
              }}
            />
          ))}
          {dots.map((p, i) => (
            <div
              key={`d${i}`}
              style={{
                position: "absolute",
                left: p.left - (p.flagged ? 6 : 4),
                top: p.top - (p.flagged ? 6 : 4),
                width: p.flagged ? 12 : 8,
                height: p.flagged ? 12 : 8,
                borderRadius: 12,
                background: p.flagged ? "#f5b947" : "#7c9cff",
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
