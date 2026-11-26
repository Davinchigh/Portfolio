import Link from "next/link"
import { Clock } from "@/components/site/clock"
import { SignOff } from "@/components/site/sign-off"
import { person, socials } from "@/lib/site"

export default function Footer() {
  return (
    <footer className="overflow-hidden border-t">
      <SignOff />
      <div className="wrap flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="meta">
          {person.name}, {person.location}, <Clock />
        </p>
        <ul className="-mx-2 flex flex-wrap gap-y-1">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center px-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                {s.label.toLowerCase()}
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${person.email}`} className="inline-flex min-h-11 items-center px-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              email
            </a>
          </li>
        </ul>
      </div>
      <p className="wrap meta flex flex-wrap items-center gap-x-2 pb-24 sm:pb-6">
        <span>built in accra with next.js and claude.</span>
        <Link href="/privacy" className="link inline-flex min-h-11 items-center hover:text-foreground">
          privacy
        </Link>
      </p>
    </footer>
  )
}
