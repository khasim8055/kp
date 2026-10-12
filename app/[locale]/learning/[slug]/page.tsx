import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { learningMdxComponents } from "@/components/mdx/learning-body";
import {
  stripUnfinishedMdx,
  stripUnfinishedSource,
} from "@/lib/unfinished-mdx";
import { Chip } from "@/components/ui/chip";
import { PageHeader } from "@/components/ui/page-header";
import { Link } from "@/i18n/navigation";
import { getLearningEntries, getLearningEntry } from "@/lib/content/learning";
import { isUrl } from "@/lib/content/paper-shared";
import { resolveLocale } from "@/lib/locale";
import { isTodo } from "@/lib/utils";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getLearningEntries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props) {
  await resolveLocale(params);
  const { slug } = await params;
  const entry = getLearningEntry(slug);
  return { title: entry?.title ?? "Learning" };
}

export default async function LearningEntryPage({ params }: Props) {
  await resolveLocale(params);
  const { slug } = await params;
  const entry = getLearningEntry(slug);
  if (!entry) notFound();

  const t = await getTranslations("Learning");
  const week = String(entry.week).padStart(2, "0");

  return (
    <article className="mx-auto max-w-[760px] px-4 py-16 md:py-20">
      <Link href="/learning" className="text-sm text-accent">
        {t("viewAll")}
      </Link>
      <div className="mt-6">
        <PageHeader eyebrow={t("week", { week })} title={entry.title} />
      </div>
      <p className="font-mono text-[11px] text-muted">
        {isTodo(entry.dateStart) || isTodo(entry.dateEnd)
          ? t("missing")
          : t("range", { start: entry.dateStart, end: entry.dateEnd })}
        {" · "}
        {typeof entry.hoursSpent === "number"
          ? t("hours", { count: entry.hoursSpent })
          : t("hoursMissing")}
        {entry.mood ? ` · ${entry.mood}` : ""}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {entry.tags.map((tag) => (
          <li key={tag}>
            <Chip>{isTodo(tag) ? t("missing") : tag}</Chip>
          </li>
        ))}
      </ul>
      {entry.links.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-4 text-sm">
          {entry.links.filter((link) => isUrl(link.url)).map((link) => (
            <li key={link.url}>
              <a href={link.url} className="text-accent" target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-2 text-[15px] leading-relaxed">
        <MDXRemote
          source={stripUnfinishedSource(entry.body)}
          components={learningMdxComponents}
          options={{ mdxOptions: { rehypePlugins: [stripUnfinishedMdx] } }}
        />
      </div>
    </article>
  );
}
