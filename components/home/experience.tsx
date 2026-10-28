"use client"

import { useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"
import { HandNote } from "@/components/site/hand-note"
import { Section } from "@/components/site/section"
import { roles, type Role } from "@/lib/site"

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

function label(value: string) {
  if (value === "present" || /^\d{4}$/.test(value)) return value
  const [y, m] = value.split("-")
  return `${MONTHS[Number(m) - 1]} ${y}`
}
function range(r: Role) {
  return r.start === r.end ? label(r.start) : `${label(r.start)} to ${label(r.end)}`
}
/** Year as a decimal: 2025-11 → 2025.83. Bare years cover the whole year. */
function decimal(value: string, isEnd = false) {
  if (value === "present") {
    const now = new Date()
    return now.getFullYear() + now.getMonth() / 12
  }
  const [y, m] = value.split("-").map(Number)
  if (!m) return y + (isEnd ? 1 : 0)
  return y + (m - 1 + (isEnd ? 1 : 0)) / 12
}
const sorted = [...roles].sort((a, b) => decimal(b.start) - decimal(a.start))

function Initials({ company, current, logo }: { company: string; current?: boolean; logo?: string }) {
  if (logo)
    return (
      <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-white">
        <img src={logo} alt="" aria-hidden="true" className="h-full w-full object-contain" />
        {current && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-live ring-2 ring-background" />}
      </span>
    )
  const text = company
    .replace(/\(.*\)/, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
  return (
    <span
      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border font-mono text-xs font-semibold text-muted-foreground ${
        logo ? "overflow-hidden bg-white" : "bg-card"
      }`}
    >
      {logo ? <img src={logo} alt="" aria-hidden="true" className="h-full w-full rounded-xl object-contain" /> : text}
      {current && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-live ring-2 ring-background" />}
    </span>
  )
}

function ListView() {
  const [open, setOpen] = useState<string | null>("coderaccoon")
  return (
    <ul className="relative before:absolute before:bottom-6 before:left-[21px] before:top-6 before:w-px before:bg-border">
      {sorted.map((r) => {
        const hasDetails = Boolean(r.summary || r.bullets?.length)
        const isOpen = open === r.id
        const panelId = `role-${r.id}`
        const header = (
          <>
            <Initials company={r.company} current={r.end === "present"} logo={r.logo} />
            <span className="min-w-0 flex-1 pt-0.5">
              <span className="block font-medium">{r.company}</span>
              <span className="mt-0.5 block text-sm text-muted-foreground">{r.role}</span>
              <span className="meta mt-1 block sm:hidden">{range(r)}</span>
            </span>
            <span className="meta flex items-center gap-2 whitespace-nowrap pt-1">
              <span className="hidden sm:inline">{range(r)}</span>
              {hasDetails && <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />}
            </span>
          </>
        )
        return (
          <li key={r.id} className="relative py-3">
            {hasDetails ? (
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : r.id)}
                className="group flex w-full items-start gap-4 rounded-xl text-left hover:[&_.font-medium]:text-amber"
              >
                {header}
              </button>
            ) : (
              <div className="flex items-start gap-4">{header}</div>
            )}
            {hasDetails && isOpen && (
              <div id={panelId} className="ml-[60px] max-w-2xl pt-3 text-sm leading-relaxed text-muted-foreground">
                {r.summary && <p>{r.summary}</p>}
                {r.bullets && (
                  <ul className="mt-2 space-y-1.5">
                    {r.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="text-amber" aria-hidden="true">
                          *
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function TimelineView() {
  const [active, setActive] = useState<string>("coderaccoon")
  const { first, last, years } = useMemo(() => {
    const first = Math.floor(Math.min(...roles.map((r) => decimal(r.start))))
    const last = Math.ceil(Math.max(...roles.map((r) => decimal(r.end, true))))
    return { first, last, years: Array.from({ length: last - first }, (_, i) => first + i) }
  }, [])
  const span = last - first
  const pct = (v: number) => ((v - first) / span) * 100
  const chosen = roles.find((r) => r.id === active)

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div className="relative min-w-[640px]">
          <div className="relative h-6">
            {years.map((y) => (
              <span key={y} className="meta absolute top-0" style={{ left: `${pct(y)}%` }}>
                {y}
              </span>
            ))}
          </div>
          <ul className="relative space-y-2 py-2">
            {years.map((y) => (
              <li key={`line-${y}`} aria-hidden="true" className="pointer-events-none absolute bottom-0 top-0 w-px bg-border" style={{ left: `${pct(y)}%` }} />
            ))}
            {[...sorted].reverse().map((r) => {
              const left = pct(decimal(r.start))
              const width = Math.max(pct(decimal(r.end, true)) - left, 7)
              const isActive = r.id === active
              const narrow = width < 16
              const labelOnLeft = left + width > 80
              return (
                <li key={r.id} className="relative h-10">
                  {narrow && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 flex items-center whitespace-nowrap px-2 text-sm text-muted-foreground"
                      style={labelOnLeft ? { right: `${100 - left}%` } : { left: `calc(${left + width}% + 4px)` }}
                    >
                      {r.company}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setActive(r.id)}
                    aria-pressed={isActive}
                    className={`absolute inset-y-0 flex items-center overflow-hidden rounded-lg border px-3 text-left text-sm transition-colors ${
                      isActive ? "border-amber bg-amber/15 text-foreground" : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                    style={{ left: `${left}%`, width: `${width}%`, minWidth: 44 }}
                  >
                    <span className={narrow ? "sr-only" : "truncate"}>{r.company}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      {chosen && (
        <div className="mt-6 rounded-xl border bg-card p-5" aria-live="polite">
          <p className="font-medium">{chosen.company}</p>
          <p className="text-sm text-muted-foreground">{chosen.role}</p>
          <p className="meta mt-1">{range(chosen)}</p>
          {chosen.summary && <p className="mt-3 text-sm text-muted-foreground">{chosen.summary}</p>}
        </div>
      )}
    </div>
  )
}

export function Experience() {
  const [view, setView] = useState<"list" | "timeline">("list")
  const toggle = (
    <div className="flex items-center gap-3">
      <HandNote arrow="none" className="hidden -rotate-6 text-xl sm:inline-flex">
        try both
      </HandNote>
      <div role="group" aria-label="Experience view" className="flex rounded-full border bg-card p-1">
        {(["list", "timeline"] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={view === v}
            onClick={() => setView(v)}
            className={`min-h-9 min-w-[76px] rounded-full px-3 text-sm transition-colors ${
              view === v ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <Section id="experience" eyebrow="experience" title="where i've worked" aside={toggle}>
      {view === "list" ? <ListView /> : <TimelineView />}
    </Section>
  )
}
