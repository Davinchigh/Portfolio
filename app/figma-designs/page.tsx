import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import PageHeader from "@/components/page-header"
import { designs } from "@/lib/projects"

export const metadata: Metadata = { title: "Designs | Benedict Frimpong Boateng" }

const process = [
  {
    title: "Research",
    text: "I start with who will use the product and what they need to get done, then look at how similar products solve it.",
  },
  {
    title: "Wireframe and prototype",
    text: "Low fidelity layouts first so I can test structure quickly, then clickable prototypes in Figma to check the flow.",
  },
  {
    title: "Visual design and handoff",
    text: "Type, colour and spacing are finalised with accessibility in mind, and I document the details developers need to build it accurately.",
  },
]

export default function DesignsPage() {
  return (
    <main>
      <PageHeader title="Designs">UI and UX work I&apos;ve designed in Figma. Open any project to explore the full file.</PageHeader>

      <section className="page space-y-24" aria-label="Design projects">
        {designs.map((design) => (
          <article key={design.slug} className="group border-t border-border pt-10">
            <div className="grid gap-6 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-4">
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{design.title}</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{design.summary}</p>
                <p className="mt-5 text-sm text-muted-foreground">{design.tags.join(", ")}</p>
                <a
                  href={design.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-85"
                >
                  Open in Figma <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>

              <div className="space-y-4 md:col-span-8">
                <a
                  href={design.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-md border border-border bg-muted"
                  aria-label={`${design.title} in Figma (opens in a new tab)`}
                >
                  <img src={design.image} alt={design.imageAlt} loading="lazy" className="mono-img w-full" />
                </a>
                {"secondaryImage" in design && design.secondaryImage && (
                  <figure>
                    <div className="overflow-hidden rounded-md border border-border bg-muted">
                      <img
                        src={design.secondaryImage}
                        alt={design.secondaryAlt}
                        loading="lazy"
                        className="mono-img aspect-[21/9] w-full object-cover"
                      />
                    </div>
                    <figcaption className="mt-2 text-sm text-muted-foreground">The hall and its grounds, the setting the site was designed for.</figcaption>
                  </figure>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="page mt-24" aria-labelledby="process-heading">
        <div className="border-t border-border pt-12">
          <h2 id="process-heading" className="text-3xl font-semibold tracking-tight">
            How I work
          </h2>
          <ol className="mt-8 grid gap-10 md:grid-cols-3">
            {process.map((step, index) => (
              <li key={step.title}>
                <p className="text-5xl font-semibold tracking-tight text-muted-foreground/50" aria-hidden="true">
                  {index + 1}
                </p>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  )
}
