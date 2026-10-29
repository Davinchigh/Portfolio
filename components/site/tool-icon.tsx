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

/** Official brand colours, used on hover. "fg" = the brand is black or white, so it follows the theme. */
export const BRAND: Record<string, string> = {
  python: "#3776AB", typescript: "#3178C6", javascript: "#F7DF1E", java: "#ED8B00", nextjs: "fg", react: "#61DAFB",
  mysql: "#4479A1", mongodb: "#47A248", claude: "#D97757", claudecode: "#D97757", mcp: "fg", openai: "#10A37F",
  gemini: "#8E75B2", n8n: "#EA4B71", v0: "fg", copilot: "fg", perplexity: "#1FB8CD", sap: "#0FAAFF",
  figma: "#F24E1E", excel: "#21A366", odoo: "#A24689", git: "#F05032", rise: "#F97316",
}
export const brandColor = (icon: string) => (BRAND[icon] && BRAND[icon] !== "fg" ? BRAND[icon] : "hsl(var(--foreground))")

/** Brand icon for a tool, or its initials when there's no icon (e.g. Rise 360). */
export function ToolIcon({ icon, name, className = "h-6 w-6" }: { icon: string; name: string; className?: string }) {
  const Icon = ICONS[icon]
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
