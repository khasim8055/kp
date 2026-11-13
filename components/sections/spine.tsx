/** A vertical rule with one marker per entry. Used by the experience timeline. */
export function Spine({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute bottom-3 left-[3px] top-3 w-px bg-border" aria-hidden />
      <ol className="space-y-8">{children}</ol>
    </div>
  );
}

export function SpineItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative pl-8">
      <span
        className="absolute left-[3px] top-6 h-2 w-2 -translate-x-1/2 rounded-full bg-signal"
        aria-hidden
      />
      {children}
    </li>
  );
}
