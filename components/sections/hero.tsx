import { GraduationCap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand";
import { RecruiterModal } from "@/components/sections/recruiter-modal";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Link } from "@/i18n/navigation";
import { profile } from "@/data/profile";
import { getPapers, paperOfTheWeek } from "@/lib/content/papers";
import { isPlaceholderUrl } from "@/lib/utils";

export async function Hero() {
  const t = await getTranslations("Hero");
  const scholarReady = !isPlaceholderUrl(profile.scholar);
  const latestPaper = paperOfTheWeek(getPapers());

  return (
    <div className="mx-auto grid max-w-[1100px] gap-8 px-4 py-14 md:grid-cols-[auto_1fr] md:items-start md:py-20">
      <Image
        src={profile.photo}
        alt={t("photoAlt")}
        width={160}
        height={160}
        unoptimized
        priority
        className="h-28 w-28 rounded-full border border-border object-cover md:h-36 md:w-36"
      />
      <div>
        <h1 className="text-4xl font-medium tracking-tight text-balance">
          {profile.name}
        </h1>
        <p className="mt-2 text-muted">
          {t("title")}, {t("location")}
        </p>
        <p className="mt-5 max-w-[640px] text-lg leading-relaxed text-balance">
          {t("oneLiner")}
        </p>
        <p className="mt-6 font-mono text-xs text-accent">{t("focus")}</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {profile.focus.map((tag) => (
            <li key={tag}>
              <Chip>{tag}</Chip>
            </li>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap gap-2">
          <li>
            <IconLink href={profile.linkedin} label={t("linkedin")} external>
              <LinkedInIcon className="h-4 w-4" />
            </IconLink>
          </li>
          <li>
            <IconLink href={profile.github} label={t("github")} external>
              <GitHubIcon className="h-4 w-4" />
            </IconLink>
          </li>
          <li>
            {scholarReady ? (
              <IconLink href={profile.scholar} label={t("scholar")} external>
                <GraduationCap className="h-4 w-4" aria-hidden />
              </IconLink>
            ) : (
              <span
                role="img"
                className="inline-flex h-9 w-9 items-center justify-center border border-dashed border-border text-muted"
                title={t("scholarMissing")}
                aria-label={t("scholarMissing")}
              >
                <GraduationCap className="h-4 w-4" aria-hidden />
              </span>
            )}
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              {t("requestCv")}
            </a>
          </Button>
          <RecruiterModal />
          <Button asChild variant="outline">
            <Link href={latestPaper ? `/papers/${latestPaper.slug}` : "/papers"}>
              {t("latestPaper")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function IconLink({
  href,
  label,
  external,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center border border-border hover:border-accent hover:text-accent"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
