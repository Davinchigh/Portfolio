import Link from "next/link"
import { Github, Linkedin, Mail, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SocialIconsProps {
  className?: string
  iconSize?: number
  variant?: "ghost" | "outline" | "default"
  showLabels?: boolean
}

export default function SocialIcons({
  className = "",
  iconSize = 5,
  variant = "ghost",
  showLabels = false,
}: SocialIconsProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      <Link href="https://github.com/Davinchigh" target="_blank" rel="noopener noreferrer">
        <Button variant={variant} size={showLabels ? "default" : "icon"} className="rounded-full hover:bg-slate-700/10">
          <Github className={`h-${iconSize} w-${iconSize} ${showLabels ? "mr-2" : ""}`} />
          {showLabels && <span>GitHub</span>}
          {!showLabels && <span className="sr-only">GitHub</span>}
        </Button>
      </Link>
      <Link
        href="https://www.linkedin.com/in/benedict-frimpong-boateng-552490249/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant={variant} size={showLabels ? "default" : "icon"} className="rounded-full hover:bg-slate-700/10">
          <Linkedin className={`h-${iconSize} w-${iconSize} ${showLabels ? "mr-2" : ""}`} />
          {showLabels && <span>LinkedIn</span>}
          {!showLabels && <span className="sr-only">LinkedIn</span>}
        </Button>
      </Link>
      <Link href="mailto:frimpongboatengbenedict@gmail.com">
        <Button variant={variant} size={showLabels ? "default" : "icon"} className="rounded-full hover:bg-slate-700/10">
          <Mail className={`h-${iconSize} w-${iconSize} ${showLabels ? "mr-2" : ""}`} />
          {showLabels && <span>Email</span>}
          {!showLabels && <span className="sr-only">Email</span>}
        </Button>
      </Link>
      <Link href="https://x.com/DavinchiMax" target="_blank" rel="noopener noreferrer">
        <Button variant={variant} size={showLabels ? "default" : "icon"} className="rounded-full hover:bg-slate-700/10">
          <Twitter className={`h-${iconSize} w-${iconSize} ${showLabels ? "mr-2" : ""}`} />
          {showLabels && <span>Twitter</span>}
          {!showLabels && <span className="sr-only">X (Twitter)</span>}
        </Button>
      </Link>
    </div>
  )
}
