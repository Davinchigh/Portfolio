import Link from "next/link"
import { Contact } from "@/components/home/contact"
import { Experience } from "@/components/home/experience"
import { Globe } from "@/components/home/globe"
import { Hero } from "@/components/home/hero"
import { Certifications, Designs, Stack, Ventures } from "@/components/home/more-sections"
import { Stats } from "@/components/home/stats"
import { CaseStudy } from "@/components/home/work"
import { Section } from "@/components/site/section"
import { work } from "@/lib/site"

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Experience />
      <Section
        id="work"
        eyebrow="selected work"
        title="work i've shipped"
        intro="what the problem was, what i did, and how it turned out."
        aside={
          <Link href="/projects" className="link text-sm">
            all projects
          </Link>
        }
      >
        {work.map((item, i) => (
          <CaseStudy key={item.slug} item={item} index={i} />
        ))}
      </Section>
      <Designs />
      <Ventures />
      <Stack />
      <Certifications />
      <Globe />
      <Contact />
    </main>
  )
}
