"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { FadeImage } from "@/components/site/fade-image"

type Variant = "light" | "dark"

/**
 * A project screenshot that follows the site's theme: the app's light screen in light mode,
 * its dark screen in dark mode. A small switch on the image lets anyone look at the other one
 * without changing the whole site. Images without a dark version render as a plain image.
 */
export function ThemedShot({
  light,
  dark,
  alt,
  className = "",
  label,
  switchable = true,
}: {
  light: string
  dark?: string
  alt: string
  className?: string
  label: string
  /** Off inside links, where a button can't live: the image then just follows the site theme. */
  switchable?: boolean
}) {
  const { resolvedTheme } = useTheme()
  const [pick, setPick] = useState<Variant | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // A new site theme resets the pick, so the image follows the site again.
  useEffect(() => setPick(null), [resolvedTheme])

  if (!dark) return <FadeImage src={light} alt={alt} loading="lazy" className={className} />

  const site: Variant = mounted && resolvedTheme === "dark" ? "dark" : "light"
  const shown = pick ?? site

  return (
    <div className="tshot relative" data-show={mounted ? shown : undefined}>
      <FadeImage src={light} alt={shown === "light" ? alt : ""} aria-hidden={shown !== "light"} loading="lazy" className={`tshot-light ${className}`} />
      <FadeImage src={dark} alt={shown === "dark" ? alt : ""} aria-hidden={shown !== "dark"} loading="lazy" className={`tshot-dark absolute inset-0 h-full ${className}`} />
      {switchable && (
      <div
        role="group"
        aria-label={`${label}: show the light or dark version`}
        className="tshot-switch absolute bottom-3 right-3 z-10 flex rounded-full border border-white/20 bg-black/55 p-0.5 text-white shadow-lg backdrop-blur-md"
      >
        {(["light", "dark"] as const).map((v) => {
          const Icon = v === "light" ? Sun : Moon
          const on = shown === v
          return (
            <button
              key={v}
              type="button"
              aria-pressed={on}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setPick(v === site ? null : v)
              }}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors ${on ? "bg-white text-black" : "text-white/80 hover:text-white"}`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">{v}</span>
            </button>
          )
        })}
      </div>
      )}
    </div>
  )
}
