import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { projectMdxComponents } from "@/components/mdx/project-body";
import { PageHero } from "@/components/ui/page-hero";
import { getNow } from "@/lib/content/now";
import { resolveLocale } from "@/lib/locale";
import { daysSince } from "@/lib/site";
import { isTodo } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Now" });
  return { title: t("title") };
}

export default async function NowPage({ params }: Props) {
  await resolveLocale(params);
  const page = getNow();
  if (!page) notFound();

  const t = await getTranslations("Now");
  const days = isTodo(page.updated) ? null : daysSince(page.updated);
  const updated =
    days === null
      ? t("missing")
      : days === 0
        ? t("updatedToday")
        : days === 1
          ? t("updatedOne")
          : t("updatedMany", { count: days });

  return (
    <>
      <PageHero
        width="760"
        eyebrow={t("eyebrow")}
        title={page.title}
        serif={t("serif")}
      />
      <article className="mx-auto max-w-[760px] px-4 py-14 md:py-16">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-muted">
          {updated}
        </p>
        <div className="mt-2 text-[15px] leading-relaxed">
          <MDXRemote source={page.body} components={projectMdxComponents} />
        </div>
      </article>
    </>
  );
}
