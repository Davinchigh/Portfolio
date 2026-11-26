import type { IconType } from "react-icons"
import { BsOpenai, BsTerminal } from "react-icons/bs"
import { PiMicrosoftExcelLogo } from "react-icons/pi"
import {
  SiAnthropic,
  SiClaude,
  SiClaudecode,
  SiGithub,
  SiGithubcopilot,
  SiGooglegemini,
  SiLivekit,
  SiModelcontextprotocol,
  SiN8N,
  SiNeon,
  SiNextdotjs,
  SiOdoo,
  SiPerplexity,
  SiPrisma,
  SiRailway,
  SiSap,
  SiThreedotjs,
  SiV0,
  SiVercel,
  SiZod,
} from "react-icons/si"

/**
 * Every tool is drawn as its real logo, in its real colours:
 * - LOGO: the official multi-colour artwork (devicon, MIT), shown as is
 * - GRADIENT: marks that are a gradient, painted with an SVG gradient
 * - BRAND: single-colour marks; "fg" means the mark is black or white, so it follows the theme
 * At rest the same artwork is shown in greyscale, so the quiet icon and the coloured one are always the same design.
 */
const LOGO: Record<string, string> = {
  python: "python", typescript: "typescript", javascript: "javascript", java: "java", react: "react", mysql: "mysql",
  mongodb: "mongodb", figma: "figma", git: "git", html: "html", css: "css", tailwind: "tailwind", vite: "vite",
  nodejs: "nodejs", fastapi: "fastapi", postgresql: "postgresql", sqlite: "sqlite", supabase: "supabase",
  vitest: "vitest", playwright: "playwright", githubactions: "githubactions", docker: "docker", netlify: "netlify",
}

const ICONS: Record<string, IconType> = {
  nextjs: SiNextdotjs,
  threejs: SiThreedotjs,
  prisma: SiPrisma,
  neon: SiNeon,
  zod: SiZod,
  github: SiGithub,
  vercel: SiVercel,
  railway: SiRailway,
  claude: SiClaude,
  claudecode: SiClaudecode,
  anthropic: SiAnthropic,
  mcp: SiModelcontextprotocol,
  openai: BsOpenai,
  codex: BsTerminal,
  gemini: SiGooglegemini,
  n8n: SiN8N,
  livekit: SiLivekit,
  v0: SiV0,
  copilot: SiGithubcopilot,
  perplexity: SiPerplexity,
  sap: SiSap,
  excel: PiMicrosoftExcelLogo,
  odoo: SiOdoo,
}

const GRADIENT: Record<string, [string, string, string]> = {
  gemini: ["#1C7DFF", "#8E6CE6", "#E2669B"],
  sap: ["#00B8F1", "#1D8DE0", "#1D61BC"],
}

/** Official brand colours. Used for the mark itself and for the glow and border on hover. */
export const BRAND: Record<string, string> = {
  python: "#3776AB", typescript: "#3178C6", javascript: "#F7DF1E", java: "#E76F00", react: "#61DAFB", nextjs: "fg",
  html: "#E34F26", css: "#1572B6", tailwind: "#06B6D4", threejs: "fg", vite: "#9135FF", nodejs: "#5FA04E",
  fastapi: "#009688", postgresql: "#4169E1", mysql: "#00758F", sqlite: "#0F80CC", mongodb: "#47A248", prisma: "fg",
  supabase: "#3ECF8E", neon: "#00E599", zod: "#3E67B1",
  vitest: "#729B1B", playwright: "#2EAD33", git: "#F05032", github: "fg", githubactions: "#2088FF", docker: "#2496ED",
  vercel: "fg", netlify: "#00C7B7", railway: "fg",
  claude: "#D97757", claudecode: "#D97757", anthropic: "fg", mcp: "fg", openai: "fg", codex: "fg", gemini: "#8E6CE6", n8n: "#EA4B71",
  livekit: "fg", v0: "fg", copilot: "fg", perplexity: "#20808D",
  sap: "#1D8DE0", rise: "#E8682B", figma: "#A259FF", excel: "#107C41", odoo: "#714B67",
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

/**
 * A tool's logo in its real colours, or its initials when no logo exists (e.g. Rise 360).
 * With `reveal`, it rests in greyscale and takes its colours when the parent `.group` is hovered or focused
 * (always in colour on touch screens, where there is no hover).
 */
export function ToolIcon({ icon, name, className = "h-6 w-6", reveal = false }: { icon: string; name: string; className?: string; reveal?: boolean }) {
  const cls = `${className} ${reveal ? "tool-mark" : ""}`
  // eslint-disable-next-line @next/next/no-img-element
  if (LOGO[icon]) return <img src={`/logos/tools/${LOGO[icon]}.svg`} alt="" aria-hidden="true" loading="lazy" decoding="async" className={`${cls} object-contain`} />
  const Icon = ICONS[icon]
  if (Icon) {
    if (GRADIENT[icon]) return <Icon aria-hidden="true" className={cls} style={{ fill: `url(#brand-${icon})` }} />
    return <Icon aria-hidden="true" className={cls} style={{ color: brandColor(icon) }} />
  }
  const initials = name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(-2)
    .map((w) => w[0])
    .join("")
  return (
    <span aria-hidden="true" className={`${reveal ? "tool-mark" : ""} font-mono text-sm font-semibold`} style={{ color: brandColor(icon) }}>
      {initials}
    </span>
  )
}
