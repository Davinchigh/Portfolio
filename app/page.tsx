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
import { CaseStudy, MarqueeCard } from "@/components/home/work"
import { WorkWheel } from "@/components/home/work-wheel"
import { Marquee } from "@/components/site/kinetic"
import { Rail } from "@/components/site/route"
import { Section } from "@/components/site/section"
import { work } from "@/lib/site"
import { ForMode } from "@/lib/visitor"

/** How many projects get the full write-up on the home page. The rest appear as cards. */
const FEATURED = 5

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
                <WorkWheel
                  items={work.slice(0, FEATURED)}
                  fallback={work.slice(0, FEATURED).map((item, i) => (
                    <CaseStudy key={item.slug} item={item} index={i} />
                  ))}
                />
                <div className="border-t pt-10">
                  <p className="eyebrow">more work</p>
                  <p className="mt-2 text-sm text-muted-foreground">hover to pause, open any one for the full story.</p>
                  <div className="mt-4">
                    <Marquee label="more work" seconds={70}>
                      {work.slice(FEATURED).map((item) => (
                        <MarqueeCard key={item.slug} item={item} />
                      ))}
                    </Marquee>
                  </div>
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
