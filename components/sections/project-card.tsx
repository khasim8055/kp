import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tag } from "@/components/ui/tag";
import { Link } from "@/i18n/navigation";
import { formatProjectDate, type Project } from "@/lib/content/projects";

export async function ProjectCard({ project }: { project: Project }) {
  const t = await getTranslations("Projects");

  return (
    <li className="h-full" data-reveal>
      <Card className="flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <StatusBadge status={project.status} />
          <p className="font-mono text-[12px] text-muted">
            {formatProjectDate(project.date, project.end)}
            {project.place ? `, ${project.place}` : ""}
          </p>
        </div>
        <h3 className="mt-3 font-display text-xl font-bold tracking-tight">
          <Link href={`/projects/${project.slug}`} className="hover:text-signal-ink">
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.summary}</p>
        {project.stats.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.stats.map((stat) => (
              <li key={stat}>
                <Tag>{stat}</Tag>
              </li>
            ))}
          </ul>
        ) : null}
        <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
          {project.stack.map((item) => (
            <li key={item} className="font-mono text-[12px] text-muted">
              {item}
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
              className="text-muted hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(project.linkLabel)}
            </a>
          ) : null}
        </div>
      </Card>
    </li>
  );
}
