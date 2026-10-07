import { About } from "@/components/sections/about";
import { BeyondCode } from "@/components/sections/beyond-code";
import { ContactCta } from "@/components/sections/contact-cta";
import { CurrentWork } from "@/components/sections/current-work";
import { ExperiencePreview } from "@/components/sections/experience-preview";
import { Hero } from "@/components/sections/hero";
import { LatestLab } from "@/components/sections/latest-lab";
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
      <Section labelledBy="current-work-title">
        <FadeIn>
          <CurrentWork />
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
      <Section labelledBy="skills-title">
        <FadeIn>
          <Skills />
        </FadeIn>
      </Section>
      <Section labelledBy="experience-title">
        <FadeIn>
          <ExperiencePreview />
        </FadeIn>
      </Section>
      <Section labelledBy="beyond-title">
        <FadeIn>
          <BeyondCode />
        </FadeIn>
      </Section>
      <section
        id="contact"
        className="border-t border-border"
        aria-labelledby="contact-title"
      >
        <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-20">
          <FadeIn>
            <ContactCta />
          </FadeIn>
        </div>
      </section>
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
    <section id={id} className="border-t border-border" aria-labelledby={labelledBy}>
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-20">
        {children}
      </div>
    </section>
  );
}
