import { ArrowLeft, ArrowRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { projectMdxComponents } from "@/components/mdx/project-body";
import { PageHero } from "@/components/ui/page-hero";
import { ProjectMedia } from "@/components/ui/project-media";
import { Readout } from "@/components/ui/readout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tag } from "@/components/ui/tag";
import { Link } from "@/i18n/navigation";
import {
  formatProjectDate,
  getProject,
  getProjects,
  projectNeighbors,
  splitStat,
} from "@/lib/content/projects";
import { resolveLocale } from "@/lib/locale";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMeta({
    locale,
    path: `/projects/${project.slug}`,
    title: project.title,
    description: project.summary,
  });
}

export default async function ProjectPage({ params }: Props) {
  await resolveLocale(params);
  const { slug } = await params;
  const projects = getProjects();
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const t = await getTranslations("Projects");
  const { prev, next } = projectNeighbors(projects, project.slug);
  const readouts = project.stats.map(splitStat);

  return (
    <>
      <PageHero width="760" eyebrow={t("caseStudy")} title={project.title}>
        <p className="mt-5 max-w-[640px] text-lg leading-relaxed text-muted">
          {project.summary}
        </p>
      </PageHero>
      <article className="mx-auto max-w-[760px] px-4 py-12 md:py-14">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-signal-ink hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {t("viewAll")}
        </Link>

        <dl className="fact-list mt-8">
          <div>
            <dt>{t("status")}</dt>
            <dd>
              <StatusBadge status={project.status} />
            </dd>
          </div>
          <div>
            <dt>{t("period")}</dt>
            <dd>
              {formatProjectDate(project.date, project.end)}
              {project.place ? `, ${project.place}` : ""}
            </dd>
          </div>
          {project.role ? (
            <div>
              <dt>{t("role")}</dt>
              <dd>{project.role}</dd>
            </div>
          ) : null}
          <div>
            <dt>{t("stack")}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          {project.url && project.linkLabel ? (
            <div>
              <dt>{t("link")}</dt>
              <dd>
                <a
                  href={project.url}
                  className="text-signal-ink underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.url.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>

        {readouts.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 border-y border-border py-6 min-[460px]:grid-cols-3">
            {readouts.map((item) => (
              <Readout key={item.label} value={item.value} label={item.label} />
            ))}
          </div>
        ) : null}

        {project.media ? <ProjectMedia media={project.media} className="mt-8" /> : null}

        <div className="mt-2 text-[16px] leading-relaxed">
          <MDXRemote source={project.body} components={projectMdxComponents} />
        </div>

        {prev || next ? (
          <nav
            aria-label={t("more")}
            className="mt-14 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group rounded-[14px] border border-border p-5 hover:border-signal"
              >
                <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                  {t("prev")}
                </span>
                <span className="mt-2 block font-display text-lg font-bold tracking-tight group-hover:text-signal-ink">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group rounded-[14px] border border-border p-5 text-right hover:border-signal"
              >
                <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  {t("next")}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="mt-2 block font-display text-lg font-bold tracking-tight group-hover:text-signal-ink">
                  {next.title}
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </article>
    </>
  );
}
