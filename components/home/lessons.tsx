"use client"

import { ReadAlong, ScrollBand, useScrollProgress } from "@/components/site/kinetic"
import { Section } from "@/components/site/section"
import { lessons } from "@/lib/site"

function Lesson({ title, line, index }: { title: string; line: string; index: number }) {
  const ref = useScrollProgress<HTMLLIElement>()
  return (
    <li ref={ref} className="lesson-card">
      <p className="meta text-route">0{index + 1}</p>
      <h3 className="mt-2 text-2xl leading-tight">{title}</h3>
      <ReadAlong text={line} className="mt-3 leading-relaxed text-muted-foreground" />
    </li>
  )
}

export function Lessons() {
  const titles = lessons.map((l) => l.title)
  return (
    <Section id="lessons" eyebrow="lessons from the road" title="three things the road taught me">
      <ScrollBand rows={[titles, [...titles].reverse()]} />
      <ul className="stagger mt-12 grid gap-10 md:grid-cols-3">
        {lessons.map((l, i) => (
          <Lesson key={l.title} title={l.title} line={l.line} index={i} />
        ))}
      </ul>
    </Section>
  )
}
