export function SectionHeading({
  id,
  eyebrow,
  title,
  action,
}: {
  id: string;
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="font-mono text-xs text-accent">{eyebrow}</p>
        <h2
          id={id}
          className="mt-2 text-2xl font-medium tracking-tight text-balance"
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
