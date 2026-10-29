import type { Metadata } from "next"
import Link from "next/link"
import { Cite, PageHead } from "@/components/ui"

export const metadata: Metadata = {
  title: "FAQ",
  description: "Quick answers about Jean Nelson Aka Hall and this unofficial site.",
}

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "Is this the official hall website?",
    a: (
      <>
        No. It's an unofficial site made by a former resident. It isn't run by the University of Ghana or the hall
        administration. For anything official, go to the University's own website.
      </>
    ),
  },
  {
    q: "Can I apply for a room here?",
    a: (
      <>
        No. Applications only happen on the University's own systems. Our{" "}
        <Link href="/rooms/" className="link">
          rooms page
        </Link>{" "}
        explains the process and links to the official portal.
      </>
    ),
  },
  {
    q: "Someone is offering to sell me a bed. Should I pay?",
    a: (
      <>
        No. The University says no student or parent should pay anyone for a bed, and both sides can be sanctioned.
        <Cite id="alloc" />
      </>
    ),
  },
  {
    q: "How do you spell the name?",
    a: (
      <>
        Jean Nelson Aka Hall. People often shorten it to Jean Nelson Hall.<Cite id="cloth" />
      </>
    ),
  },
  {
    q: "What's the motto?",
    a: (
      <>
        Lux in Tenebris, which means Light in Darkness.<Cite id="cloth" />
      </>
    ),
  },
  {
    q: "Is it a mixed hall?",
    a: (
      <>
        Yes. It houses undergraduates, postgraduates and international students.<Cite id="cloth" />
      </>
    ),
  },
  {
    q: "How many people share a room?",
    a: (
      <>
        Reports on the four newer halls say four students share a room.<Cite id="graphic2013" /> Check with the University
        for current arrangements, especially for postgraduates.
      </>
    ),
  },
  {
    q: "Are these the hall's official colours?",
    a: (
      <>
        No. The purple-blue night and lamplight gold are this site's own design, inspired by the motto. We couldn't
        confirm the hall's official colours.
      </>
    ),
  },
  {
    q: "Are those photos of the hall?",
    a: (
      <>
        No. The two pictures on this site are illustrative and AI-generated, and they're labelled that way. The building
        drawing on the home page is an illustration, not the real building.
      </>
    ),
  },
  {
    q: "I found a mistake. What do I do?",
    a: (
      <>
        Please tell us using the details on the{" "}
        <Link href="/memories/" className="link">
          memories page
        </Link>
        . Every fact on this site links to where it came from, so you can check it too.
      </>
    ),
  },
]

export default function FaqPage() {
  return (
    <>
      <PageHead eyebrow="FAQ" title="Quick answers" />
      <section className="wrap py-12 sm:py-16" aria-label="Questions and answers">
        <div className="max-w-3xl divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-white">
          {faqs.map((f) => (
            <details key={f.q} className="group p-0">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-lg font-bold">
                {f.q}
                <span aria-hidden="true" className="text-2xl text-lamp-deep transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 text-ink-muted">{f.a}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
