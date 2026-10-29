import type { Metadata } from "next"
import { Callout, Cite, PageHead, Ph, Section } from "@/components/ui"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Life in the hall",
  description: "The Royals, Hall Week, basketball, the hall cloth and the facilities at Jean Nelson Aka Hall.",
}

const traditions: { title: string; body: string; cite: string; cite2?: string }[] = [
  {
    title: "We're the Royals",
    body: "Residents of Jean Nelson Aka Hall are called Royals, and see themselves as leaders in campus social life.",
    cite: "halls",
  },
  {
    title: "Basketball",
    body: "The hall is known for its basketball team. If you play, you'll find people to play with.",
    cite: "halls",
  },
  {
    title: "Hall Week",
    body: "The hall celebrates Hall Week. The hall cloth was launched during Hall Week in October 2014.",
    cite: "cloth",
  },
  {
    title: "The hall cloth",
    body: "The hall has its own cloth, approved by the University. It was the first of the four new halls to have both its logo and hall cloth approved.",
    cite: "cloth",
  },
  {
    title: "The JCR",
    body: "The Junior Common Room (JCR) is the students' own body. It has driven real improvements, like putting ceiling fans in all rooms and opening the Rose Aka Conference Room in 2024.",
    cite: "cloth",
    cite2: "rose",
  },
]

export default function LifePage() {
  return (
    <>
      <PageHead
        eyebrow="Life in the hall"
        title="More than a place to sleep"
        intro="Hall life at Legon is a big deal. Here's what we know about the Royals, sourced where we can."
      />

      <section className="wrap py-12 sm:py-16" aria-labelledby="trad-h">
        <h2 id="trad-h" className="text-3xl sm:text-4xl">
          Traditions
        </h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {traditions.map((t) => (
            <li key={t.title} className="reveal rounded-2xl border border-line bg-white p-7 transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(15,17,21,0.35)]">
              <h3 className="text-2xl">{t.title}</h3>
              <p className="mt-3 text-ink-muted">
                {t.body}
                <Cite id={t.cite} />
                {t.cite2 ? <Cite id={t.cite2} /> : null}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-ink-muted">
          This year's Hall Week dates: <Ph value={site.hallWeekDates} />
        </p>
      </section>

      <section aria-labelledby="fac-h" className="on-night relative isolate overflow-hidden bg-night text-mist">
        <span aria-hidden="true" className="glow-drift absolute -left-20 top-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(212,178,106,0.3),transparent)] blur-3xl" />
        <div className="wrap grid gap-12 py-20 sm:py-28 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="reveal">
            <p className="label flex items-center gap-3 text-lamp"><span className="rule" aria-hidden="true" /> In the building</p>
            <h2 id="fac-h" className="mt-5 text-4xl sm:text-5xl">Facilities</h2>
          </div>
          <dl className="reveal grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
            {[
              ["430", "self-contained rooms", <Cite key="a" id="cloth" />],
              ["Fans", "ceiling fans in the rooms, installed by the JCR, with more donated in 2016", <><Cite id="cloth" /><Cite id="fans" /></>],
              ["~100", "seats in the Rose Aka Conference Room, air-conditioned, with a 65-inch screen", <Cite key="c" id="rose" />],
              ["Green", "rainwater harvesting and biogas, built into the four new halls", <Cite key="d" id="graphic2013" />],
            ].map(([k, v, c], i) => (
              <div key={i} className="bg-night p-7 sm:p-8">
                <dt className="font-display text-4xl text-mist">{k}</dt>
                <dd className="mt-3 text-mist-muted">{v}{c}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section title="Who runs the hall" id="people">
        <p>
          Like every hall at Legon, Jean Nelson Aka Hall has a Hall Master and a Senior Tutor, supported by tutors, hall
          administration and the JCR. Names change over time, so we don't list past officers here.
        </p>
        <ul className="mt-4 space-y-1">
          <li>
            Hall Master: <Ph value={site.hallMaster} />
          </li>
          <li>
            Senior Tutor: <Ph value={site.seniorTutor} />
          </li>
          <li>
            Hall office: <Ph value={site.hallOfficePhone} />
          </li>
          <li>
            Porters' lodge: <Ph value={site.portersPhone} />
          </li>
        </ul>
        <div className="mt-6">
          <Callout title="Got something to add?">
            <p>
              Canteen, shop, reading rooms, the gym, block names, favourite spots. We'd rather leave it out than guess. If
              you know, share it on the Memories page and we'll add it.
            </p>
          </Callout>
        </div>
      </Section>
    </>
  )
}
