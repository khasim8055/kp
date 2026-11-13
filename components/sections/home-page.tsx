import { About } from "@/components/sections/about";
import { ContactCta } from "@/components/sections/contact-cta";
import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
import { Research } from "@/components/sections/research";
import { SelectedProjects } from "@/components/sections/selected-projects";
import { Skills } from "@/components/sections/skills";

/**
 * Home, in the order a visitor asks questions: what did you build, what do you
 * research, how did you get here, who are you, how do I reach you.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <Section id="projects" labelledBy="projects-title">
        <SelectedProjects index="01" />
      </Section>
      <Section id="research" labelledBy="research-title">
        <Research index="02" />
      </Section>
      <Section id="journey" labelledBy="journey-title">
        <Journey index="03" />
      </Section>
      <Section id="about" labelledBy="about-title">
        <About index="04" />
      </Section>
      <Section id="skills" labelledBy="skills-title">
        <Skills index="05" />
      </Section>
      <ContactCta index="06" />
    </>
  );
}

function Section({
  id,
  children,
  labelledBy,
}: {
  id: string;
  children: React.ReactNode;
  labelledBy: string;
}) {
  return (
    <section id={id} className="border-t border-border" aria-labelledby={labelledBy}>
      <div className="mx-auto w-full min-w-0 max-w-[1100px] px-4 py-14 md:py-20">
        {children}
      </div>
    </section>
  );
}
