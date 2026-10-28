import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Download } from "lucide-react"
import PageHeader from "@/components/page-header"
import { EMAIL, GITHUB, LINKEDIN } from "@/components/social-icons"
import { Entry, VolunteerGroups } from "@/lib/profile-data"

export const metadata: Metadata = { title: "Resume | Benedict Frimpong Boateng" }

const experience = [
  {
    title: "SAP Consultant & Educational Content Creator (Team Lead)",
    org: "CodeRaccoon",
    dates: "Nov 2025 to Aug 2026",
    detail:
      "Combined SAP S/4HANA Cloud consulting with instructional design. Built e-learning courses, interactive simulations and content with Rise 360, Articulate and Assima. Led software, AI, UI/UX and beta testing, and trained the team in prompt engineering.",
  },
  {
    title: "Database Management Intern (Odoo)",
    org: "NextIT Consult",
    dates: "May to Aug 2025",
    detail: "Managed business data entry and warehousing in Odoo and supported daily operations and digital tasks.",
  },
  {
    title: "IT Intern",
    org: "KNG (Knowledge Network Group)",
    dates: "Oct to Nov 2023",
    detail: "Completed Java and OOP training, assisted with software development and collaborated on team projects.",
  },
]

const education = [
  { title: "University of Ghana", subtitle: "BSc Statistics with Computer Science", dates: "2022 to 2026" },
  {
    title: "Brandenburg University of Applied Sciences",
    subtitle: "End-to-End Business Processes with SAP S/4HANA Cloud (IEE2E)",
    dates: "June 2026",
  },
  { title: "Claude Academy by Anthropic", subtitle: "Certifications", dates: "Sept 2026 to present" },
  { title: "ALX", subtitle: "AI Starter Kit", dates: "Apr to May 2025" },
  { title: "Ghana National College", subtitle: "WASSCE, General Arts", dates: "2018 to 2021" },
]

const certifications = [
  {
    title: "Claude Academy by Anthropic",
    detail: "Claude Code 101, Claude Code in Action, MCP, AI Fluency, Claude 101, AI Capabilities and Limitations, Claude Cowork, Human Agent Teams",
  },
  { title: "SAP S/4HANA Cloud IEE2E Certificate", detail: "Brandenburg University of Applied Sciences, 2026" },
  { title: "AHK Intercultural Training Certificate for IT Professionals", detail: "2026" },
  { title: "Course Creation Certificate", detail: "CodeRaccoon, 2025" },
  { title: "Prompt Engineering Certificate", detail: "Udemy, 2025" },
  { title: "German Language A1 & A2", detail: "Ambylon, 2025" },
  { title: "ALX AI Starter Kit Certificate", detail: "ALX Ghana, 2025" },
  { title: "Front-End Development Fundamentals", detail: "SoloLearn, 2022" },
]

const skills = [
  "SAP S/4HANA Cloud & ERP (Fiori, MM/Supply Chain, Logistics, Accounting, HCM, DMS)",
  "Instructional design & course creation (Rise 360, Articulate, Assima)",
  "Prompt engineering, AI automation and AI agent tooling",
  "Software, AI and UI/UX testing",
  "Python, Java, C++, SQL/MySQL and data warehousing",
  "Data analysis, data visualization and web development",
  "UI/UX design & wireframing, Excel automation & reporting",
  "Microsoft Office, team leadership, public speaking, communication & problem solving",
  "Cybersecurity fundamentals",
]

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-4 border-t border-border pt-8 md:grid-cols-12 md:gap-10">
      <h2 id={id} className="text-xl font-semibold tracking-tight md:col-span-3">
        {title}
      </h2>
      <div className="md:col-span-9">{children}</div>
    </section>
  )
}

export default function ResumePage() {
  return (
    <main>
      <PageHeader title="Resume">
        <p>SAP S/4HANA Cloud consultant and instructional designer, open to work.</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 text-base">
          <a
            href="/Benedict_Frimpong_Boateng_CV.pdf"
            download
            className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-85"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download CV (PDF)
          </a>
          <a href={`mailto:${EMAIL}`} className="text-link break-all text-foreground">
            {EMAIL}
          </a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-link text-foreground">
            LinkedIn
          </a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="text-link text-foreground">
            GitHub
          </a>
        </div>
      </PageHeader>

      <div className="page space-y-16">
        <Block id="experience" title="Experience">
          <ul>
            {experience.map((job) => (
              <Entry key={job.title} title={job.title} subtitle={job.org} dates={job.dates}>
                {job.detail}
              </Entry>
            ))}
          </ul>
        </Block>

        <Block id="education" title="Education">
          <ul>
            {education.map((item) => (
              <Entry key={item.title} title={item.title} subtitle={item.subtitle} dates={item.dates} />
            ))}
          </ul>
        </Block>

        <Block id="projects" title="Projects">
          <ul>
            <Entry title="Time Series Analysis of COVID-19 Cases in Ghana" subtitle="Final year project, Python">
              Reproducible pipeline for forecasting Ghana&apos;s daily COVID-19 cases using WHO data and statistical time series
              models.
            </Entry>
          </ul>
        </Block>

        <Block id="skills" title="Skills">
          <ul className="space-y-2 leading-relaxed">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </Block>

        <Block id="certifications" title="Certifications">
          <ul>
            {certifications.map((cert) => (
              <Entry key={cert.title} title={cert.title} subtitle={cert.detail} />
            ))}
          </ul>
        </Block>

        <Block id="community" title="Volunteering and leadership">
          <VolunteerGroups compact />
        </Block>
      </div>
    </main>
  )
}
