"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter } from "@/i18n/navigation";

export type CommandLink = {
  group: "pages" | "papers" | "projects" | "learning";
  label: string;
  href: string;
};

const groups = ["pages", "papers", "projects", "learning"] as const;

export function CommandDialog({
  links,
  linkedin,
}: {
  links: CommandLink[];
  linkedin: string;
}) {
  const t = useTranslations("Nav");
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("command-menu:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("command-menu:open", onOpen);
    };
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href as "/");
  }

  return (
    <>
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal)]"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${t("command")} ⌘K`}
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" aria-hidden />
      </button>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label={t("commandTitle")}
        overlayClassName="fixed inset-0 z-50 bg-black/40"
        contentClassName="fixed left-1/2 top-[18vh] z-50 w-[min(100%-2rem,28rem)] -translate-x-1/2 border border-border bg-background"
      >
        <Command.Input
          placeholder={t("commandSearch")}
          aria-label={t("commandSearch")}
          className="w-full border-b border-border bg-transparent px-3 py-3 text-sm outline-none focus-visible:border-[var(--signal)] focus-visible:shadow-[inset_0_-2px_0_0_var(--signal)]"
        />
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-2 py-3 text-sm text-muted">
            {t("commandEmpty")}
          </Command.Empty>
          {groups.map((group) => {
            const items = links.filter((link) => link.group === group);
            if (items.length === 0) return null;
            return (
              <Command.Group
                key={group}
                heading={t(group)}
                className="mt-2"
              >
                {items.map((item) => (
                  <Command.Item
                    key={`${group}-${item.href}`}
                    value={`${item.label} ${item.href}`}
                    onSelect={() => go(item.href)}
                    className="cursor-pointer px-2 py-2 text-sm text-foreground data-[selected=true]:bg-border"
                  >
                    {item.label}
                  </Command.Item>
                ))}
              </Command.Group>
            );
          })}
          <Command.Group heading={t("actions")} className="mt-2">
            <Command.Item
              value={t("themeToggle")}
              onSelect={() => {
                setTheme(resolvedTheme === "dark" ? "light" : "dark");
                setOpen(false);
              }}
              className="cursor-pointer px-2 py-2 text-sm text-foreground data-[selected=true]:bg-border"
            >
              {t("themeToggle")}
            </Command.Item>
            <Command.Item
              value={t("requestCv")}
              onSelect={() => {
                window.open(linkedin, "_blank", "noopener,noreferrer");
                setOpen(false);
              }}
              className="cursor-pointer px-2 py-2 text-sm text-foreground data-[selected=true]:bg-border"
            >
              {t("requestCv")}
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </>
  );
}
