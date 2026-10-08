export function ScoreBars({
  rows,
}: {
  rows: { key: string; label: string; value: number }[];
}) {
  return (
    <ul className="space-y-4">
      {rows.map((row) => (
        <li key={row.key}>
          <div className="mb-2 flex justify-between font-mono text-[12px] uppercase tracking-[0.16em] text-muted">
            <span>{row.label}</span>
            <span className="text-signal-ink">{row.value}/5</span>
          </div>
          <div className="flex gap-1" aria-hidden>
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={
                  index < row.value
                    ? "h-1.5 flex-1 bg-signal"
                    : "h-1.5 flex-1 bg-border"
                }
              />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
