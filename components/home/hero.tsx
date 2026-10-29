"use client"

import { ArrowDown, ArrowUpRight, Download } from "lucide-react"
import { Clock } from "@/components/site/clock"
import { HandNote } from "@/components/site/hand-note"
import { Stop } from "@/components/site/route"
import { person, proof, road } from "@/lib/site"
import { useVisitor } from "@/lib/visitor"

function Status() {
  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
      </span>
      {person.status}, available now
    </p>
  )
}

/** The fork in the road: two paths, one choice. */
function Fork() {
  const { setMode } = useVisitor()
  const paths = [
    { mode: "recruiter" as const, label: "i'm hiring", note: "show me the work first" },
    { mode: "explorer" as const, label: "just looking around", note: "show me the story" },
  ]
  return (
    <div className="mt-10">
      <p className="text-sm text-muted-foreground">how would you like to walk it?</p>
      <div className="relative mt-4 max-w-xl pl-10">
        <svg aria-hidden="true" viewBox="0 0 40 150" preserveAspectRatio="none" className="absolute left-0 top-0 h-full w-10 text-route">
          <path d="M2 0 V18 C2 34 14 37 38 37" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path d="M2 18 V95 C2 111 14 113 38 113" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 5" vectorEffect="non-scaling-stroke" />
        </svg>
        <ul className="space-y-3">
          {paths.map((p) => (
            <li key={p.mode}>
              <button
                type="button"
                onClick={() => setMode(p.mode)}
                className="group flex w-full items-center justify-between gap-4 rounded-2xl border bg-card px-5 py-4 text-left transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-route/60 hover:bg-background motion-reduce:transform-none"
              >
                <span>
                  <span className="font-display block text-xl font-semibold tracking-tight">{p.label}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{p.note}</span>
                </span>
                <ArrowDown className="h-5 w-5 shrink-0 text-route transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="meta mt-4 pl-10">you can switch any time from the top of the page.</p>
    </div>
  )
}

function Switch({ to, children }: { to: "recruiter" | "explorer"; children: React.ReactNode }) {
  const { setMode } = useVisitor()
  return (
    <button type="button" onClick={() => setMode(to)} className="link py-2 text-sm text-muted-foreground hover:text-foreground">
      {children}
    </button>
  )
}

export function Hero() {
  const { mode, company } = useVisitor()

  const label = mode === "recruiter" ? (company ? `a page for ${company}` : "for recruiters") : "where it starts"

  return (
    <section className="wrap pb-14 pt-28 sm:pt-36" aria-labelledby="hero-title">
      <div>
        <p className="eyebrow relative flex flex-wrap items-center gap-x-3">
          <Stop />
          <span>{label}</span>
          <span className="meta font-normal">
            {person.location}, <Clock />
          </span>
        </p>

        {mode === "unknown" && (
          <div key="unknown" className="hero-pending settle">
            <div className="mt-5 flex flex-wrap items-end gap-x-5 gap-y-1">
              <h1 id="hero-title" className="text-6xl sm:text-8xl">
                hi, i&apos;m benedict.
              </h1>
              <HandNote arrow="left" className="mb-3 -rotate-3">
                {person.nickname}
              </HandNote>
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              ai engineer and software developer in accra. this site is the road that got me here, from a statistics class in
              legon to building with ai.
            </p>
            <Fork />
          </div>
        )}

        {mode === "recruiter" && (
          <div key="recruiter" className="settle">
            <h1 id="hero-title" className="mt-5 max-w-4xl text-5xl sm:text-7xl">
              {company ? <>hi, {company} team.</> : "hi, glad you stopped by."}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              i&apos;m benedict, an ai engineer and software developer in accra. i build with claude, test things properly and
              ship fast. proof first, then the road behind it.
            </p>
            <div className="mt-5">
              <Status />
            </div>
            <ul className="mt-10 grid gap-6 border-t pt-8 sm:grid-cols-3">
              {proof.map((p) => (
                <li key={p.title}>
                  <h2 className="text-lg">{p.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.line}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#work" className="pill-button">
                see the work <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href={person.cv} download className="ghost-button">
                <Download className="h-4 w-4" aria-hidden="true" /> download cv
              </a>
              <a href={`mailto:${person.email}`} className="ghost-button">
                email me <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <div className="mt-4">
              <Switch to="explorer">rather read the story first?</Switch>
            </div>
          </div>
        )}

        {mode === "explorer" && (
          <div key="explorer" className="settle">
            <h1 id="hero-title" className="mt-5 max-w-4xl text-5xl sm:text-7xl">
              from a statistics class in legon to building with ai.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              i&apos;m benedict. in 2022 i was setting up a supermarket&apos;s database as a volunteer. today i build ai tools,
              courses and an original card game. here&apos;s the road so far, and what it taught me.
            </p>
            <ol className="mt-12 grid gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6" aria-label="The road so far">
              {road.map((stop, i) => {
                const last = i === road.length - 1
                return (
                  <li key={`${stop.year}-${stop.place}`} className="relative border-t-2 border-route/40 pt-4">
                    <span
                      aria-hidden="true"
                      className={`absolute -top-[7px] left-0 h-3 w-3 rounded-full border-2 ${last ? "border-route bg-background" : "border-route bg-route"}`}
                    />
                    <p className="meta">{stop.year}</p>
                    <p className="font-display mt-1 text-lg font-semibold tracking-tight">{stop.place}</p>
                    <p className="mt-1 text-sm leading-snug text-muted-foreground">{stop.line}</p>
                  </li>
                )
              })}
            </ol>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#experience" className="pill-button">
                walk the road <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#work" className="ghost-button">
                see what i&apos;ve made
              </a>
            </div>
            <div className="mt-4">
              <Switch to="recruiter">hiring? see the recruiter view</Switch>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
