export function PageHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <header className="mb-8">
      <p className="font-mono text-xs text-accent">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-balance">
        {title}
      </h1>
    </header>
  );
}
