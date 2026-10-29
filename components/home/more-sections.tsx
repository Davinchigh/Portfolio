import Link from "next/link"
import { CertificateViewer } from "@/components/home/certificate-viewer"
import { ArrowUpRight } from "lucide-react"
import { HandNote } from "@/components/site/hand-note"
import { Section } from "@/components/site/section"
import { ToolIcon } from "@/components/site/tool-icon"
import { certifications, designs, stack, ventures } from "@/lib/site"

export function Designs() {
  return (
    <Section id="designs" eyebrow="design work" title="screens i've designed" intro="ui and ux work in figma. open one to explore the full file.">
      <div className="grid gap-10 md:grid-cols-2">
        {designs.map((d) => (
          <article key={d.slug}>
            <a href={d.href} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="shot">
                <img src={d.image} alt={d.imageAlt} loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl group-hover:underline group-hover:underline-offset-4">{d.title}</h3>
                  <p className="meta mt-1">{d.note}</p>
                </div>
                <span className="inline-flex items-center gap-1 pt-1 text-sm text-muted-foreground group-hover:text-foreground">
                  figma <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.summary}</p>
            </a>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function Ventures() {
  return (
    <Section id="started" eyebrow="side projects" title="things i build on the side" intro="built on my own time, mostly with claude code. route means still in progress.">
      <ul className="grid gap-4 md:grid-cols-3">
        {ventures.map((v) => {
          const active = v.status === "in progress"
          return (
            <li key={v.title} className={`flex flex-col rounded-xl border p-5 ${active ? "border-route/60" : ""}`}>
              <p className="meta flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${active ? "bg-route" : "bg-subtle"}`} aria-hidden="true" />
                {v.status}
              </p>
              <h3 className="mt-3 text-lg">
                {"href" in v && v.href ? (
                  <Link href={v.href} className="link">
                    {v.title}
                  </Link>
                ) : (
                  v.title
                )}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{v.summary}</p>
              <p className="meta mt-4">{v.tags.join(", ")}</p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

export function Stack() {
  return (
    <Section
      id="stack"
      eyebrow="stack"
      title="tools i reach for"
      intro="the languages and tools i reach for. hover or tab to see names."
      aside={
        <HandNote arrow="down-left" className="hidden -rotate-3 text-xl md:inline-flex">
          claude does a lot of heavy lifting
        </HandNote>
      }
    >
      <div className="grid gap-10 md:grid-cols-3">
        {stack.map((group) => (
          <div key={group.label}>
            <h3 className="eyebrow">{group.label}</h3>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {group.tools.map((tool) => (
                <li key={tool.name}>
                  <span
                    tabIndex={0}
                    className="group relative flex h-14 w-14 items-center justify-center rounded-xl border bg-card text-muted-foreground transition-[color,transform] hover:-translate-y-0.5 hover:text-foreground focus-visible:text-foreground motion-reduce:transition-none"
                  >
                    <ToolIcon icon={tool.icon} name={tool.name} />
                    <span className="sr-only">{tool.name}</span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border bg-popover px-2 py-1 text-xs text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      {tool.name}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}

export function Certifications() {
  return (
    <Section
      id="certifications"
      eyebrow="certifications"
      title="things i've been certified in"
      intro="most recent first. open any certificate to see the original, and verify it where the issuer allows."
    >
      <ul>
        {certifications.map((c) => (
          <li key={c.issuer} className="grid gap-3 border-t py-5 sm:grid-cols-[1fr_auto] sm:gap-8">
            <div>
              <h3 className="font-medium">{c.issuer}</h3>
              {c.items.length === 1 ? (
                <p className="mt-1 text-sm text-muted-foreground">{c.items[0]}</p>
              ) : (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {c.items.map((item) => (
                    <li key={item} className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {c.doc && (
                <div className="mt-3">
                  <CertificateViewer doc={c.doc} issuer={c.issuer} />
                </div>
              )}
            </div>
            <p className="meta sm:pt-1">{c.year}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
