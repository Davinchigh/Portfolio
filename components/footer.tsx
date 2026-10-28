import Link from "next/link"
import SocialIcons, { EMAIL } from "@/components/social-icons"

const links = [
  ["About", "/about"],
  ["Projects", "/projects"],
  ["Designs", "/figma-designs"],
  ["Resume", "/resume"],
  ["Contact", "/contact"],
]

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="page grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-2xl font-semibold tracking-tight">Have a role or project in mind?</p>
          <a href={`mailto:${EMAIL}`} className="text-link mt-2 inline-block break-all text-muted-foreground hover:text-foreground">
            {EMAIL}
          </a>
          <SocialIcons className="-ml-3 mt-6" />
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {links.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-muted-foreground hover:text-foreground">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="page">
        <p className="border-t border-border py-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Benedict Frimpong Boateng, Accra, Ghana
        </p>
      </div>
    </footer>
  )
}
