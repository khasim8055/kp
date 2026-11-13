"use client";

import { useEffect, useState } from "react";

/**
 * Types and deletes each role in turn. The moving text is decoration:
 * screen readers get the full list once, and reduced motion shows the
 * first role without typing.
 */
export function RoleLine({ roles }: { roles: string[] }) {
  const first = roles[0] ?? "";
  const [text, setText] = useState(first);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let role = 0;
    let index = first.length;
    let deleting = true;
    let timer = 0;

    const tick = () => {
      const word = roles[role] ?? "";
      if (!deleting) {
        index += 1;
        setText(word.slice(0, index));
        if (index >= word.length) {
          deleting = true;
          timer = window.setTimeout(tick, 2200);
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
      timer = window.setTimeout(tick, 34);
    };

    timer = window.setTimeout(tick, 2200);
    return () => window.clearTimeout(timer);
  }, [first, roles]);

  return (
    <p className="mt-4 min-h-[1.6em] font-display text-xl tracking-tight md:text-2xl">
      <span className="sr-only">{roles.join(", ")}</span>
      <span aria-hidden="true">
        {text}
        <span className="caret-blink ml-1 inline-block h-[0.9em] w-px translate-y-[2px] bg-signal" />
      </span>
    </p>
  );
}
