import { builds, certifications, designs, lessons, person, road, roles, stack, ventures, work } from "@/lib/site"
import type { Doc } from "./search"

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
const when = (value: string) => {
  if (value === "present" || /^\d{4}$/.test(value)) return value
  const [y, m] = value.split("-")
  return `${MONTHS[Number(m) - 1]} ${y}`
}

/** Everything on the site, as short passages. Built from the same data the pages render, so it cannot go stale. */
export function corpus(): Doc[] {
  const docs: Doc[] = [
    {
      id: "about",
      kind: "about",
      title: `${person.fullName}, ${person.role}`,
      text: `${person.fullName} is an ${person.role} based in ${person.location}. ${person.bio} Benedict is ${person.status}, remote or in Accra.`,
      href: "/",
    },
    {
      id: "contact",
      kind: "contact",
      title: "contact and availability",
      text: `Email ${person.email}. ${person.fullName} is ${person.status} and can start right away. The CV can be downloaded from the resume page.`,
      href: "/#contact",
    },
  ]

  docs.push({
    id: "road",
    kind: "education and the road so far",
    title: "education and the road so far",
    text: `Benedict studied for a BSc in Statistics with Computer Science at the University of Ghana, Legon, from 2022 to 2026. ${road.map((r) => `${r.year}, ${r.place}: ${r.line}.`).join(" ")}`,
    href: "/",
  })

  for (const r of roles) {
    docs.push({
      id: `role:${r.id}`,
      kind: "experience",
      title: `${r.role} at ${r.company}`,
      text: [`${r.role} at ${r.company}, ${r.start === r.end ? when(r.start) : `${when(r.start)} to ${when(r.end)}`}.`, r.summary, ...(r.bullets ?? [])]
        .filter(Boolean)
        .join(" "),
      href: "/#experience",
    })
  }

  for (const w of work) {
    docs.push({
      id: `work:${w.slug}`,
      kind: "project",
      title: w.title,
      text: `${w.title} (${w.org}): ${w.hook} The problem: ${w.problem} What Benedict did: ${w.role} The result: ${w.outcome} Built with ${w.tags.join(", ")}.`,
      href: `/projects#${w.slug}`,
    })
  }

  for (const b of builds) {
    docs.push({ id: `build:${b.slug}`, kind: "app you can try", title: b.title, text: `${b.title}: ${b.line} ${b.detail}`, href: "/#builds" })
  }

  for (const d of designs) {
    docs.push({ id: `design:${d.slug}`, kind: "design work", title: d.title, text: `${d.title}, ${d.note}. ${d.summary}`, href: "/#designs" })
  }

  for (const v of ventures) {
    docs.push({
      id: `side:${v.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      kind: "side project",
      title: v.title,
      text: `${v.title} (${v.status}): ${v.summary} Tags: ${v.tags.join(", ")}.`,
      href: "/#started",
    })
  }

  for (const c of certifications) {
    docs.push({
      id: `cert:${c.issuer.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      kind: "certificate",
      title: `${c.issuer} certificates`,
      text: `Certificates from ${c.issuer}, ${c.year}: ${c.items.join("; ")}.`,
      href: "/#certifications",
    })
  }

  for (const group of stack) {
    docs.push({
      id: `stack:${group.label.replace(/[^a-z0-9]+/g, "-")}`,
      kind: "tools",
      title: `tools for ${group.label}`,
      text: `Tools Benedict uses for ${group.label}: ${group.tools.map((t) => t.name).join(", ")}.`,
      href: "/#stack",
    })
  }

  for (const l of lessons) {
    docs.push({ id: `lesson:${l.title.replace(/[^a-z0-9]+/g, "-")}`, kind: "lesson", title: l.title, text: `${l.title}. ${l.line}`, href: "/#lessons" })
  }

  return docs
}
