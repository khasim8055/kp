"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

const proofKeys = ["proof1", "proof2", "proof3"] as const;

export function RecruiterModal() {
  const t = useTranslations("Recruiter");
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button type="button" variant="outline" onClick={() => dialogRef.current?.showModal()}>
        {t("open")}
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby="recruiter-title"
        className="w-[min(100%-2rem,40rem)] border border-border bg-background p-6 text-foreground backdrop:bg-black/40"
      >
        <p className="font-mono text-xs text-accent">{t("eyebrow")}</p>
        <h2 id="recruiter-title" className="mt-2 text-2xl font-medium tracking-tight">
          {t("title")}
        </h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div>
            <dt className="font-mono text-[11px] text-muted">{t("role")}</dt>
            <dd>{t("roleValue")}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] text-muted">{t("location")}</dt>
            <dd>{t("locationValue")}</dd>
          </div>
        </dl>
        <h3 className="mt-6 text-sm font-medium">{t("skills")}</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {profile.focus.map((skill) => (
            <li key={skill} className="border border-border px-2 py-0.5 font-mono text-[11px]">
              {skill}
            </li>
          ))}
        </ul>
        <h3 className="mt-6 text-sm font-medium">{t("proof")}</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed">
          {proofKeys.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              {t("requestCv")}
            </a>
          </Button>
          <Button type="button" variant="outline" onClick={() => dialogRef.current?.close()}>
            {t("close")}
          </Button>
        </div>
      </dialog>
    </>
  );
}
