export const navItems = [
  { href: "/", key: "home" },
  { href: "/research", key: "research" },
  { href: "/papers", key: "papers" },
  { href: "/learning", key: "learning" },
  { href: "/projects", key: "projects" },
  { href: "/experience", key: "experience" },
  { href: "/contact", key: "contact" },
] as const;

export type NavKey = (typeof navItems)[number]["key"];

export const homeNav = [
  { id: "about", key: "about" },
  { id: "research", key: "research" },
  { id: "projects", key: "projects" },
  { id: "evidence", key: "evidence" },
  { id: "lab", key: "lab" },
  { id: "contact", key: "contact" },
] as const;

export type HomeNavKey = (typeof homeNav)[number]["key"];
