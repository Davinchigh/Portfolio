import type { Metadata } from "next"
import Link from "next/link"
import { Callout, Cite, PageHead, Section } from "@/components/ui"

export const metadata: Metadata = {
  title: "The hall and its namesake",
  description: "How Jean Nelson Aka Hall came to be, and who Dr. Jean Nelson Aka was.",
}

const timeline = [
  { when: "8 July 2011", what: "Then Vice-Chancellor Prof. Ernest Aryeetey inaugurates the hall.", cite: "cloth" },
  { when: "2011/12", what: "The first students move in.", cite: "cloth" },
  { when: "10 October 2014", what: "The hall cloth is launched during Hall Week.", cite: "cloth" },
  { when: "August 2016", what: "The local MP donates 50 ceiling fans to the hall.", cite: "fans" },
  { when: "July 2024", what: "The Rose Aka Conference Room opens, followed by a memorial lecture.", cite: "rose" },
]

export default function HallPage() {
  return (
    <>
      <PageHead
        eyebrow="The hall"
        title="One of Legon's four newer halls"
        intro="A short history of the hall, and of the man it's named after. Everything here comes from published sources, linked as you go."
      />

      <Section title="How it started" id="start">
        <p>
          Jean Nelson Aka Hall is one of four halls of residence built on the southern part of the Legon campus, off the
          road to the Noguchi Memorial Institute for Medical Research.<Cite id="cloth" /> Its three sister halls are named
          after Dr. Hilla Limann, Prof. Alexander A. Kwapong and Mrs. Elizabeth Frances Sey.<Cite id="gna" />
        </p>
        <p>
          It has 430 self-contained rooms and space for about 1,700 students. The University runs it as a mixed hall, home
          to undergraduates, postgraduates and international students.<Cite id="cloth" /> In the four new halls, four
          students share a room, and the buildings were designed with rainwater harvesting and biogas facilities.
          <Cite id="graphic2013" />
        </p>
        <p>
          You'll often hear it shortened to "Jean Nelson Hall". Same place.
        </p>
      </Section>

      <section className="wrap pb-12" aria-labelledby="tl-h">
        <h2 id="tl-h" className="text-3xl sm:text-4xl">
          Timeline
        </h2>
        <ol className="mt-6 max-w-2xl border-l-4 border-lamp pl-6">
          {timeline.map((t) => (
            <li key={t.when} className="relative pb-6 last:pb-0">
              <span className="absolute -left-[2.15rem] top-1.5 h-4 w-4 rounded-full border-4 border-paper bg-night" aria-hidden="true" />
              <p className="font-bold">{t.when}</p>
              <p className="text-ink-muted">
                {t.what}
                <Cite id={t.cite} />
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-8 max-w-2xl">
          <Callout title="A note on the opening date">
            <p>
              A 2014 University news story says the hall was inaugurated on 8 July 2011.<Cite id="cloth" /> A University
              students page says 2012.<Cite id="halls" /> Both agree students were living here in the 2011/12 academic
              year, so that's what we go with.
            </p>
          </Callout>
        </div>
      </section>

      <Section title="Who was Jean Nelson Aka?" id="namesake">
        <p>
          The hall is named after the late Dr. Jean Nelson Aka, a distinguished alumnus of the University of Ghana.
          <Cite id="cloth" /> He was a former Managing Director of Ecobank.<Cite id="gna" />
        </p>
        <p>
          He was instrumental in mobilising funds for the construction of the University's Jubilee Hall.
          <Cite id="graphic2013" /> When the University named a hall after him, it was described as a fitting honour to
          his memory.<Cite id="cloth" />
        </p>
        <p>
          His family has stayed close to the hall. In July 2024 they supported the completion of the Rose Aka Conference
          Room, and his son, the filmmaker Pascal Aka, gave a memorial lecture on the theme "Service with Purpose". He
          shared his father's advice: "Whatever you do in life, do it well."<Cite id="rose" />
        </p>
        <p>
          We couldn't find reliable public details of Dr. Aka's dates, his course at Legon, or his years at Ecobank, so we
          have left them out rather than guess. If you knew him or his work, please{" "}
          <Link href="/memories/" className="link">
            get in touch
          </Link>
          .
        </p>
      </Section>
    </>
  )
}
