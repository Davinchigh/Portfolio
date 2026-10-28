import type { Metadata } from "next"
import Link from "next/link"
import PageHeader from "@/components/page-header"
import ProjectRow from "@/components/project-row"
import { projects } from "@/lib/projects"

export const metadata: Metadata = { title: "Projects | Benedict Frimpong Boateng" }

export default function ProjectsPage() {
  return (
    <main>
      <PageHeader title="Projects">
        Academic work, technical builds and design projects. For interface work in more detail, see my{" "}
        <Link href="/figma-designs" className="text-link text-foreground">
          designs
        </Link>
        .
      </PageHeader>

      <section className="page" aria-label="All projects">
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} headingLevel="h2" />
        ))}
      </section>
    </main>
  )
}
