import type { Metadata } from "next"
import PageHeader from "@/components/page-header"
import { EMAIL, LINKEDIN } from "@/components/social-icons"
import { VolunteerGroups } from "@/lib/profile-data"

export const metadata: Metadata = { title: "About | Benedict Frimpong Boateng" }

const skillGroups = [
  { title: "SAP and business systems", items: ["SAP S/4HANA Cloud & ERP", "Excel automation & reporting", "SQL/MySQL & data warehousing"] },
  { title: "Learning design", items: ["Instructional design & course creation", "Rise 360, Articulate & Assima", "Team leadership & public speaking"] },
  { title: "AI and engineering", items: ["Prompt engineering & AI automation", "Claude Code, MCP & agent tooling", "Python, Java & C++", "Web development"] },
  { title: "Data and quality", items: ["Data analysis & visualization", "Software, AI & UI/UX testing", "UI/UX design & wireframing", "Cybersecurity fundamentals"] },
]

export default function AboutPage() {
  return (
    <main>
      <PageHeader title="About">
        SAP S/4HANA Cloud consultant, instructional designer and Statistics with Computer Science student based in Accra, Ghana.
      </PageHeader>

      <section className="page">
        <div className="grid gap-12 border-t border-border pt-12 md:grid-cols-12">
          <aside className="md:col-span-4">
            <div className="overflow-hidden rounded-md border border-border md:sticky md:top-24">
              <img
                src="/images/benedict-frimpong-boateng.jpeg"
                alt="Portrait of Benedict Frimpong Boateng"
                className="aspect-[4/5] w-full object-cover grayscale"
              />
            </div>
          </aside>

          <div className="space-y-16 md:col-span-8">
            <div className="max-w-2xl space-y-5 text-lg leading-relaxed">
              <p>
                I&apos;m studying Statistics with Computer Science at the University of Ghana (2022 to 2026). Most recently I worked
                as an SAP Consultant &amp; Educational Content Creator and Team Lead at CodeRaccoon, combining SAP S/4HANA Cloud
                consulting with instructional design for internal and client-facing training programmes.
              </p>
              <p>
                I build e-learning courses, interactive simulations and learning content with Rise 360, Articulate and the Assima
                platform. I&apos;ve completed SAP&apos;s End-to-End Business Processes course, the ALX AI Starter Kit and Claude
                Academy certifications from Anthropic.
              </p>
              <p className="text-base text-muted-foreground">
                Reach me at{" "}
                <a href={`mailto:${EMAIL}`} className="text-link break-all text-foreground">
                  {EMAIL}
                </a>{" "}
                or on{" "}
                <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-link text-foreground">
                  LinkedIn
                </a>
                .
              </p>
            </div>

            <section aria-labelledby="skills-heading">
              <h2 id="skills-heading" className="text-3xl font-semibold tracking-tight">
                Skills
              </h2>
              <div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {skillGroups.map((group) => (
                  <div key={group.title} className="border-t border-border pt-4">
                    <h3 className="font-semibold">{group.title}</h3>
                    <ul className="mt-3 space-y-1.5 text-muted-foreground">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="community-heading">
              <h2 id="community-heading" className="mb-6 text-3xl font-semibold tracking-tight">
                Community and leadership
              </h2>
              <VolunteerGroups />
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}
