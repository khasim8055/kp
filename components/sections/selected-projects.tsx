import { getTranslations } from "next-intl/server";
import { KlindokFlow } from "@/components/sections/klindok-flow";
import { ProjectDetails } from "@/components/sections/project-details";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { Readout } from "@/components/ui/readout";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tag } from "@/components/ui/tag";
import { Link } from "@/i18n/navigation";
import {
  extractBuiltDetails,
  getProjects,
  splitStat,
  type Project,
} from "@/lib/content/projects";

const klindokReadouts = [
  { value: "< 30s", labelKey: "arztbrief" as const },
  { value: "100%", labelKey: "offline" as const },
  { value: "Art. 30", labelKey: "audit" as const },
];

export async function SelectedProjects() {
  const t = await getTranslations("Projects");
  const projects = getProjects();
  const flagship = projects.find((project) => project.slug === "klindok");
  const others = projects.filter((project) => project.slug !== "klindok");

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          id="projects-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <Link
          href="/projects"
          className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink"
        >
          {t("viewAll")}
        </Link>
      </div>
      {flagship ? <Flagship project={flagship} /> : null}
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {others.map((project) => (
          <li key={project.slug}>
            <SideProject project={project} />
          </li>
        ))}
      </ul>
    </>
  );
}

async function Flagship({ project }: { project: Project }) {
  const t = await getTranslations("Projects");

  return (
    <GlowCard tilt className="mt-10 p-6 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink">
              {t("flagship")}
            </p>
            {project.status === "building" ? <StatusBadge status="building" /> : null}
          </div>
          <h3 className="mt-3 font-display text-[28px] font-bold tracking-tight sm:text-[36px]">
            {project.title}
          </h3>
          <p className="mt-3 font-serif text-[24px] italic leading-snug text-balance sm:text-[28px] md:text-[32px]">
            {t("klindokSerif")}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
            {klindokReadouts.map((item) => (
              <Readout key={item.labelKey} value={item.value} label={t(item.labelKey)} />
            ))}
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li key={item}>
                <Tag>{item}</Tag>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/projects/${project.slug}`}>{t("caseStudy")}</Link>
            </Button>
            {project.url ? (
              <Button asChild variant="outline">
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  {t("visitSite")}
                </a>
              </Button>
            ) : null}
          </div>
        </div>
        <KlindokFlow notes={t("flowNotes")} model={t("flowModel")} letter={t("flowLetter")} />
      </div>
    </GlowCard>
  );
}

async function SideProject({ project }: { project: Project }) {
  const t = await getTranslations("Projects");
  const readouts = project.stats.slice(0, 3).map(splitStat);
  const bullets = extractBuiltDetails(project.body);

  return (
    <GlowCard tilt className="h-full">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl font-bold tracking-tight">
          <Link href={`/projects/${project.slug}`} className="hover:text-signal-ink">
            {project.title}
          </Link>
        </h3>
        {project.status === "building" ? <StatusBadge status="building" /> : null}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{project.summary}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {readouts.map((item) => (
          <Readout key={`${item.value}-${item.label}`} value={item.value} label={item.label} />
        ))}
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <li key={item}>
            <Tag>{item}</Tag>
          </li>
        ))}
      </ul>
      <ProjectDetails bullets={bullets} />
      <div className="mt-4">
        <Link
          href={`/projects/${project.slug}`}
          className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ink"
        >
          {t("caseStudy")}
        </Link>
      </div>
    </GlowCard>
  );
}
