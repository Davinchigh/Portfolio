import Link from "next/link"
import { Cite, MottoCard } from "@/components/ui"

const facts = [
  { k: "1,700", v: "residents, give or take", cite: "cloth" },
  { k: "430", v: "self-contained rooms", cite: "cloth" },
  { k: "2011", v: "inaugurated, first residents in 2011/12", cite: "cloth" },
  { k: "Royals", v: "what residents are called", cite: "halls" },
]

const index = [
  { n: "01", href: "/rooms/", title: "Getting a room", body: "How on-campus beds work at UG, where to apply, and how to avoid anyone selling fake beds." },
  { n: "02", href: "/life/", title: "Life in hall", body: "The Royals, Hall Week, basketball, the hall cloth and the small things that make it home." },
  { n: "03", href: "/hall/", title: "The story", body: "The alumnus behind the name, and how the hall became one of Legon's four newer halls." },
  { n: "04", href: "/map/", title: "Finding it", body: "Where the hall sits on the southern side of campus, off the road toward Noguchi." },
  { n: "05", href: "/faq/", title: "Questions", body: "Short answers for freshers, parents and anyone visiting for the first time." },
]

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-h" className="wrap grid items-end gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.6fr_1fr] lg:gap-14 lg:pb-28">
        <div>
          <p className="label fade-in flex items-center gap-3 text-lamp-deep">
            <span className="rule" aria-hidden="true" /> University of Ghana, Legon
          </p>
          <h1 id="hero-h" className="mt-7 text-[clamp(3rem,7.6vw,6.6rem)] leading-[0.95] [&>.line-mask]:lg:whitespace-nowrap">
            <span className="line-mask">
              <span>Jean Nelson</span>
            </span>
            <span className="line-mask">
              <span>
                Aka Hall<span className="text-lamp">.</span>
              </span>
            </span>
          </h1>
          <p className="fade-in mt-8 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
            A quiet, honest guide to the hall, for freshers finding their feet, parents with questions and old Royals who
            miss the place. Written by someone who lived here.
          </p>
          <div className="fade-in mt-10 flex flex-wrap items-center gap-3">
            <Link href="/rooms/" className="btn-ink">
              How to get a room <span aria-hidden="true">→</span>
            </Link>
            <Link href="/hall/" className="btn-ghost">
              Read the story
            </Link>
          </div>
        </div>
        <MottoCard className="fade-in" />
      </section>

      {/* FACTS */}
      <section aria-labelledby="facts-h" className="border-y border-line bg-white/60">
        <h2 id="facts-h" className="sr-only">
          The hall in numbers
        </h2>
        <dl className="wrap grid grid-cols-2 md:grid-cols-4">
          {facts.map((f, i) => (
            <div key={f.k} className={`reveal py-10 sm:py-12 ${i % 2 ? "pl-6 sm:pl-8" : ""} ${i > 0 ? "md:border-l md:border-line md:pl-8" : ""} ${i === 1 || i === 3 ? "border-l border-line" : ""}`}>
              <dt className="sr-only">{f.v}</dt>
              <dd className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-none tracking-[-0.02em]">{f.k}</dd>
              <dd className="mt-3 text-[0.95rem] text-ink-muted">
                {f.v}
                <Cite id={f.cite} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* INDEX */}
      <section aria-labelledby="index-h" className="wrap py-24 sm:py-32">
        <div className="reveal grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
          <div>
            <p className="label flex items-center gap-3 text-lamp-deep">
              <span className="rule" aria-hidden="true" /> Start here
            </p>
            <h2 id="index-h" className="mt-5 text-4xl sm:text-5xl">
              Everything in one quiet place.
            </h2>
          </div>
          <ul className="border-t border-line">
            {index.map((d) => (
              <li key={d.href} className="border-b border-line">
                <Link href={d.href} className="row-link group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 px-2 py-7 sm:grid-cols-[3.5rem_1fr_auto] sm:px-4">
                  <span className="text-sm tabular-nums text-ink-muted">{d.n}</span>
                  <span>
                    <span className="block font-display text-2xl leading-tight transition-colors duration-300 group-hover:text-lamp-deep sm:text-3xl">{d.title}</span>
                    <span className="mt-2 block max-w-lg text-ink-muted">{d.body}</span>
                  </span>
                  <span className="arrow text-xl text-ink" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* NAMESAKE BAND */}
      <section aria-labelledby="name-h" className="on-night relative isolate overflow-hidden bg-night text-mist">
        <span
          aria-hidden="true"
          className="glow-drift absolute left-1/3 top-1/4 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(212,178,106,0.35),transparent)] blur-3xl"
        />
        <div className="wrap grid gap-12 py-24 sm:py-32 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div className="reveal">
            <p className="label flex items-center gap-3 text-lamp">
              <span className="rule" aria-hidden="true" /> The namesake
            </p>
            <h2 id="name-h" className="mt-5 text-4xl sm:text-5xl">
              Named for an alumnus who gave back.
            </h2>
          </div>
          <div className="reveal space-y-6 text-lg leading-relaxed text-mist/85">
            <p>
              The hall honours the late Dr. Jean Nelson Aka, a distinguished alumnus of the University
              <Cite id="cloth" /> and a former Managing Director of Ecobank.<Cite id="gna" /> He helped raise the funds
              that built Legon&apos;s Jubilee Hall.<Cite id="graphic2013" />
            </p>
            <p className="font-display text-2xl italic text-mist sm:text-3xl">&ldquo;Whatever you do in life, do it well.&rdquo;</p>
            <p className="text-base text-mist-muted">
              His advice, shared by his son Pascal Aka at the hall&apos;s memorial lecture in 2024.<Cite id="rose" />
            </p>
            <Link href="/hall/" className="link-night inline-flex min-h-[44px] items-center">
              Read the full story <span aria-hidden="true">&nbsp;→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* MEMORIES */}
      <section aria-labelledby="mem-h" className="wrap pt-24 sm:pt-32">
        <div className="reveal flex flex-col items-start justify-between gap-8 rounded-[28px] border border-line bg-white p-8 sm:p-14 md:flex-row md:items-end">
          <div>
            <p className="label flex items-center gap-3 text-lamp-deep">
              <span className="rule" aria-hidden="true" /> Memories
            </p>
            <h2 id="mem-h" className="mt-5 max-w-xl text-4xl sm:text-5xl">
              Lived here too? Your story belongs on this site.
            </h2>
          </div>
          <Link href="/memories/" className="btn-ink shrink-0">
            Share a memory <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  )
}
