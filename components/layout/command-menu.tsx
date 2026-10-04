import { getTranslations } from "next-intl/server";
import { CommandDialog, type CommandLink } from "@/components/layout/command-dialog";
import { profile } from "@/data/profile";
import { getLearningEntries } from "@/lib/content/learning";
import { getPapers } from "@/lib/content/papers";
import { getProjects } from "@/lib/content/projects";
import { navItems } from "@/lib/nav";

export async function CommandMenu() {
  const nav = await getTranslations("Nav");
  const links: CommandLink[] = [
    ...navItems.map((item) => ({
      group: "pages" as const,
      label: nav(item.key),
      href: item.href,
    })),
    { group: "pages", label: nav("now"), href: "/now" },
    ...getPapers().map((paper) => ({
      group: "papers" as const,
      label: paper.title,
      href: `/papers/${paper.slug}`,
    })),
    ...getProjects().map((project) => ({
      group: "projects" as const,
      label: project.title,
      href: `/projects/${project.slug}`,
    })),
    ...getLearningEntries().map((entry) => ({
      group: "learning" as const,
      label: entry.title,
      href: `/learning/${entry.slug}`,
    })),
  ];

  return <CommandDialog links={links} linkedin={profile.linkedin} />;
}
