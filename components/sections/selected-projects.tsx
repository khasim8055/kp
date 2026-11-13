import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectMedia } from "@/components/ui/project-media";
import { Readout } from "@/components/ui/readout";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tag } from "@/components/ui/tag";
import { Link } from "@/i18n/navigation";
import {
  formatProjectDate,
  getProjects,
  groupProjects,
  splitStat,
  type Project,
} from "@/lib/content/projects";

export async function SelectedProjects({ index }: { index?: string }) {
  const t = await getTranslations("Projects");
  const { done, ongoing } = groupProjects(getProjects());
  const [featured, ...others] = done;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          id="projects-title"
          index={index}
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <Link
          href="/projects"
          className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink hover:text-foreground"
        >
          {t("viewAll")}
        </Link>
      </div>

      <GroupLabel label={t("done")} note={t("doneNote")} />
      {featured ? <Featured project={featured} /> : null}
      {others.length > 0 ? (
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {others.map((project) => (
            <li key={project.slug}>
              <CompactProject project={project} />
            </li>
          ))}
        </ul>
      ) : null}

      {ongoing.length > 0 ? (
        <>
          <GroupLabel label={t("ongoing")} note={t("ongoingNote")} />
          <ul className="mt-4 grid gap-4">
            {ongoing.map((project) => (
              <li key={project.slug}>
                <Experiment project={project} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
}

function GroupLabel({ label, note }: { label: string; note: string }) {
  return (
    <div className="mt-12 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border pb-3">
      <h3 className="font-mono text-[12px] uppercase tracking-[0.2em] text-foreground">
        {label}
      </h3>
      <p className="text-sm text-muted">{note}</p>
    </div>
  );
}

async function Featured({ project }: { project: Project }) {
  const t = await getTranslations("Projects");
  const readouts = project.stats.slice(0, 3).map(splitStat);

  return (
    <Card className="mt-4 p-6 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <StatusBadge status={project.status} />
            <p className="font-mono text-[12px] text-muted">
              {formatProjectDate(project.date, project.end)}
            </p>
          </div>
          <h4 className="mt-3 font-display text-[28px] font-bold tracking-tight sm:text-[36px]">
            <Link href={`/projects/${project.slug}`} className="hover:text-signal-ink">
              {project.title}
            </Link>
          </h4>
          {project.slug === "klindok" ? (
            <p className="mt-2 font-serif text-[24px] italic leading-snug text-balance sm:text-[28px]">
              {t("klindokSerif")}
            </p>
          ) : null}
          <p className="mt-4 max-w-[560px] leading-relaxed text-muted">{project.summary}</p>
          {readouts.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-4 min-[420px]:grid-cols-3">
              {readouts.map((item) => (
                <Readout key={item.label} value={item.value} label={item.label} />
              ))}
            </div>
          ) : null}
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li key={item}>
                <Tag>{item}</Tag>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/projects/${project.slug}`}>{t("readCase")}</Link>
            </Button>
            {project.url && project.linkLabel ? (
              <Button asChild variant="outline">
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  {t(project.linkLabel === "site" ? "visitSite" : "github")}
                </a>
              </Button>
            ) : null}
          </div>
        </div>
        {project.slug === "klindok" ? (
          <figure className="mx-auto w-full max-w-[396px]">
            <Link
              href={`/projects/${project.slug}`}
              className="block overflow-hidden rounded-[10px] border border-border"
            >
              <Image
                src="/media/klindok-fact-check-panel.jpg"
                alt={t("klindokShotAlt")}
                width={396}
                height={356}
                sizes="(min-width: 440px) 396px, 92vw"
                className="h-auto w-full"
              />
            </Link>
            <figcaption className="mt-3 text-sm leading-relaxed text-muted">
              {t("klindokShotCaption")}
            </figcaption>
          </figure>
        ) : null}
      </div>
    </Card>
  );
}

async function CompactProject({ project }: { project: Project }) {
  const t = await getTranslations("Projects");
  const readouts = project.stats.slice(0, 2).map(splitStat);

  return (
    <Card className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <StatusBadge status={project.status} />
        <p className="font-mono text-[12px] text-muted">
          {formatProjectDate(project.date, project.end)}
        </p>
      </div>
      <h4 className="mt-3 font-display text-xl font-bold leading-tight tracking-tight">
        <Link href={`/projects/${project.slug}`} className="hover:text-signal-ink">
          {project.title}
        </Link>
      </h4>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.summary}</p>
      {readouts.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {readouts.map((item) => (
            <Readout key={item.label} value={item.value} label={item.label} />
          ))}
        </div>
      ) : null}
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.slice(0, 4).map((item) => (
          <li key={item}>
            <Tag>{item}</Tag>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] uppercase tracking-[0.16em]">
        <Link href={`/projects/${project.slug}`} className="text-signal-ink hover:text-foreground">
          {t("caseStudy")}
        </Link>
        {project.url && project.linkLabel ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground"
          >
            {t(project.linkLabel)}
          </a>
        ) : null}
      </div>
    </Card>
  );
}

async function Experiment({ project }: { project: Project }) {
  const t = await getTranslations("Projects");

  return (
    <Card className="p-5 md:p-6">
      <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:gap-8">
        {project.media ? (
          <ProjectMedia
            media={project.media}
            showCaption={false}
            sizes="(min-width: 768px) 440px, 100vw"
            className="rounded-[10px]"
          />
        ) : null}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <StatusBadge status={project.status} />
            {project.role ? (
              <p className="font-mono text-[12px] text-muted">
                {t("role")}: {project.role}
              </p>
            ) : null}
          </div>
          <h4 className="mt-3 font-display text-2xl font-bold tracking-tight">
            <Link href={`/projects/${project.slug}`} className="hover:text-signal-ink">
              {project.title}
            </Link>
          </h4>
          <p className="mt-3 leading-relaxed text-muted">{project.summary}</p>
          {project.media?.caption ? (
            <p className="mt-3 text-sm leading-relaxed text-muted">{project.media.caption}</p>
          ) : null}
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li key={item}>
                <Tag>{item}</Tag>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <Link
              href={`/projects/${project.slug}`}
              className="font-mono text-[12px] uppercase tracking-[0.16em] text-signal-ink hover:text-foreground"
            >
              {t("readMore", { title: project.title })}
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
