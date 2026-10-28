import Link from "next/link"
import { Clock } from "@/components/site/clock"
import { person, socials } from "@/lib/site"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="wrap flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="meta">
          {person.name}, {person.location}, <Clock />
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-block py-2 text-sm text-muted-foreground hover:text-foreground">
                {s.label.toLowerCase()}
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${person.email}`} className="inline-block py-2 text-sm text-muted-foreground hover:text-foreground">
              email
            </a>
          </li>
        </ul>
      </div>
      <p className="wrap pb-8 meta">
        built in accra with next.js and claude.{" "}
        <Link href="/privacy" className="hover:text-foreground">
          privacy
        </Link>
      </p>
    </footer>
  )
}
