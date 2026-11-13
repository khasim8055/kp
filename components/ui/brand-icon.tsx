import type { IconDefinition } from "@fortawesome/free-brands-svg-icons";

/**
 * Draws an official brand mark from the Font Awesome brands package
 * (icons under CC BY 4.0). The marks themselves belong to their owners and
 * are only used to link to the matching profile.
 */
export function BrandIcon({ icon, className }: { icon: IconDefinition; className?: string }) {
  const [width, height, , , data] = icon.icon;
  const paths = Array.isArray(data) ? data : [data];
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
