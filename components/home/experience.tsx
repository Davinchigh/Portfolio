"use client"

import { useMemo, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { HandNote } from "@/components/site/hand-note"
import { Section } from "@/components/site/section"
import { roles, type Role } from "@/lib/site"
import { ForMode } from "@/lib/visitor"

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
      <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-white transition-transform duration-200 group-hover:scale-110 group-hover:border-route/60 motion-reduce:transform-none">
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
      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-110 group-hover:border-route/60 motion-reduce:transform-none font-mono text-xs font-semibold text-muted-foreground ${
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
          <li key={r.id} className="relative py-1">
            {hasDetails ? (
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : r.id)}
                className="group -mx-2 flex w-[calc(100%+1rem)] items-start gap-4 rounded-xl px-2 py-2 text-left transition-colors hover:bg-accent/60 hover:[&_.font-medium]:text-route"
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
                        <span className="text-route" aria-hidden="true">
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
  const [hovered, setHovered] = useState<string | null>(null)
  const { first, last, years } = useMemo(() => {
    const first = Math.floor(Math.min(...roles.map((r) => decimal(r.start))))
    const last = Math.ceil(Math.max(...roles.map((r) => decimal(r.end, true))))
    return { first, last, years: Array.from({ length: last - first }, (_, i) => first + i) }
  }, [])
  const span = last - first
  const pct = (v: number) => ((v - first) / span) * 100
  const shownId = hovered ?? active
  const chosen = roles.find((r) => r.id === shownId)
  const bounds = (r: Role) => {
    const left = pct(decimal(r.start))
    return { left, width: Math.max(pct(decimal(r.end, true)) - left, 7) }
  }
  const lastBand = useRef<{ left: number; width: number } | null>(null)
  if (hovered) lastBand.current = bounds(roles.find((r) => r.id === hovered)!)
  const band = lastBand.current

  return (
    <div>
      <div className="overflow-x-auto pb-2 pt-2">
        <div className="relative min-w-[640px]" onMouseLeave={() => setHovered(null)}>
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
            {/* Highlight band across the hovered role's years */}
            <li
              aria-hidden="true"
              className={`pointer-events-none absolute -top-8 bottom-0 rounded-lg border-x border-dashed border-route/50 bg-route/[0.06] transition-[left,width,opacity] duration-300 ease-out motion-reduce:transition-none ${
                hovered && band ? "opacity-100" : "opacity-0"
              } ${band ? "" : "hidden"}`}
              style={band ? { left: `${band.left}%`, width: `${band.width}%` } : undefined}
            />
            {[...sorted].reverse().map((r) => {
              const { left, width } = bounds(r)
              const isActive = r.id === active
              const isHovered = r.id === hovered
              const dimmed = hovered !== null && !isHovered
              const narrow = width < 16
              const labelOnLeft = left + width > 80
              return (
                <li key={r.id} className="relative h-10">
                  {narrow && (
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-y-0 flex items-center whitespace-nowrap px-2 text-sm transition-colors ${
                        isHovered ? "text-foreground" : "text-muted-foreground"
                      }`}
                      style={labelOnLeft ? { right: `${100 - left}%` } : { left: `calc(${left + width}% + 4px)` }}
                    >
                      {r.company}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setActive(r.id)}
                    onMouseEnter={() => setHovered(r.id)}
                    onFocus={() => setHovered(r.id)}
                    onBlur={() => setHovered(null)}
                    aria-pressed={isActive}
                    aria-label={`${r.company}, ${r.role}, ${range(r)}`}
                    className={`absolute inset-y-0 flex items-center gap-2 overflow-hidden rounded-lg border px-3 text-left text-sm transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-route/10 focus-visible:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none ${
                      isActive
                        ? "border-route bg-route/15 text-foreground"
                        : isHovered
                          ? "border-route/60 bg-route/10 text-foreground"
                          : dimmed
                            ? "border-border/40 bg-transparent text-muted-foreground"
                            : "bg-card text-muted-foreground"
                    }`}
                    style={{ left: `${left}%`, width: `${width}%`, minWidth: 44 }}
                  >
                    {r.logo && !narrow && (
                      <img src={r.logo} alt="" aria-hidden="true" className={`h-5 w-5 shrink-0 rounded bg-white object-contain transition-opacity ${dimmed ? "opacity-50" : ""}`} />
                    )}
                    <span className={narrow ? "sr-only" : "truncate"}>{r.company}</span>
                  </button>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -top-7 z-10 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-[11px] tabular-nums text-background shadow transition-all duration-200 motion-reduce:transition-none ${
                      isHovered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                    }`}
                    style={labelOnLeft ? { right: `${100 - left - width}%` } : { left: `${left}%` }}
                  >
                    {range(r)}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      {chosen && (
        <div
          key={chosen.id}
          className={`mt-6 rounded-xl border p-5 transition-colors ${hovered && hovered !== active ? "border-dashed bg-card/60" : "bg-card"}`}
          aria-live="polite"
        >
          <div className="flex items-start gap-4">
            <Initials company={chosen.company} current={chosen.end === "present"} logo={chosen.logo} />
            <div>
              <p className="font-medium">{chosen.company}</p>
              <p className="text-sm text-muted-foreground">{chosen.role}</p>
              <p className="meta mt-1">{range(chosen)}</p>
            </div>
          </div>
          {chosen.summary && <p className="mt-3 text-sm text-muted-foreground">{chosen.summary}</p>}
          {hovered && hovered !== active && <p className="meta mt-3">previewing. click the bar to keep it.</p>}
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
    <Section
      id="experience"
      eyebrow={<ForMode recruiter="experience" explorer="the road so far" />}
      title={<ForMode recruiter="where i've worked" explorer="every stop taught me something" />}
      aside={toggle}
    >
      {view === "list" ? <ListView /> : <TimelineView />}
    </Section>
  )
}
