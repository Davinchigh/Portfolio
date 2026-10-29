"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { companies } from "@/lib/site"

/**
 * Who is reading the site.
 * - "recruiter": proof first, and the route ends at "next stop: your team".
 * - "explorer": story first, lessons from the road, ends with an invitation.
 * - "unknown": hasn't chosen yet. Shown the story order with a choice in the hero.
 *
 * A tailored link (/?for=zof-ai) sets recruiter mode and greets that company by name.
 * The choice is remembered in this browser only, as a convenience. Nothing is sent anywhere.
 */
export type Mode = "unknown" | "recruiter" | "explorer"

type Visitor = {
  mode: Mode
  company: string | null
  ready: boolean
  setMode: (mode: Exclude<Mode, "unknown">) => void
}

const VisitorContext = createContext<Visitor>({ mode: "unknown", company: null, ready: false, setMode: () => {} })

const KEY = "bfb-visitor"

/** Turns a link slug into a display name. Known companies use their real name; anything else is cleaned and title-cased. */
export function companyFromSlug(raw: string | null): string | null {
  if (!raw) return null
  const slug = raw.toLowerCase().trim()
  if (!/^[a-z0-9][a-z0-9-]{0,31}$/.test(slug)) return null
  if (companies[slug]) return companies[slug]
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ")
}

export function VisitorProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("unknown")
  const [company, setCompany] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fromLink = companyFromSlug(params.get("for"))
    if (fromLink) {
      setCompany(fromLink)
      setModeState("recruiter")
    } else {
      try {
        const saved = window.localStorage.getItem(KEY)
        if (saved === "recruiter" || saved === "explorer") setModeState(saved)
      } catch {
        /* storage blocked: just ask again */
      }
    }
    setReady(true)
  }, [])

  const setMode = useCallback((next: Exclude<Mode, "unknown">) => {
    setModeState(next)
    try {
      window.localStorage.setItem(KEY, next)
    } catch {
      /* fine without it */
    }
  }, [])

  const value = useMemo(() => ({ mode, company, ready, setMode }), [mode, company, ready, setMode])
  return <VisitorContext.Provider value={value}>{children}</VisitorContext.Provider>
}

export const useVisitor = () => useContext(VisitorContext)

/** Inline text that changes with the visitor. Explorer copy is also used before anyone chooses. */
export function ForMode({ recruiter, explorer }: { recruiter: React.ReactNode; explorer: React.ReactNode }) {
  const { mode } = useVisitor()
  return <>{mode === "recruiter" ? recruiter : explorer}</>
}
