import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import type { Work as WorkItem } from "@/lib/site"

/** One numbered case study: label, title, hook, then problem, role and outcome beside the screenshot. */
export function CaseStudy({ item, index, headingLevel = "h3" }: { item: WorkItem; index: number; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel
  return (
    <article className="grid gap-6 border-t py-10 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-5">
        <p className="meta flex gap-3">
          <span className="text-route">{String(index + 1).padStart(2, "0")}</span>
          <span>{item.org}</span>
        </p>
        <Heading className="mt-3 text-2xl">{item.title}</Heading>
        <p className="mt-2 text-muted-foreground">{item.hook}</p>

        <dl className="mt-6 space-y-4 text-sm">
          {[
            ["problem", item.problem],
            ["what i did", item.role],
            ["result", item.outcome],
          ].map(([term, text]) => (
            <div key={term}>
              <dt className="eyebrow">{term}</dt>
              <dd className="mt-1 leading-relaxed text-muted-foreground">{text}</dd>
            </div>
          ))}
        </dl>

        <p className="meta mt-5">{item.tags.join(", ")}</p>

        {item.links.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {item.links.map((l) => (
              <li key={l.href}>
                {l.href.startsWith("/") ? (
                  <Link href={l.href} className="link inline-flex items-center gap-1 py-1 text-sm font-medium">
                    {l.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1 py-1 text-sm font-medium">
                    {l.label}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="md:col-span-7">
        <div className={`shot ${item.slug === "zero" ? "bg-[#060608]" : ""}`}>
          <img
            src={item.image}
            alt={item.imageAlt}
            loading="lazy"
            className={`aspect-[16/10] w-full ${item.contain ? "bg-white object-contain p-3" : item.slug === "zero" ? "object-contain" : "object-cover object-top"}`}
          />
        </div>
      </div>
    </article>
  )
}
