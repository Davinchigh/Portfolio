import Link from "next/link"
import { ArrowRight } from "lucide-react"
import ProjectRow from "@/components/project-row"
import SocialIcons from "@/components/social-icons"
import { projects } from "@/lib/projects"

const facts = [
  ["Most recent role", "SAP Consultant & Educational Content Creator, Team Lead at CodeRaccoon"],
  ["Education", "BSc Statistics with Computer Science, University of Ghana"],
  ["Based in", "Accra, Ghana"],
]

export default function Home() {
  return (
    <main>
      <section className="page pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <h1 className="hero-name text-[clamp(3.25rem,11vw,9.5rem)] font-semibold leading-[0.88] tracking-[-0.055em]">
            <span className="block">Benedict</span>
            <span className="block">Frimpong</span>
            <span className="block">Boateng</span>
          </h1>
          <div className="hidden w-56 overflow-hidden rounded-md border border-border lg:block xl:w-64">
            <img
              src="/images/benedict-frimpong-boateng.jpeg"
              alt="Portrait of Benedict Frimpong Boateng"
              className="aspect-[4/5] w-full object-cover grayscale"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-border pt-8 md:grid-cols-12">
          <p className="text-xl leading-relaxed md:col-span-7 md:text-2xl">
            SAP S/4HANA Cloud consultant and instructional designer. I build e-learning courses and simulations in Rise 360,
            backed by a foundation in statistics, programming and AI.
          </p>
          <div className="flex flex-col gap-6 md:col-span-5 md:items-end">
            <p className="flex items-center gap-2 text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-foreground" aria-hidden="true" />
              Open to work
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-85"
              >
                Get in touch <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/resume"
                className="inline-flex h-11 items-center rounded-md border border-foreground px-5 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
              >
                View resume
              </Link>
            </div>
            <SocialIcons className="-mr-3" />
          </div>
        </div>
      </section>

      <section className="page" aria-labelledby="about-heading">
        <div className="grid gap-10 border-t border-border py-16 md:grid-cols-12">
          <h2 id="about-heading" className="text-sm font-medium md:col-span-3">
            About
          </h2>
          <div className="md:col-span-9">
            <p className="max-w-3xl text-lg leading-relaxed md:text-xl">
              I&apos;m studying Statistics with Computer Science at the University of Ghana (2022 to 2026). Most recently I led a team at CodeRaccoon,
              combining SAP S/4HANA Cloud consulting with instructional design for internal and client training.
            </p>
            <dl className="mt-10 grid gap-6 sm:grid-cols-3">
              {facts.map(([term, detail]) => (
                <div key={term}>
                  <dt className="text-sm text-muted-foreground">{term}</dt>
                  <dd className="mt-1 leading-snug">{detail}</dd>
                </div>
              ))}
            </dl>
            <Link href="/about" className="text-link mt-10 inline-block font-medium">
              More about me
            </Link>
          </div>
        </div>
      </section>

      <section className="page" aria-labelledby="work-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-border pb-2 pt-16">
          <h2 id="work-heading" className="text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
            Selected work
          </h2>
          <Link href="/projects" className="text-link font-medium">
            All projects
          </Link>
        </div>
        <div className="mt-6">
          {projects.slice(0, 3).map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </main>
  )
}
