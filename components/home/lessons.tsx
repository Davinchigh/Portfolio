import { Section } from "@/components/site/section"
import { lessons } from "@/lib/site"

export function Lessons() {
  return (
    <Section id="lessons" eyebrow="lessons from the road" title="three things the road taught me">
      <ul className="grid gap-10 md:grid-cols-3">
        {lessons.map((l) => (
          <li key={l.title} className="border-l-2 border-route/40 pl-5">
            <h3 className="text-2xl leading-tight">{l.title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{l.line}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
