import Link from "next/link"
import { Building } from "@/components/building"
import { AiFigure, Cite } from "@/components/ui"

const facts = [
  { k: "1,700", v: "students, give or take", cite: "cloth" },
  { k: "430", v: "self-contained rooms", cite: "cloth" },
  { k: "2011/12", v: "the first academic year students moved in", cite: "cloth" },
  { k: "Royals", v: "what residents are called", cite: "halls" },
]

const doors = [
  {
    href: "/rooms/",
    title: "Need a room?",
    body: "How on-campus beds work at UG, where to apply, and how to avoid people selling fake beds.",
    cta: "How rooms work",
  },
  {
    href: "/life/",
    title: "What is hall life like?",
    body: "The Royals, Hall Week, basketball, the hall cloth and the little things that make it home.",
    cta: "Hall life",
  },
  {
    href: "/hall/",
    title: "Who was Jean Nelson Aka?",
    body: "The alumnus behind the name, and how the hall came to be one of Legon's four newer halls.",
    cta: "The story",
  },
]

export default function Home() {
  return (
    <>
      <section className="bg-night text-mist">
        <div className="wrap grid items-center gap-10 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:pb-24">
          <div>
            <p className="eyebrow text-lamp">University of Ghana, Legon</p>
            <h1 className="mt-4 text-5xl sm:text-6xl lg:text-7xl">
              Jean Nelson Aka Hall
            </h1>
            <p className="mt-5 font-display text-2xl text-lamp-soft sm:text-3xl">Lux in Tenebris. Light in Darkness.</p>
            <p className="mt-6 max-w-xl text-lg text-mist-muted">
              A friendly, unofficial guide to the hall, for freshers figuring things out, parents with questions and old
              Royals who miss the place. Made by someone who lived here.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/rooms/" className="btn-lamp">
                How to get a room
              </Link>
              <Link href="/hall/" className="btn-ghost">
                Read the story
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-xl overflow-hidden rounded-[28px]">
            <Building />
          </div>
        </div>
      </section>

      <section aria-labelledby="facts-h" className="border-b border-ink/10 bg-paper-2">
        <div className="wrap py-10">
          <h2 id="facts-h" className="sr-only">
            Quick facts
          </h2>
          <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {facts.map((f) => (
              <div key={f.k}>
                <dt className="sr-only">{f.v}</dt>
                <dd className="font-display text-4xl text-night sm:text-5xl">{f.k}</dd>
                <dd className="mt-1 text-ink-muted">
                  {f.v}
                  <Cite id={f.cite} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="doors-h" className="wrap py-16 sm:py-20">
        <h2 id="doors-h" className="text-3xl sm:text-4xl">
          Start where you are
        </h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {doors.map((d) => (
            <li key={d.href} className="flex flex-col rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
              <h3 className="text-2xl">{d.title}</h3>
              <p className="mt-3 flex-1 text-ink-muted">{d.body}</p>
              <Link href={d.href} className="link mt-5 inline-flex min-h-[44px] items-center">
                {d.cta}
                <span aria-hidden="true">&nbsp;→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-paper-2">
        <div className="wrap grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2">
          <AiFigure src="/img/desk.webp" alt="A candle lit study desk by a window at night, with an open notebook and books." />
          <div>
            <h2 className="text-3xl sm:text-4xl">Light in Darkness</h2>
            <p className="mt-4 text-lg">
              That is the hall's motto, <em>Lux in Tenebris</em>.<Cite id="cloth" /> If you've ever pulled an all-nighter
              before a paper, you know exactly what it means.
            </p>
            <p className="mt-4 text-lg">
              Lived here too? Your story belongs on this site.
            </p>
            <Link href="/memories/" className="btn-ink mt-6">
              Share a memory
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
