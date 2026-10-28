import type { ReactNode } from "react"

export type VolunteerItem = { organization: string; role: string; dates: string; description?: string }

export const volunteerExperience: VolunteerItem[] = [
  {
    organization: "NextGen Youth Movement",
    role: "Facilitator, Teens Conference 2026",
    dates: "2026, Ghana",
    description: "Led the AI and Coding session for teenagers and received a Certificate of Appreciation from the Executive Director.",
  },
  {
    organization: "Ideal Market (Supermarket)",
    role: "Volunteer Database Assistant",
    dates: "Sept to Dec 2022, Accra",
    description: "Set up and managed store databases in Odoo and supported inventory tracking and data organization.",
  },
]

export const leadership: VolunteerItem[] = [
  { organization: "CodeRaccoon", role: "Team Lead", dates: "Nov 2025 to Aug 2026" },
  { organization: "Raising Beautiful Flowers (RBF)", role: "Liaison", dates: "Jan 2025 to Apr 2026" },
]

/** A dated entry: what, where, when, and optional detail. Used across About and Resume. */
export function Entry({
  title,
  subtitle,
  dates,
  children,
}: {
  title: string
  subtitle?: string
  dates?: string
  children?: ReactNode
}) {
  return (
    <li className="grid gap-1 border-t border-border py-6 first:border-t-0 first:pt-0 sm:grid-cols-[1fr_auto] sm:gap-x-8">
      <div className="min-w-0">
        <h4 className="font-semibold leading-snug">{title}</h4>
        {subtitle && <p className="mt-0.5 text-muted-foreground">{subtitle}</p>}
        {children && <div className="mt-3 max-w-prose leading-relaxed text-muted-foreground">{children}</div>}
      </div>
      {dates && <p className="text-sm text-muted-foreground sm:pt-0.5 sm:text-right">{dates}</p>}
    </li>
  )
}

export function VolunteerGroups({ compact = false }: { compact?: boolean }) {
  const groups = [
    { title: "Volunteering", items: volunteerExperience },
    { title: "Leadership", items: leadership },
  ]
  return (
    <div className="space-y-10">
      {groups.map(({ title, items }) => (
        <section key={title}>
          <h3 className="mb-2 text-lg font-semibold">{title}</h3>
          <ul>
            {items.map((item) => (
              <Entry key={`${item.organization}-${item.role}`} title={item.organization} subtitle={item.role} dates={item.dates}>
                {!compact && item.description}
              </Entry>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
