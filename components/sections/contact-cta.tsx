import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

export async function ContactCta({
  heading = "h2",
}: {
  heading?: "h1" | "h2";
}) {
  const t = await getTranslations("Contact");
  const Heading = heading;

  return (
    <div className="border border-border p-6 md:p-8">
      <p className="font-mono text-xs text-accent">{t("eyebrow")}</p>
      <Heading
        id="contact-title"
        className="mt-2 text-2xl font-medium tracking-tight"
      >
        {t("title")}
      </Heading>
      <p className="mt-3 max-w-[640px] leading-relaxed">{t("cta")}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            {t("linkedin")}
          </a>
        </Button>
      </div>
    </div>
  );
}
