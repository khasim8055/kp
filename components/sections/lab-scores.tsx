"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

export type LabScore = {
  key: string;
  label: string;
  value: number | null;
};

export function LabScoreBars({
  rows,
  missing,
}: {
  rows: LabScore[];
  missing: string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.45"],
  });

  return (
    <ul ref={ref} className="space-y-4">
      {rows.map((row) => (
        <li key={row.key}>
          <div className="mb-1.5 flex justify-between gap-3 font-mono text-[11px] text-muted">
            <span>{row.label}</span>
            <span>{row.value === null ? missing : `${row.value}/5`}</span>
          </div>
          <div className="flex gap-1" aria-hidden>
            {Array.from({ length: 5 }, (_, index) => (
              <Segment
                key={index}
                index={index}
                value={row.value}
                progress={scrollYProgress}
                reduce={Boolean(reduce)}
              />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Segment({
  index,
  value,
  progress,
  reduce,
}: {
  index: number;
  value: number | null;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const lit = value !== null && index < value;
  const start = value ? index / value : 1;
  const end = value ? (index + 1) / value : 1;
  const scaleX = useTransform(progress, [start, end], [0, 1]);

  return (
    <span className="relative h-1.5 flex-1 overflow-hidden bg-border">
      {lit ? (
        reduce ? (
          <span className="absolute inset-0 bg-signal shadow-[0_0_8px_var(--signal)]" />
        ) : (
          <motion.span
            style={{ scaleX }}
            className="absolute inset-0 origin-left bg-signal shadow-[0_0_8px_var(--signal)]"
          />
        )
      ) : null}
    </span>
  );
}
