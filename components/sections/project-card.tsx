import { getTranslations } from "next-intl/server";
import { GlowCard } from "@/components/ui/glow-card";
import { Tag } from "@/components/ui/tag";
import { Link } from "@/i18n/navigation";
import { formatProjectDate, type Project } from "@/lib/content/projects";

export async function ProjectCard({ project }: { project: Project }) {
  const t = await getTranslations("Projects");

  return (
    <li className="h-full">
      <GlowCard className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-xl font-bold tracking-tight">
            <Link
              href={`/projects/${project.slug}`}
              className="hover:text-signal-ink"
            >
              {project.title}
            </Link>
          </h2>
          {project.status ? (
            <Tag className="shrink-0 text-muted">{t(project.status)}</Tag>
          ) : null}
        </div>
        <p className="mt-2 font-mono text-[12px] text-muted">
          {formatProjectDate(project.date)}
          {project.place ? `, ${project.place}` : ""}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stats.map((stat) => (
            <li key={stat}>
              <Tag>{stat}</Tag>
            </li>
          ))}
        </ul>
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <li key={item} className="font-mono text-[12px] text-muted">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href={`/projects/${project.slug}`} className="text-signal-ink">
            {t("caseStudy")}
          </Link>
          {project.url && project.linkLabel ? (
            <a
              href={project.url}
              className="text-signal-ink"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(project.linkLabel)}
            </a>
          ) : null}
        </div>
      </GlowCard>
    </li>
  );
}
