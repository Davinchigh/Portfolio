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
