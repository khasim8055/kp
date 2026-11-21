import { Download } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ContactNodes } from "@/components/contact/contact-nodes";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Tag } from "@/components/ui/tag";
import { cvFile } from "@/data/cv";

const interestKeys = ["llmEval", "healthcare", "agents", "vision"] as const;

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
      className="contact-band border-t border-border"
      aria-labelledby="contact-title"
    >
      <div
        className="mx-auto flex w-full min-w-0 max-w-[920px] flex-col items-center px-4 py-16 text-center sm:py-20 md:py-28"
        data-reveal
      >
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
        <ContactNodes size="lg" className="mt-12" />
        {cvFile ? (
          <div className="mt-10 flex flex-col items-center gap-2">
            <Button asChild variant="outline">
              <a href={cvFile} download>
                <Download className="h-4 w-4" aria-hidden />
                {t("cv")}
              </a>
            </Button>
            <p className="font-mono text-[12px] text-muted">{t("cvLine")}</p>
          </div>
        ) : null}
        <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
          {t("based")}
        </p>
      </div>
    </section>
  );
}
