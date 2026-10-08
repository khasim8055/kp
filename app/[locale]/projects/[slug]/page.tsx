import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { projectMdxComponents } from "@/components/mdx/project-body";
import { Tag } from "@/components/ui/tag";
import { PageHero } from "@/components/ui/page-hero";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/locale";
import {
  formatProjectDate,
  getProject,
  getProjects,
} from "@/lib/content/projects";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props) {
  await resolveLocale(params);
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectPage({ params }: Props) {
  await resolveLocale(params);
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations("Projects");

  return (
    <>
      <PageHero
        width="760"
        eyebrow={t("caseStudy")}
        title={project.title}
        serif={t("subtitle")}
      />
      <article className="mx-auto max-w-[760px] px-4 py-14 md:py-16">
        <Link
          href="/projects"
          className="font-mono text-[12px] uppercase tracking-[0.16em] text-signal-ink"
        >
          {t("viewAll")}
        </Link>
        <p className="mt-6 font-mono text-[12px] text-muted">
          {formatProjectDate(project.date)}
          {project.place ? `, ${project.place}` : ""}
          {project.status ? ` · ${t(project.status)}` : ""}
        </p>
        <p className="mt-4 leading-relaxed">{project.summary}</p>
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
        {project.url && project.linkLabel ? (
          <a
            href={project.url}
            className="mt-4 inline-block text-sm text-signal-ink"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t(project.linkLabel)}
          </a>
        ) : null}
        <div className="mt-2 text-[15px] leading-relaxed">
          <MDXRemote source={project.body} components={projectMdxComponents} />
        </div>
      </article>
    </>
  );
}
