import { getTranslations } from "next-intl/server";
import { CommandButton } from "@/components/layout/command-button";
import { LocaleToggle } from "@/components/layout/locale-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Link } from "@/i18n/navigation";
import { profile } from "@/data/profile";

export async function SiteHeader() {
  const t = await getTranslations("Nav");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="relative mx-auto flex h-14 max-w-[1100px] items-center justify-between gap-3 px-4">
        <Link href="/" className="text-sm font-medium tracking-tight">
          {profile.name.split(" ")[0]}
        </Link>
        <nav aria-label={t("primary")} className="hidden lg:block">
          <NavLinks />
        </nav>
        <div className="flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />
          <CommandButton />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
