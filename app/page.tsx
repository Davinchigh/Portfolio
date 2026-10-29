import Link from "next/link"
import { Builds } from "@/components/home/builds"
import { Contact } from "@/components/home/contact"
import { Experience } from "@/components/home/experience"
import { Flow } from "@/components/home/flow"
import { Globe } from "@/components/home/globe"
import { Hero } from "@/components/home/hero"
import { Lessons } from "@/components/home/lessons"
import { Certifications, Designs, Stack, Ventures } from "@/components/home/more-sections"
import { Stats } from "@/components/home/stats"
import { CaseStudy } from "@/components/home/work"
import { Rail } from "@/components/site/route"
import { Section } from "@/components/site/section"
import { work } from "@/lib/site"
import { ForMode } from "@/lib/visitor"

export default function Home() {
  return (
    <main>
      <Rail>
        <Hero />
        <Flow
          sections={{
            stats: <Stats />,
            experience: <Experience />,
            lessons: <Lessons />,
            work: (
              <Section
                id="work"
                eyebrow={<ForMode recruiter="the proof" explorer="what i made along the way" />}
                title={<ForMode recruiter="work i've shipped" explorer="things i've built" />}
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
            ),
            builds: <Builds />,
            ventures: <Ventures />,
            designs: <Designs />,
            stack: <Stack />,
            certifications: <Certifications />,
            now: <Globe />,
          }}
        />
      </Rail>
      <Contact />
    </main>
  )
}
