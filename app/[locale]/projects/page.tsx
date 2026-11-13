import { getTranslations } from "next-intl/server";
import { ProjectCard } from "@/components/sections/project-card";
import { PageHero } from "@/components/ui/page-hero";
import { getProjects, groupProjects } from "@/lib/content/projects";
import { resolveLocale } from "@/lib/locale";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Projects" });
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMeta({
    locale,
    path: "/projects",
    title: t("indexTitle"),
    description: meta("pages.projects"),
  });
}

export default async function ProjectsPage({ params }: Props) {
  await resolveLocale(params);
  const t = await getTranslations("Projects");
  const { done, ongoing } = groupProjects(getProjects());

  return (
    <>
      <PageHero
        eyebrow={t("indexEyebrow")}
        title={t("indexTitle")}
        serif={t("subtitle")}
      />
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-16">
        <section aria-labelledby="projects-done">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border pb-3">
            <h2
              id="projects-done"
              className="font-mono text-[12px] uppercase tracking-[0.2em] text-foreground"
            >
              {t("done")}
            </h2>
            <p className="text-sm text-muted">{t("doneNote")}</p>
          </div>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {done.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </ul>
        </section>
        {ongoing.length > 0 ? (
          <section className="mt-14" aria-labelledby="projects-ongoing">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border pb-3">
              <h2
                id="projects-ongoing"
                className="font-mono text-[12px] uppercase tracking-[0.2em] text-foreground"
              >
                {t("ongoing")}
              </h2>
              <p className="text-sm text-muted">{t("ongoingNote")}</p>
            </div>
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {ongoing.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
