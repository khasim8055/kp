import { About } from "@/components/sections/about";
import { ContactCta } from "@/components/sections/contact-cta";
import { Evidence } from "@/components/sections/evidence";
import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
import { LatestLab } from "@/components/sections/latest-lab";
import { Research } from "@/components/sections/research";
import { SelectedProjects } from "@/components/sections/selected-projects";
import { Skills } from "@/components/sections/skills";
import { FadeIn } from "@/components/ui/fade-in";

export function HomePage() {
  return (
    <>
      <Hero />
      <Section id="about" labelledBy="about-title">
        <FadeIn>
          <About />
        </FadeIn>
      </Section>
      <Journey />
      <Section id="research" labelledBy="research-title">
        <FadeIn>
          <Research />
        </FadeIn>
      </Section>
      <Section id="lab" labelledBy="lab-title">
        <FadeIn>
          <LatestLab />
        </FadeIn>
      </Section>
      <Section id="projects" labelledBy="projects-title">
        <FadeIn>
          <SelectedProjects />
        </FadeIn>
      </Section>
      <Section id="evidence" labelledBy="evidence-title">
        <FadeIn>
          <Evidence />
        </FadeIn>
      </Section>
      <Section id="skills" labelledBy="skills-title">
        <FadeIn>
          <Skills />
        </FadeIn>
      </Section>
      <FadeIn>
        <ContactCta />
      </FadeIn>
    </>
  );
}

function Section({
  id,
  children,
  labelledBy,
}: {
  id?: string;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      className="border-t border-border"
      aria-labelledby={labelledBy}
    >
      <div className="mx-auto w-full min-w-0 max-w-[1100px] px-4 py-14 md:py-20">
        {children}
      </div>
    </section>
  );
}
