import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Download } from "lucide-react"
import { certifications, person, roles, socials, stack } from "@/lib/site"

export const metadata: Metadata = { title: "Resume | Benedict Frimpong Boateng" }

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
const label = (v: string) => (v === "present" || /^\d{4}$/.test(v) ? v : `${MONTHS[Number(v.split("-")[1]) - 1]} ${v.split("-")[0]}`)
const sortKey = (v: string) => (v === "present" ? "9999" : v)

const education = [
  { title: "University of Ghana", detail: "BSc Statistics with Computer Science", dates: "2022 to 2026" },
  { title: "Brandenburg University of Applied Sciences", detail: "End-to-End Business Processes with SAP S/4HANA Cloud (IEE2E)", dates: "june 2026" },
  { title: "Claude Academy by Anthropic", detail: "Certifications in Claude Code, MCP and AI fluency", dates: "sept 2026 to present" },
  { title: "ALX", detail: "AI Starter Kit", dates: "apr to may 2025" },
  { title: "Ghana National College", detail: "WASSCE, General Arts", dates: "2018 to 2021" },
]

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-4 border-t py-10 md:grid-cols-12 md:gap-10">
      <h2 id={id} className="eyebrow md:col-span-3 md:pt-1">
        {title}
      </h2>
      <div className="md:col-span-9">{children}</div>
    </section>
  )
}

function Row({ title, sub, dates, children }: { title: string; sub?: string; dates?: string; children?: ReactNode }) {
  return (
    <li className="grid gap-1 border-t py-5 first:border-t-0 first:pt-0 sm:grid-cols-[1fr_auto] sm:gap-x-8">
      <div className="min-w-0">
        <h3 className="font-medium">{title}</h3>
        {sub && <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>}
        {children && <div className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">{children}</div>}
      </div>
      {dates && <p className="meta sm:pt-1 sm:text-right">{dates}</p>}
    </li>
  )
}

export default function ResumePage() {
  const ordered = [...roles].sort((a, b) => sortKey(b.start).localeCompare(sortKey(a.start)))
  return (
    <main>
      <header className="wrap pb-6 pt-32 sm:pt-40">
        <p className="eyebrow">resume</p>
        <h1 className="mt-4 text-5xl tracking-[-0.05em] sm:text-6xl">{person.fullName}</h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">{person.role}, based in {person.location}.</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <a href={person.cv} download className="pill-button">
            <Download className="h-4 w-4" aria-hidden="true" /> download cv (pdf)
          </a>
          <a href={`mailto:${person.email}`} className="link break-all py-2 text-sm text-muted-foreground">
            {person.email}
          </a>
          {socials.slice(0, 2).map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="link py-2 text-sm">
              {s.label.toLowerCase()}
            </a>
          ))}
        </div>
      </header>

      <div className="wrap pb-10">
        <Block id="r-experience" title="experience">
          <ul>
            {ordered.map((r) => (
              <Row key={r.id} title={r.company} sub={r.role} dates={r.start === r.end ? label(r.start) : `${label(r.start)} to ${label(r.end)}`}>
                {(r.summary || r.bullets) && (
                  <>
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
                  </>
                )}
              </Row>
            ))}
          </ul>
        </Block>

        <Block id="r-education" title="education">
          <ul>
            {education.map((e) => (
              <Row key={e.title} title={e.title} sub={e.detail} dates={e.dates} />
            ))}
          </ul>
        </Block>

        <Block id="r-skills" title="skills">
          <ul className="grid gap-6 sm:grid-cols-3">
            {stack.map((g) => (
              <li key={g.label}>
                <h3 className="font-medium">{g.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.tools.map((t) => t.name).join(", ")}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Also: software, AI and UI/UX testing, instructional design, data analysis and visualisation, SQL and data warehousing,
            team leadership, public speaking and cybersecurity fundamentals.
          </p>
        </Block>

        <Block id="r-certs" title="certifications">
          <ul>
            {certifications.map((c) => (
              <Row key={c.issuer} title={c.issuer} sub={c.items.join(", ")} dates={c.year} />
            ))}
          </ul>
        </Block>
      </div>
    </main>
  )
}
