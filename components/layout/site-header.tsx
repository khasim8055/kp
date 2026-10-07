import { CommandMenu } from "@/components/layout/command-menu";
import { FloatingNav } from "@/components/layout/floating-nav";

export function SiteHeader() {
  return <FloatingNav command={<CommandMenu />} />;
}
