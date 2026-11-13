import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Tag } from "@/components/ui/tag";
import { profile } from "@/data/profile";

const interestKeys = ["llmEval", "healthcare", "agents", "robotics"] as const;

export async function ContactCta({
  heading = "h2",
  index,
}: {
  heading?: "h1" | "h2";
  index?: string;
}) {
  const t = await getTranslations("Contact");
  const Heading = heading;

  return (
    <section
      id="contact"
      className="border-t border-border"
      aria-labelledby="contact-title"
    >
      <div className="mx-auto flex w-full min-w-0 max-w-[920px] flex-col items-center px-4 py-16 text-center sm:py-20 md:py-28">
        <Eyebrow index={index}>{t("eyebrow")}</Eyebrow>
        <Heading
          id="contact-title"
          className="mt-5 max-w-full font-serif text-[32px] italic leading-[1.1] text-balance sm:text-[40px] md:text-[56px]"
        >
          {t("title")}
        </Heading>
        <p className="mt-5 max-w-[560px] text-muted md:text-lg">{t("line")}</p>
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {interestKeys.map((key) => (
            <li key={key}>
              <Tag>{t(`interests.${key}`)}</Tag>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              {t("linkedin")}
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              {t("github")}
            </a>
          </Button>
        </div>
        <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
          {t("based")}
        </p>
      </div>
    </section>
  );
}
