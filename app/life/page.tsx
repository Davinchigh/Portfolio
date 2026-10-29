import type { Metadata } from "next"
import { AiFigure, Callout, Cite, PageHead, Ph, Section } from "@/components/ui"
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
            <li key={t.title} className="rounded-3xl border border-ink/10 bg-white p-6">
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

      <section className="bg-paper-2">
        <div className="wrap grid items-center gap-10 py-14 lg:grid-cols-2">
          <AiFigure src="/img/court.webp" alt="An empty outdoor basketball court at sunset with a ball resting near the hoop." />
          <div>
            <h2 className="text-3xl sm:text-4xl">Facilities</h2>
            <ul className="mt-5 list-disc space-y-2 pl-5">
              <li>
                Self-contained rooms, 430 of them.<Cite id="cloth" />
              </li>
              <li>
                Ceiling fans in the rooms, installed by the JCR, with more donated in 2016.<Cite id="cloth" />
                <Cite id="fans" />
              </li>
              <li>
                The Rose Aka Conference Room: about 100 seats, air-conditioned, with a 65-inch screen and sound system.
                <Cite id="rose" />
              </li>
              <li>
                Rainwater harvesting and biogas facilities, built into the four new halls.<Cite id="graphic2013" />
              </li>
            </ul>
          </div>
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
