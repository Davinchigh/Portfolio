import type { IconType } from "react-icons"
import { BsOpenai } from "react-icons/bs"
import { PiMicrosoftExcelLogo } from "react-icons/pi"
import {
  SiClaude,
  SiClaudecode,
  SiFigma,
  SiGit,
  SiGithubcopilot,
  SiGooglegemini,
  SiJavascript,
  SiModelcontextprotocol,
  SiMongodb,
  SiMysql,
  SiN8N,
  SiNextdotjs,
  SiOdoo,
  SiOpenjdk,
  SiPerplexity,
  SiPython,
  SiReact,
  SiSap,
  SiTypescript,
  SiV0,
} from "react-icons/si"

const ICONS: Record<string, IconType> = {
  python: SiPython,
  typescript: SiTypescript,
  javascript: SiJavascript,
  java: SiOpenjdk,
  nextjs: SiNextdotjs,
  react: SiReact,
  mysql: SiMysql,
  mongodb: SiMongodb,
  claude: SiClaude,
  claudecode: SiClaudecode,
  mcp: SiModelcontextprotocol,
  openai: BsOpenai,
  gemini: SiGooglegemini,
  n8n: SiN8N,
  v0: SiV0,
  copilot: SiGithubcopilot,
  perplexity: SiPerplexity,
  sap: SiSap,
  figma: SiFigma,
  excel: PiMicrosoftExcelLogo,
  odoo: SiOdoo,
  git: SiGit,
}

/**
 * Each brand shown the way its own logo looks.
 * - LOGO: multi-colour official artwork (from devicon, MIT), shown as is
 * - GRADIENT: brands whose mark is a gradient, painted with an SVG gradient
 * - BRAND: single-colour marks; "fg" means the mark is black or white, so it follows the theme
 */
const LOGO: Record<string, string> = {
  python: "/logos/tools/python.svg", typescript: "/logos/tools/typescript.svg", javascript: "/logos/tools/javascript.svg",
  java: "/logos/tools/java.svg", react: "/logos/tools/react.svg", mysql: "/logos/tools/mysql.svg",
  mongodb: "/logos/tools/mongodb.svg", figma: "/logos/tools/figma.svg", git: "/logos/tools/git.svg",
}
const GRADIENT: Record<string, [string, string, string]> = {
  gemini: ["#1C7DFF", "#8E6CE6", "#E2669B"],
  sap: ["#00B8F1", "#1D8DE0", "#1D61BC"],
}
export const BRAND: Record<string, string> = {
  python: "#3776AB", typescript: "#3178C6", javascript: "#F0DB4F", java: "#E76F00", nextjs: "fg", react: "#61DAFB",
  mysql: "#00758F", mongodb: "#47A248", claude: "#D97757", claudecode: "#D97757", mcp: "fg", openai: "fg",
  gemini: "#8E6CE6", n8n: "#EA4B71", v0: "fg", copilot: "fg", perplexity: "#20808D", sap: "#1D8DE0",
  figma: "#A259FF", excel: "#107C41", odoo: "#714B67", git: "#F05032", rise: "#E8682B",
}
export const brandColor = (icon: string) => (BRAND[icon] && BRAND[icon] !== "fg" ? BRAND[icon] : "hsl(var(--foreground))")

/** Gradient definitions, rendered once on the page so gradient marks can use them. */
export function BrandGradients() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <defs>
        {Object.entries(GRADIENT).map(([k, [a, b, c]]) => (
          <linearGradient key={k} id={`brand-${k}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="0.55" stopColor={b} />
            <stop offset="1" stopColor={c} />
          </linearGradient>
        ))}
      </defs>
    </svg>
  )
}

/** The tool in its real colours (used on hover). */
function Colour({ icon, Icon, className }: { icon: string; Icon?: IconType; className: string }) {
  if (LOGO[icon]) return <img src={LOGO[icon]} alt="" aria-hidden="true" className={`${className} object-contain`} />
  if (!Icon) return null
  if (GRADIENT[icon]) return <Icon aria-hidden="true" className={className} style={{ fill: `url(#brand-${icon})` }} />
  return <Icon aria-hidden="true" className={className} style={{ color: brandColor(icon) }} />
}

/**
 * Brand icon for a tool, or its initials when there's no icon (e.g. Rise 360).
 * With `reveal`, the quiet monochrome icon cross-fades to the brand's own colours when its parent `.group` is hovered or focused.
 */
export function ToolIcon({ icon, name, className = "h-6 w-6", reveal = false }: { icon: string; name: string; className?: string; reveal?: boolean }) {
  const Icon = ICONS[icon]
  if (Icon && reveal)
    return (
      <span className="relative inline-flex">
        <Icon aria-hidden="true" className={`${className} transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0`} />
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <Colour icon={icon} Icon={Icon} className={className} />
        </span>
      </span>
    )
  if (Icon) return <Icon aria-hidden="true" className={className} />
  const initials = name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(-2)
    .map((w) => w[0])
    .join("")
  return (
    <span aria-hidden="true" className="font-mono text-sm font-semibold">
      {initials}
    </span>
  )
}
