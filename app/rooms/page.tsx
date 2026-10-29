import type { Metadata } from "next"
import { Callout, Cite, Ext, PageHead, Ph, Section } from "@/components/ui"
import { official, site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Rooms and how to get one",
  description: "How on-campus accommodation works at the University of Ghana, and where to apply officially.",
}

const steps = [
  {
    title: "Complete your academic registration",
    body: "The University asks freshers to finish academic registration first. Check the fees you must pay before you can register.",
  },
  {
    title: "Opt in on the official portal",
    body: "For the 2025/26 intake, Level 100 students who wanted a bed had to opt in on the STS portal before a deadline.",
  },
  {
    title: "Wait for the allocation",
    body: "UG allocated available beds to freshers through an open, random draw under its \"In-Out-Out-Out\" residence policy.",
  },
  {
    title: "Have a plan B",
    body: "Accommodation is not guaranteed with admission. If you don't get a bed, you'll need to arrange your own place to stay.",
  },
]

export default function RoomsPage() {
  return (
    <>
      <PageHead
        eyebrow="Rooms"
        title="Getting a room, the official way"
        intro="This page explains how it has worked. It is not the application. Applications only happen on the University's own systems."
      />

      <div className="wrap pt-10">
        <Callout tone="warn" title="Never pay anyone for a bed">
          <p>
            The University says that under no circumstances should a student or parent pay money to anyone for a bed. Both
            the buyer and the seller can be sanctioned. Staying in a room you weren't allocated ("perching") is also
            banned.<Cite id="alloc" />
          </p>
        </Callout>
      </div>

      <section className="wrap py-12 sm:py-16" aria-labelledby="how-h">
        <h2 id="how-h" className="text-3xl sm:text-4xl">
          How it worked for freshers in 2025/26
        </h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-3xl border border-ink/10 bg-white p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-night font-display text-lg text-lamp" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl">{s.title}</h3>
                <p className="mt-2 text-ink-muted">
                  {s.body}
                  <Cite id="alloc" />
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-prose text-ink-muted">
          Dates and rules change every year. Always check the latest notice from the University before you act.
        </p>
      </section>

      <section className="bg-night text-mist">
        <div className="wrap py-14">
          <h2 className="text-3xl sm:text-4xl">Official links</h2>
          <p className="mt-3 max-w-prose text-mist-muted">These take you off this site to the University's own pages.</p>
          <ul className="mt-6 space-y-3 text-lg">
            {[official.sts, official.aad, official.ug, official.allocationNotice].map((l) => (
              <li key={l.href}>
                <Ext href={l.href} night>
                  {l.label}
                </Ext>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-mist-muted">
            Academic Affairs, as listed by the University: pad@ug.edu.gh, +233 302 213820 or +233 302 213850.
            <a href="/sources/#src-aad" className="link-night ml-1 text-sm">
              [source]
            </a>
          </p>
        </div>
      </section>

      <Section title="What the rooms are like" id="rooms">
        <p>
          The hall has 430 self-contained rooms for about 1,700 residents.<Cite id="cloth" /> In the four new halls, four
          students share a room.<Cite id="graphic2013" /> It's a mixed hall for undergraduates, postgraduates and
          international students.<Cite id="cloth" />
        </p>
        <p>
          Fees: <Ph value={site.fees} />. Fees are set by the University each year and published on its website. We don't
          copy them here because old numbers cause confusion.
        </p>
      </Section>
    </>
  )
}
