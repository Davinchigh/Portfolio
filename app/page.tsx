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
import { CaseStudy, WorkCard } from "@/components/home/work"
import { Rail } from "@/components/site/route"
import { Section } from "@/components/site/section"
import { work } from "@/lib/site"
import { ForMode } from "@/lib/visitor"

/** How many projects get the full write-up on the home page. The rest appear as cards. */
const FEATURED = 4

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
                  <Link href="/projects" className="link inline-flex min-h-11 items-center text-sm">
                    all projects
                  </Link>
                }
              >
                {work.slice(0, FEATURED).map((item, i) => (
                  <CaseStudy key={item.slug} item={item} index={i} />
                ))}
                <div className="border-t pt-10">
                  <p className="eyebrow">more work</p>
                  <ul className="stagger mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                    {work.slice(FEATURED).map((item) => (
                      <WorkCard key={item.slug} item={item} />
                    ))}
                  </ul>
                </div>
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
