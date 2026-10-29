import type { Metadata } from "next"
import { Callout, Cite, PageHead, Section } from "@/components/ui"

export const metadata: Metadata = {
  title: "Getting around",
  description: "A rough, not-to-scale sketch of where Jean Nelson Aka Hall sits on the Legon campus.",
}

function Sketch() {
  return (
    <svg viewBox="0 0 800 560" className="h-auto w-full" role="img" aria-labelledby="map-t map-d">
      <title id="map-t">Rough sketch of the hall's location on the Legon campus</title>
      <desc id="map-d">
        The main campus is to the north. A road runs south toward the Noguchi Memorial Institute. Off that road, on the
        southern part of campus, are the four newer halls, including Jean Nelson Aka Hall. Not to scale.
      </desc>
      <rect width="800" height="560" rx="24" fill="#F3ECDD" />
      <g fill="none" stroke="#C9BFAE" strokeWidth="1" opacity="0.6">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={`h${i}`} d={`M0 ${60 * (i + 1)}H800`} />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <path key={`v${i}`} d={`M${60 * (i + 1)} 0V560`} />
        ))}
      </g>
      {/* compass */}
      <g transform="translate(720 70)">
        <circle r="30" fill="#FBF7EF" stroke="#1B1830" strokeWidth="2" />
        <path d="M0 -22L7 4H-7Z" fill="#1B1830" />
        <text y="-34" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1B1830">N</text>
      </g>
      {/* main campus */}
      <rect x="250" y="40" width="300" height="100" rx="18" fill="#2C2659" />
      <text x="400" y="85" textAnchor="middle" fontSize="24" fill="#EDE9F7" fontFamily="Fraunces, Georgia, serif">Main campus</text>
      <text x="400" y="114" textAnchor="middle" fontSize="16" fill="#B9B3D6">older halls, lecture areas</text>
      {/* road */}
      <path d="M400 140C400 230 360 280 380 360S430 470 420 520" fill="none" stroke="#1B1830" strokeWidth="14" strokeLinecap="round" />
      <path d="M400 140C400 230 360 280 380 360S430 470 420 520" fill="none" stroke="#FBF7EF" strokeWidth="2" strokeDasharray="10 10" />
      <text x="230" y="250" fontSize="16" fill="#1B1830" fontWeight="700">Road toward</text>
      <text x="230" y="270" fontSize="16" fill="#1B1830" fontWeight="700">Noguchi</text>
      {/* four halls cluster */}
      <g>
        <rect x="455" y="290" width="290" height="190" rx="22" fill="#FBF7EF" stroke="#8A5300" strokeWidth="2" strokeDasharray="8 6" />
        <text x="600" y="320" textAnchor="middle" fontSize="16" fontWeight="700" fill="#55506E">The four newer halls</text>
        <rect x="475" y="335" width="120" height="58" rx="10" fill="#14112B" />
        <text x="535" y="360" textAnchor="middle" fontSize="15" fill="#F2B84B" fontWeight="700">Jean Nelson</text>
        <text x="535" y="380" textAnchor="middle" fontSize="15" fill="#F2B84B" fontWeight="700">Aka Hall</text>
        <rect x="605" y="335" width="120" height="58" rx="10" fill="#DCD3C2" />
        <text x="665" y="369" textAnchor="middle" fontSize="15" fill="#1B1830">Hilla Limann</text>
        <rect x="475" y="403" width="120" height="58" rx="10" fill="#DCD3C2" />
        <text x="535" y="437" textAnchor="middle" fontSize="15" fill="#1B1830">Alex Kwapong</text>
        <rect x="605" y="403" width="120" height="58" rx="10" fill="#DCD3C2" />
        <text x="665" y="437" textAnchor="middle" fontSize="15" fill="#1B1830">Elizabeth Sey</text>
      </g>
      {/* noguchi */}
      <rect x="300" y="490" width="240" height="48" rx="12" fill="#55506E" />
      <text x="420" y="520" textAnchor="middle" fontSize="16" fill="#FBF7EF" fontWeight="700">Noguchi Institute</text>
      <text x="40" y="40" fontSize="15" fill="#55506E" fontWeight="700">Not to scale.</text>
      <text x="40" y="60" fontSize="15" fill="#55506E" fontWeight="700">Positions are approximate.</text>
    </svg>
  )
}

export default function MapPage() {
  return (
    <>
      <PageHead
        eyebrow="Getting around"
        title="Where to find us"
        intro="A hand-drawn sketch, not a real map. It's here to give you your bearings, nothing more."
      />
      <div className="wrap pt-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-ink/10 bg-white p-3 sm:p-5">
          <Sketch />
        </div>
      </div>
      <Section title="What we actually know" id="known">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            The hall is on the southern part of the Legon campus.<Cite id="cloth" />
          </li>
          <li>
            It sits off the road to the Noguchi Memorial Institute for Medical Research.<Cite id="cloth" />
          </li>
          <li>
            It's one of four newer halls built together. The others are named after Hilla Limann, Alexander Kwapong and
            Elizabeth Frances Sey.<Cite id="gna" />
          </li>
        </ul>
        <div className="mt-6">
          <Callout title="The order of the four halls in the sketch is made up">
            <p>
              We couldn't confirm exactly how the four halls are laid out next to each other, so the boxes are just a
              cluster. For real directions, use a maps app and search for "Jean Nelson Aka Hall, Legon", or ask any
              porter or Royal.
            </p>
          </Callout>
        </div>
      </Section>
    </>
  )
}
