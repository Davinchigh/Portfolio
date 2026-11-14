"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { flushSync } from "react-dom"
import { withViewTransition } from "@/components/site/motion"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"
  const label = isDark ? "Switch to light mode" : "Switch to dark mode"

  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        const root = document.documentElement
        root.style.setProperty("--vt-x", `${r.left + r.width / 2}px`)
        root.style.setProperty("--vt-y", `${r.top + r.height / 2}px`)
        const next = isDark ? "light" : "dark"
        withViewTransition(() => {
          flushSync(() => setTheme(next))
          // next-themes applies the class in an effect; set it now so the transition captures the new theme.
          root.classList.toggle("dark", next === "dark")
          root.style.colorScheme = next
        }, "theme-vt")
      }}
      aria-label={label}
      title={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground ${
        mounted ? "" : "opacity-0"
      }`}
    >
      {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  )
}
