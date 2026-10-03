import { getTranslations } from "next-intl/server";
import { ProjectCard } from "@/components/sections/project-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/i18n/navigation";
import { getProjects } from "@/lib/content/projects";

export async function SelectedProjects() {
  const t = await getTranslations("Projects");
  const projects = getProjects();

  return (
    <>
      <SectionHeading
        id="projects-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
        action={
          <Link href="/projects" className="text-sm text-accent">
            {t("viewAll")}
          </Link>
        }
      />
      <ul className="grid gap-4 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ul>
    </>
  );
}
