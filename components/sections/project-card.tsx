import { getTranslations } from "next-intl/server";
import { Chip } from "@/components/ui/chip";
import { Link } from "@/i18n/navigation";
import { formatProjectDate, type Project } from "@/lib/content/projects";

export async function ProjectCard({ project }: { project: Project }) {
  const t = await getTranslations("Projects");

  return (
    <li className="flex flex-col border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium">
          <Link href={`/projects/${project.slug}`} className="hover:text-accent">
            {project.title}
          </Link>
        </h3>
        {project.status ? (
          <span className="shrink-0 border border-border px-2 py-0.5 font-mono text-[11px] text-muted">
            {t(project.status)}
          </span>
        ) : null}
      </div>
      <p className="mt-1 font-mono text-[11px] text-muted">
        {formatProjectDate(project.date)}
        {project.place ? `, ${project.place}` : ""}
      </p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {project.summary}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stats.map((stat) => (
          <li key={stat}>
            <Chip>{stat}</Chip>
          </li>
        ))}
      </ul>
      <ul className="mt-3 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <li key={item} className="font-mono text-[11px] text-muted">
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <Link href={`/projects/${project.slug}`} className="text-accent">
          {t("caseStudy")}
        </Link>
        {project.url && project.linkLabel ? (
          <a
            href={project.url}
            className="text-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t(project.linkLabel)}
          </a>
        ) : null}
      </div>
    </li>
  );
}
