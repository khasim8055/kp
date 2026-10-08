export function KlindokFlow({
  notes,
  model,
  letter,
}: {
  notes: string;
  model: string;
  letter: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[340px]" aria-hidden="true">
      <svg viewBox="0 0 340 200" className="h-auto w-full overflow-visible">
        <defs>
          <marker
            id="flow-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--signal)" />
          </marker>
        </defs>
        <line
          x1="96"
          y1="108"
          x2="118"
          y2="108"
          stroke="color-mix(in srgb, var(--signal) 50%, transparent)"
          strokeWidth="2"
          markerEnd="url(#flow-arrow)"
        />
        <line
          x1="222"
          y1="108"
          x2="244"
          y2="108"
          stroke="color-mix(in srgb, var(--signal) 50%, transparent)"
          strokeWidth="2"
          markerEnd="url(#flow-arrow)"
        />
        <rect
          x="8"
          y="80"
          width="88"
          height="56"
          rx="12"
          fill="var(--surface-2)"
          stroke="var(--border)"
        />
        <rect
          x="134"
          y="80"
          width="88"
          height="56"
          rx="12"
          fill="var(--surface-2)"
          stroke="var(--border)"
        />
        <rect
          x="244"
          y="80"
          width="88"
          height="56"
          rx="12"
          fill="var(--surface-2)"
          stroke="var(--border)"
        />
        <circle r="4.5" fill="var(--signal)" className="flow-dot">
          <animateMotion dur="2.8s" repeatCount="indefinite" path="M52 108 H288" />
        </circle>
        <circle cx="170" cy="108" r="4.5" fill="var(--signal)" className="flow-dot-static" />
        <g transform="translate(178 36)">
          <rect
            x="-15"
            y="-2"
            width="30"
            height="24"
            rx="5"
            fill="var(--surface)"
            stroke="var(--pass)"
          />
          <path
            d="M-7 2 V-8 A7 7 0 0 1 7 -8 V2"
            fill="none"
            stroke="var(--pass)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="0" cy="11" r="2.5" fill="var(--pass)" />
        </g>
        <text
          x="52"
          y="112"
          textAnchor="middle"
          fill="var(--text)"
          fontSize="10"
          fontFamily="var(--font-mono)"
        >
          {notes}
        </text>
        <text
          x="178"
          y="112"
          textAnchor="middle"
          fill="var(--text)"
          fontSize="10"
          fontFamily="var(--font-mono)"
        >
          {model}
        </text>
        <text
          x="288"
          y="112"
          textAnchor="middle"
          fill="var(--text)"
          fontSize="10"
          fontFamily="var(--font-mono)"
        >
          {letter}
        </text>
      </svg>
    </div>
  );
}
