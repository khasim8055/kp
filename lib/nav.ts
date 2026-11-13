/** Pages, in the order they appear in the command menu. */
export const navItems = [
  { href: "/", key: "home" },
  { href: "/projects", key: "projects" },
  { href: "/research", key: "research" },
  { href: "/papers", key: "papers" },
  { href: "/experience", key: "experience" },
  { href: "/now", key: "now" },
  { href: "/contact", key: "contact" },
] as const;

export type NavKey = (typeof navItems)[number]["key"];

/**
 * Header links. Each one points at a section of the home page. `routes` lists
 * the standalone pages that belong to the same topic, so the link also lights
 * up there.
 */
export const homeNav = [
  { id: "projects", key: "projects", routes: ["/projects"] },
  { id: "research", key: "research", routes: ["/research", "/papers"] },
  { id: "journey", key: "journey", routes: ["/experience"] },
  { id: "about", key: "about", routes: ["/now"] },
  { id: "contact", key: "contact", routes: ["/contact"] },
] as const;

export type HomeNavKey = (typeof homeNav)[number]["key"];
