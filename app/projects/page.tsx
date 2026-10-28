import type { Metadata } from "next"
import { CaseStudy } from "@/components/home/work"
import { Designs, Ventures } from "@/components/home/more-sections"
import { work } from "@/lib/site"

export const metadata: Metadata = { title: "Projects | Benedict Frimpong Boateng" }

export default function ProjectsPage() {
  return (
    <main>
      <header className="wrap pb-6 pt-32 sm:pt-40">
        <p className="eyebrow">projects</p>
        <h1 className="mt-4 text-5xl tracking-[-0.05em] sm:text-6xl">everything i&apos;ve shipped</h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          builds, analysis, designs and side projects. more gets added as i ship it.
        </p>
      </header>

      <section className="wrap py-10" aria-label="Builds and analysis">
        {work.map((item, i) => (
          <CaseStudy key={item.slug} item={item} index={i} headingLevel="h2" />
        ))}
      </section>

      <Designs />
      <Ventures />
    </main>
  )
}
