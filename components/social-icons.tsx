import { Github, Linkedin, Mail } from "lucide-react"

export const EMAIL = "frimpongboatengbenedict@gmail.com"
export const LINKEDIN = "https://www.linkedin.com/in/benedict-frimpong-boateng-552490249/"
export const GITHUB = "https://github.com/Davinchigh"
export const X_URL = "https://x.com/DavinchiMax"

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  )
}

const links = [
  { label: "GitHub", href: GITHUB, Icon: Github, external: true },
  { label: "LinkedIn", href: LINKEDIN, Icon: Linkedin, external: true },
  { label: "Email", href: `mailto:${EMAIL}`, Icon: Mail, external: false },
  { label: "X", href: X_URL, Icon: XLogo, external: true },
]

export default function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {links.map(({ label, href, Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Icon className="h-[18px] w-[18px]" />
            <span className="sr-only">{label}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
