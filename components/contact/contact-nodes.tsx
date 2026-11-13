import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { NodeCage } from "@/components/contact/node-cage";
import { BrandIcon } from "@/components/ui/brand-icon";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

/**
 * LinkedIn and GitHub as two agents of the 3D world: each floats above the
 * floor inside a turning wire cage, with the official mark as its core, and
 * a pulse of light travels between the two.
 *
 * They are ordinary links. The cage is drawn on top by `NodeCage` and nothing
 * depends on it.
 */
export async function ContactNodes({
  size = "md",
  className,
}: {
  size?: "md" | "lg";
  className?: string;
}) {
  const t = await getTranslations("Contact");
  const nodes = [
    { id: "linkedin", href: profile.linkedin, icon: faLinkedin, name: t("linkedin"), line: t("linkedinLine") },
    { id: "github", href: profile.github, icon: faGithub, name: t("github"), line: t("githubLine") },
  ];

  return (
    <div className={cn("nodes", size === "lg" && "nodes-lg", className)}>
      <span className="nodes-link" aria-hidden="true">
        <span className="nodes-pulse" />
      </span>
      {nodes.map((node) => (
        <a
          key={node.id}
          href={node.href}
          target="_blank"
          rel="noopener noreferrer"
          data-tilt=""
          className={cn("node", `node-${node.id}`)}
        >
          <span className="node-stage" aria-hidden="true">
            <NodeCage />
            <span className="node-core">
              <BrandIcon icon={node.icon} className="node-icon" />
            </span>
          </span>
          <span className="node-tether" aria-hidden="true" />
          <span className="node-floor" aria-hidden="true" />
          <span className="node-name">
            {node.name}
            <ArrowUpRight className="node-arrow" aria-hidden="true" />
          </span>
          <span className="node-line">{node.line}</span>
          <span className="sr-only">{t("newTab")}</span>
        </a>
      ))}
    </div>
  );
}
