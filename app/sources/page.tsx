import type { Metadata } from "next"
import { Callout, Ext, PageHead, Ph, Section } from "@/components/ui"
import { site, sources } from "@/lib/site"

export const metadata: Metadata = {
  title: "Sources and credits",
  description: "Where every fact on this site comes from, plus image and font credits.",
}

export default function SourcesPage() {
  return (
    <>
      <PageHead
        eyebrow="Sources and credits"
        title="Where this all comes from"
        intro="Every fact on this site links to a numbered source below. If we couldn't find a source, we left it out."
      />

      <section className="wrap py-12 sm:py-16" aria-labelledby="src-h">
        <h2 id="src-h" className="text-3xl sm:text-4xl">
          Sources
        </h2>
        <ol className="mt-6 max-w-3xl space-y-4">
          {sources.map((s, i) => (
            <li key={s.id} id={`src-${s.id}`} className="scroll-mt-28 rounded-2xl border border-ink/10 bg-white p-5">
              <p className="text-sm font-bold text-ink-muted">
                [{i + 1}] {s.publisher}, {s.date}
              </p>
              <p className="mt-1">
                <Ext href={s.href}>{s.title}</Ext>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <Section title="Still to confirm" id="unknown">
        <p>
          We left these out because we couldn't verify them from a reliable source. If you can help, please get in touch.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>The hall's official colours and the design of the hall cloth and logo.</li>
          <li>Dr. Jean Nelson Aka's dates, his course at Legon and his years at Ecobank.</li>
          <li>The current Hall Master, Senior Tutor, and office and porters' phone numbers.</li>
          <li>Current fees and room types, including for postgraduates.</li>
          <li>This year's Hall Week dates, block names and facilities like the canteen or shop.</li>
          <li>An older online encyclopedia copy mentions an emblem, the JCR's founding date and a JCR colour. We couldn't confirm these anywhere else, so we don't repeat them.</li>
        </ul>
      </Section>

      <Section title="Credits" id="credits">
        <ul className="list-disc space-y-2 pl-5">
          <li>The map sketch and the JN monogram are original graphics made for this site. The monogram is not the hall&apos;s crest.</li>
          <li>Fonts: Newsreader (Production Type) and Inter (Rasmus Andersson), both under the SIL Open Font Licence.</li>
          <li>No University of Ghana or hall logos, crests or photos are used.</li>
        </ul>
        <div className="mt-6">
          <Callout title="Corrections">
            <p>
              Spotted something wrong? Email <Ph value={site.email} /> or message <Ph value={site.whatsapp} /> on WhatsApp.
            </p>
          </Callout>
        </div>
      </Section>
    </>
  )
}
