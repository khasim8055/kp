import { getTranslations } from "next-intl/server";
import { AuditLive } from "@/components/figure/audit-live";
import {
  AUDIT_CAMERA,
  AUDIT_POSE,
  axisTicks,
  buildAuditData,
  depthFade,
  frameEdges,
  projectPoint,
} from "@/lib/audit-field";
import { cn } from "@/lib/utils";

const SIZE = 520;

function toSvg(x: number, y: number, z: number) {
  const p = projectPoint(x, y, z, AUDIT_POSE.yaw, AUDIT_POSE.pitch, 1);
  return {
    x: Math.round((p.x * 0.5 + 0.5) * SIZE * 10) / 10,
    y: Math.round((1 - (p.y * 0.5 + 0.5)) * SIZE * 10) / 10,
    depth: AUDIT_CAMERA.distance / p.w,
    w: p.w,
  };
}

/**
 * The hero figure: synthetic records next to the real records they came from.
 *
 * The SVG below is the complete figure. It is what the visitor sees first, and
 * what stays when WebGL is unavailable or reduced motion is requested. The
 * WebGL layer loads afterwards and takes over with the same data and pose.
 */
export async function AuditFigure({
  className,
  priority = false,
}: {
  className?: string;
  /** Start the WebGL layer without waiting for the figure to scroll into view. */
  priority?: boolean;
}) {
  const t = await getTranslations("Figure");
  const data = buildAuditData();
  const realCount = data.real.length / 3;
  const synthCount = data.synth.length / 3;

  const reals = Array.from({ length: realCount }, (_, i) =>
    toSvg(data.real[i * 3] ?? 0, data.real[i * 3 + 1] ?? 0, data.real[i * 3 + 2] ?? 0),
  );
  const synths = Array.from({ length: synthCount }, (_, i) =>
    toSvg(data.synth[i * 3] ?? 0, data.synth[i * 3 + 1] ?? 0, data.synth[i * 3 + 2] ?? 0),
  );
  const matched = new Set(
    data.flagged.flatMap((isFlagged, i) => (isFlagged ? [data.nearest[i] ?? 0] : [])),
  );
  const line = (seg: number[]) => {
    const a = toSvg(seg[0] ?? 0, seg[1] ?? 0, seg[2] ?? 0);
    const b = toSvg(seg[3] ?? 0, seg[4] ?? 0, seg[5] ?? 0);
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  };

  // The SVG is written as one string. It holds about 200 shapes, and as a
  // string React treats it as a single node instead of hydrating each shape.
  const n = (value: number) => Math.round(value * 10) / 10;
  const o = (value: number) => Math.round(value * 100) / 100;
  const seg = (l: { x1: number; y1: number; x2: number; y2: number }) =>
    `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}"/>`;
  const svg = [
    `<svg viewBox="0 0 ${SIZE} ${SIZE}" focusable="false" xmlns="http://www.w3.org/2000/svg">`,
    `<g stroke="var(--muted)" stroke-width="1" fill="none">`,
    `<g opacity="0.42">${frameEdges().map((edge) => seg(line(edge))).join("")}</g>`,
    `<g opacity="0.8">${axisTicks().map((tick) => seg(line(tick))).join("")}</g>`,
    `</g>`,
    `<g stroke="var(--signal)" stroke-width="1" opacity="0.6">`,
    data.flagged
      .map((isFlagged, i) => {
        const s = synths[i];
        const r = reals[data.nearest[i] ?? 0];
        return isFlagged && s && r ? seg({ x1: s.x, y1: s.y, x2: r.x, y2: r.y }) : "";
      })
      .join(""),
    `</g>`,
    `<g fill="none" stroke-width="1.3">`,
    reals
      .map((p, i) => {
        const hit = matched.has(i);
        return `<circle cx="${p.x}" cy="${p.y}" r="${n(5 * p.depth)}" stroke="var(${hit ? "--signal" : "--text"})" opacity="${o(depthFade(p.w) * (hit ? 1 : 0.62))}"/>`;
      })
      .join(""),
    `</g>`,
    `<g>`,
    synths
      .map((p, i) => {
        const hit = Boolean(data.flagged[i]);
        return `<circle cx="${p.x}" cy="${p.y}" r="${n(3.1 * p.depth * (hit ? 1.4 : 1))}" fill="var(${hit ? "--signal" : "--pulse"})" opacity="${o(depthFade(p.w) * (hit ? 1 : 0.85))}"/>`;
      })
      .join(""),
    `</g>`,
    `</svg>`,
  ].join("");

  return (
    <figure className={cn("audit-figure", className)}>
      <div
        data-audit
        className="audit-stage"
        role="img"
        aria-label={t("alt", {
          flagged: data.flaggedCount,
          total: synthCount,
        })}
      >
        <div
          className="audit-svg"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <AuditLive
          priority={priority}
          labels={{
            record: t("record"),
            tooClose: t("tooClose"),
            farEnough: t("farEnough"),
          }}
        />
      </div>
      <figcaption className="audit-caption">
        <p className="audit-caption-title">{t("title")}</p>
        <p>{t("caption")}</p>
        <ul className="audit-legend">
          <li>
            <span className="audit-key audit-key-ring" aria-hidden="true" />
            {t("legendReal")}
          </li>
          <li>
            <span className="audit-key audit-key-dot" aria-hidden="true" />
            {t("legendSynth")}
          </li>
          <li>
            <span className="audit-key audit-key-flag" aria-hidden="true" />
            {t("legendFlag", { flagged: data.flaggedCount, total: synthCount })}
          </li>
        </ul>
        <p className="audit-note">
          <span className="audit-hint">{t("hint")} </span>
          {t("note")}
        </p>
      </figcaption>
    </figure>
  );
}
