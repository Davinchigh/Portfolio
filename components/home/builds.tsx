"use client"

import { useId, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { HandNote } from "@/components/site/hand-note"
import { Section } from "@/components/site/section"
import { builds } from "@/lib/site"

/** Letters, spaces, dots and hyphens only, same rule the apps use. */
const clean = (v: string) =>
  v
    .replace(/[^\p{L}\p{M} .-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 30)

function BuildCard({ build, index }: { build: (typeof builds)[number]; index: number }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const id = useId()
  const who = clean(name)
  const href = who ? `${build.href}#name=${encodeURIComponent(who)}` : build.href

  return (
    <li className="flex flex-col rounded-2xl border bg-card p-6">
      <p className="meta">0{index + 1}</p>
      <h3 className="mt-2 text-xl">{build.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{build.line}</p>
      <p className="meta mt-3 leading-relaxed">{build.detail}</p>

      <div className="mt-auto pt-6">
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={false}
            className="inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-medium transition-colors hover:border-amber/60 hover:text-amber"
          >
            try this build
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              window.open(href, "_blank", "noopener")
            }}
            className="space-y-3"
          >
            <label htmlFor={id} className="block text-sm">
              what should it call you? <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id={id}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              autoComplete="given-name"
              maxLength={30}
              placeholder="your first name"
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-amber"
            />
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-foreground px-5 text-sm font-medium text-background"
              >
                open it{who ? ` for ${who}` : ""} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <button type="button" onClick={() => setOpen(false)} className="min-h-11 px-2 text-sm text-muted-foreground hover:text-foreground">
                cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </li>
  )
}

export function Builds() {
  return (
    <Section
      id="builds"
      eyebrow="builds you can try"
      title="apps i built for a friend, now for you"
      intro="i made these as personal learning apps for one person. these copies greet whoever opens them. your name never leaves your browser."
      aside={
        <HandNote arrow="none" className="hidden -rotate-3 text-xl sm:inline-flex">
          go on, open one
        </HandNote>
      }
    >
      <ul className="grid gap-5 md:grid-cols-3">
        {builds.map((b, i) => (
          <BuildCard key={b.slug} build={b} index={i} />
        ))}
      </ul>
    </Section>
  )
}
