"use client";

import { ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge, type Status } from "@/components/ui/status-badge";
import { Tag } from "@/components/ui/tag";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type JourneyStop = {
  id: string;
  year: string;
  title: string;
  body: string;
  tag?: string;
  status?: Status;
};

export function JourneyTrack({
  eyebrow,
  title,
  serif,
  fullLabel,
  stops,
}: {
  eyebrow: string;
  title: string;
  serif: string;
  fullLabel: string;
  stops: JourneyStop[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: pinProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: lineProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.35"],
  });

  return (
    <section
      ref={sectionRef}
      id="journey"
      aria-labelledby="journey-title"
      className="journey-pin border-t border-border"
    >
      <div className="journey-sticky py-14 md:py-0">
        <div className="mx-auto w-full max-w-[1100px] px-4">
          <SectionHeader
            id="journey-title"
            eyebrow={eyebrow}
            title={title}
            serifLine={serif}
          />
        </div>
        <div className="journey-vertical mx-auto mt-10 w-full max-w-[1100px] px-4 md:hidden">
          <VerticalTimeline stops={stops} progress={lineProgress} />
          <FullExperience label={fullLabel} className="mt-8" />
        </div>
        <div className="journey-horizontal mt-12 hidden w-full min-w-0 md:block">
          <HorizontalTrack stops={stops} progress={pinProgress} />
          <div className="mx-auto mt-8 w-full max-w-[1100px] px-4">
            <FullExperience label={fullLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FullExperience({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Link
      href="/experience"
      className={cn(
        "inline-flex items-center gap-2 text-sm text-signal-ink hover:text-foreground",
        className,
      )}
    >
      {label}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}

function JourneyCard({ stop }: { stop: JourneyStop }) {
  return (
    <GlowCard className="flex h-full min-h-[220px] flex-col">
      <p className="font-mono text-[13px] text-signal-ink">{stop.year}</p>
      <h3 className="mt-3 font-display text-xl font-bold leading-tight tracking-tight text-pretty">
        {stop.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {stop.body}
      </p>
      <div className="mt-4">
        {stop.status ? (
          <StatusBadge status={stop.status} />
        ) : (
          <Tag>{stop.tag}</Tag>
        )}
      </div>
    </GlowCard>
  );
}

function JourneyNode({
  progress,
  threshold,
}: {
  progress: MotionValue<number>;
  threshold: number;
}) {
  const [lit, setLit] = useState(threshold <= 0);

  useEffect(() => {
    const update = (value: number) => {
      setLit(value >= Math.max(0, threshold - 0.001));
    };
    update(progress.get());
    return progress.on("change", update);
  }, [progress, threshold]);

  return (
    <span
      aria-hidden
      className={cn(
        "block h-2.5 w-2.5 rounded-full border border-signal",
        lit ? "bg-signal shadow-[0_0_10px_var(--signal)]" : "bg-background",
      )}
    />
  );
}

function VerticalTimeline({
  stops,
  progress,
}: {
  stops: JourneyStop[];
  progress: MotionValue<number>;
}) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute top-6 bottom-6 left-[4px] w-[2px] bg-border"
      />
      <motion.div
        aria-hidden
        className="journey-glow absolute top-6 bottom-6 left-[4px] w-[2px]"
        style={{ scaleY: progress, transformOrigin: "top center" }}
      />
      <ol className="space-y-4">
        {stops.map((stop, index) => (
          <li key={stop.id} className="relative pl-8">
            <span className="absolute top-[22px] left-0 z-[1]">
              <JourneyNode
                progress={progress}
                threshold={index / Math.max(1, stops.length - 1)}
              />
            </span>
            <JourneyCard stop={stop} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function HorizontalTrack({
  stops,
  progress,
}: {
  stops: JourneyStop[];
  progress: MotionValue<number>;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const maxShift = useMotionValue(0);
  const x = useTransform(
    [progress, maxShift],
    ([value, shift]) => -Number(value) * Number(shift),
  );

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const measure = () => {
      maxShift.set(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, [maxShift, stops.length]);

  return (
    <div ref={viewportRef} className="overflow-hidden">
      <motion.div
        ref={trackRef}
        style={{ x }}
        className="w-max pl-[max(1rem,calc((100vw-1100px)/2+1rem))] pr-[max(1rem,calc((100vw-1100px)/2+1rem))]"
      >
        <div className="journey-cards relative">
          <JourneyRail progress={progress} />
          <ol className="flex items-stretch gap-5">
            {stops.map((stop, index) => (
              <li
                key={stop.id}
                className="flex w-[var(--card-w)] shrink-0 flex-col"
              >
                <div className="relative z-[1] flex h-8 items-center justify-center">
                  <JourneyNode
                    progress={progress}
                    threshold={index / Math.max(1, stops.length - 1)}
                  />
                </div>
                <JourneyCard stop={stop} />
              </li>
            ))}
          </ol>
        </div>
      </motion.div>
    </div>
  );
}

function JourneyRail({ progress }: { progress: MotionValue<number> }) {
  const tip = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-4 right-[calc(var(--card-w)/2)] left-[calc(var(--card-w)/2)] h-[2px] -translate-y-1/2"
    >
      <div className="absolute inset-0 bg-border" />
      <motion.div
        className="journey-glow absolute inset-0 origin-left"
        style={{ scaleX: progress, transformOrigin: "left center" }}
      />
      <motion.span
        className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_14px_var(--signal)]"
        style={{ left: tip }}
      />
    </div>
  );
}
