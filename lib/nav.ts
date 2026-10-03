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
