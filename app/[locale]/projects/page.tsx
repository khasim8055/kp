import { getTranslations } from "next-intl/server";
import { ProjectCard } from "@/components/sections/project-card";
import { PageHero } from "@/components/ui/page-hero";
import { resolveLocale } from "@/lib/locale";
import { getProjects } from "@/lib/content/projects";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Projects" });
  return { title: t("indexTitle") };
}

export default async function ProjectsPage({ params }: Props) {
  await resolveLocale(params);
  const t = await getTranslations("Projects");
  const projects = getProjects();

  return (
    <>
      <PageHero
        eyebrow={t("indexEyebrow")}
        title={t("indexTitle")}
        serif={t("subtitle")}
      />
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-16">
        <ul className="grid gap-4 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </ul>
      </div>
    </>
  );
}
