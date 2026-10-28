import { ArrowUpRight } from "lucide-react"
import type { Project } from "@/lib/projects"

export default function ProjectRow({ project, headingLevel = "h3" }: { project: Project; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel
  const primary = project.links?.[0]

  return (
    <article className="group grid gap-6 border-t border-border py-10 md:grid-cols-12 md:gap-10">
      <div className="overflow-hidden rounded-md border border-border bg-muted md:col-span-7">
        <img
          src={project.image}
          alt={project.imageAlt}
          loading="lazy"
          className={`mono-img aspect-[16/10] h-full w-full ${project.contain ? "bg-white object-contain p-2" : "object-cover"}`}
        />
      </div>
      <div className="flex flex-col md:col-span-5">
        <Heading className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          {primary ? (
            <a href={primary.href} target="_blank" rel="noopener noreferrer" className="hover:underline hover:underline-offset-4">
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </Heading>
        <p className="mt-4 leading-relaxed text-muted-foreground">{project.summary}</p>
        <p className="mt-5 text-sm text-muted-foreground">
          {project.tags.join(", ")}
        </p>
        {project.links && project.links.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {project.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4 hover:decoration-2"
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
