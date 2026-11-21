"use client";

import { Check, Lock, RotateCcw, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

type Fact = { key: string; label: string };

const UNITS = "mmhg|bpm|/min|mg/dl|mmol/l|mcg|µg|mg|ml|kg|cm|g|%|days?|tage?n?";
const VALUE = new RegExp(
  `(\\d+(?:[.,]\\d+)?(?:/\\d+(?:[.,]\\d+)?)?)\\s?(${UNITS})(?![a-zäöüß])`,
  "gi",
);
const DATE = /\b(\d{1,2})\.(\d{1,2})\.(\d{2,4})\b/g;
const SIDE = /\b(left|right|link(?:s|e[nrsm]?)|recht(?:s|e[nrsm]?))\b/gi;

function unitKey(unit: string) {
  const u = unit.toLowerCase();
  if (u.startsWith("day") || u.startsWith("tag")) return "d";
  return u;
}

/**
 * A small version of Klindok's fact check: pull every value with a unit,
 * every date and every side (left or right) out of a text. Two texts agree
 * when they hold the same facts.
 */
function extractFacts(
  text: string,
  sides: { left: string; right: string },
): Fact[] {
  const facts = new Map<string, string>();

  const withoutDates = text.replace(
    DATE,
    (match, d: string, m: string, y: string) => {
      facts.set(`date:${Number(d)}.${Number(m)}.${Number(y)}`, match);
      return " ".repeat(match.length);
    },
  );

  for (const match of withoutDates.matchAll(VALUE)) {
    const number = (match[1] ?? "")
      .split("/")
      .map((part) => String(Number.parseFloat(part.replace(",", "."))))
      .join("/");
    const unit = match[2] ?? "";
    facts.set(`value:${number}|${unitKey(unit)}`, `${match[1]} ${unit}`);
  }

  for (const match of text.matchAll(SIDE)) {
    const word = (match[1] ?? "").toLowerCase();
    const side = word.startsWith("l") ? "left" : "right";
    facts.set(`side:${side}`, sides[side]);
  }

  return [...facts].map(([key, label]) => ({ key, label }));
}

/**
 * The Klindok fact check, playable. The visitor edits a draft letter and the
 * check compares it with the doctor's notes on every keystroke. Made-up data,
 * and nothing leaves the page.
 */
export function FactCheckDemo({
  className,
  stacked = false,
}: {
  className?: string;
  /** One column at every width, for narrow pages such as the case study. */
  stacked?: boolean;
}) {
  const t = useTranslations("Demo");
  const draftId = useId();
  const notes = t.raw("notes") as string[];
  const initial = t("draft");
  const [draft, setDraft] = useState(initial);
  const [released, setReleased] = useState(false);

  const { errors, warnings } = useMemo(() => {
    const sides = { left: t("left"), right: t("right") };
    const noteFacts = extractFacts(notes.join("\n"), sides);
    const draftFacts = extractFacts(draft, sides);
    const inNotes = new Set(noteFacts.map((fact) => fact.key));
    const inDraft = new Set(draftFacts.map((fact) => fact.key));
    return {
      errors: draftFacts.filter((fact) => !inNotes.has(fact.key)),
      warnings: noteFacts.filter((fact) => !inDraft.has(fact.key)),
    };
  }, [draft, notes, t]);

  const blocked = errors.length > 0;

  function edit(value: string) {
    setDraft(value);
    setReleased(false);
  }

  return (
    <section
      className={cn("fc", className)}
      aria-labelledby={`${draftId}-title`}
    >
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <h3
        id={`${draftId}-title`}
        className="mt-3 font-serif text-[26px] italic leading-tight text-balance sm:text-[32px]"
      >
        {t("title")}
      </h3>
      <p className="mt-3 max-w-[680px] text-[15px] leading-relaxed text-muted">
        {t("intro")}
      </p>

      {/* Notes, then the draft, then the result: on a phone the result sits right under the text being edited. */}
      <div
        className={cn(
          "mt-6 grid gap-4",
          !stacked && "lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-5",
        )}
      >
        <div
          className={cn(
            "fc-panel",
            !stacked && "lg:col-start-1 lg:row-start-1",
          )}
        >
          <p className="fc-label">{t("notesLabel")}</p>
          <ul className="mt-3 space-y-1.5 text-[15px] leading-relaxed">
            {notes.map((note) => (
              <li key={note} className="flex gap-2.5">
                <span
                  className="mt-[0.6rem] h-1 w-1 flex-none rounded-full bg-muted"
                  aria-hidden
                />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={cn(
            "flex min-w-0 flex-col",
            !stacked && "lg:col-start-2 lg:row-span-2 lg:row-start-1",
          )}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <label htmlFor={draftId} className="fc-label">
              {t("draftLabel")}
            </label>
            <span className="font-mono text-[12px] text-signal-ink">
              {t("draftHint")}
            </span>
          </div>
          <textarea
            id={draftId}
            className="fc-draft mt-3 flex-1"
            value={draft}
            onChange={(event) => edit(event.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              disabled={blocked || released}
              onClick={() => setReleased(true)}
            >
              {blocked ? (
                <Lock className="h-4 w-4" aria-hidden />
              ) : (
                <Check className="h-4 w-4" aria-hidden />
              )}
              {blocked ? t("blocked") : t("release")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => edit(t("fixed"))}
            >
              <Wand2 className="h-4 w-4" aria-hidden />
              {t("fix")}
            </Button>
            <Button type="button" variant="ghost" onClick={() => edit(initial)}>
              <RotateCcw className="h-4 w-4" aria-hidden />
              {t("reset")}
            </Button>
          </div>
          <p className="mt-3 min-h-[1.5em] text-sm" role="status">
            {released ? (
              <span className="fc-state text-pass-ink">
                <Check className="h-4 w-4" aria-hidden />
                {t("released")}
              </span>
            ) : null}
          </p>
        </div>
        <div
          className={cn(
            "fc-panel",
            !stacked && "lg:col-start-1 lg:row-start-2",
          )}
          aria-live="polite"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="fc-label">{t("resultLabel")}</p>
            <p className="font-mono text-[12px] text-muted">
              {t("summary", {
                errors: errors.length,
                warnings: warnings.length,
              })}
            </p>
          </div>

          {errors.length === 0 && warnings.length === 0 ? (
            <p className="mt-3 flex items-start gap-2.5 text-[15px] text-pass-ink">
              <Check className="mt-1 h-4 w-4 flex-none" aria-hidden />
              {t("clean")}
            </p>
          ) : null}

          {errors.length > 0 ? (
            <div className="mt-3">
              <p className="text-sm font-semibold text-fail">{t("errors")}</p>
              <ul className="mt-1.5 space-y-1.5 text-[15px] leading-relaxed">
                {errors.map((fact) => (
                  <li key={fact.key} className="flex gap-2.5">
                    <span className="fc-dot bg-fail" aria-hidden />
                    <span>
                      {t("errorItem")}{" "}
                      <span className="fc-value fc-value-error">
                        {fact.label}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {warnings.length > 0 ? (
            <div className="mt-3">
              <p className="text-sm font-semibold text-signal-ink">
                {t("warnings")}
              </p>
              <ul className="mt-1.5 space-y-1.5 text-[15px] leading-relaxed">
                {warnings.map((fact) => (
                  <li key={fact.key} className="flex gap-2.5">
                    <span className="fc-dot bg-signal" aria-hidden />
                    <span>
                      {t("warningItem")}{" "}
                      <span className="fc-value fc-value-warn">
                        {fact.label}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">{t("note")}</p>
    </section>
  );
}
