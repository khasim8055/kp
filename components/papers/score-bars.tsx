export function ScoreBars({
  rows,
}: {
  rows: { key: string; label: string; value: number }[];
}) {
  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.key}>
          <div className="mb-1 flex justify-between font-mono text-[11px] text-muted">
            <span>{row.label}</span>
            <span>{row.value}/5</span>
          </div>
          <svg
            viewBox="0 0 100 6"
            className="h-1.5 w-full"
            aria-hidden
            preserveAspectRatio="none"
          >
            <rect width="100" height="6" className="fill-border" />
            <rect width={(row.value / 5) * 100} height="6" className="fill-accent" />
          </svg>
        </li>
      ))}
    </ul>
  );
}
