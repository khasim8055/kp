"use client";

import { useEffect, useState } from "react";

export function RoleLine({ roles }: { roles: string[] }) {
  const first = roles[0] ?? "";
  const [text, setText] = useState(first);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let role = 0;
    let index = 0;
    let deleting = false;
    let timer = 0;

    const tick = () => {
      const word = roles[role] ?? "";
      if (!deleting) {
        index += 1;
        setText(word.slice(0, index));
        if (index >= word.length) {
          deleting = true;
          timer = window.setTimeout(tick, 2500);
          return;
        }
        timer = window.setTimeout(tick, 55);
        return;
      }
      index -= 1;
      setText(word.slice(0, Math.max(0, index)));
      if (index <= 0) {
        deleting = false;
        role = (role + 1) % roles.length;
      }
      timer = window.setTimeout(tick, 36);
    };

    timer = window.setTimeout(tick, 500);
    return () => window.clearTimeout(timer);
  }, [roles]);

  return (
    <p className="mt-4 min-h-[1.6em] font-display text-xl tracking-tight md:text-2xl">
      <span className="sr-only">{first}</span>
      <span aria-hidden="true">
        {text}
        <span className="caret-blink ml-1 inline-block h-[0.9em] w-px translate-y-[1px] bg-signal" />
      </span>
    </p>
  );
}
