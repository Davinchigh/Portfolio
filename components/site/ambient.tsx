"use client"

import { useEffect } from "react"

/**
 * A soft glow behind the page whose hue follows the section on screen: warm at the start of the road,
 * teal for the work, violet for the apps, green for the tools. One hue family, low chroma, kept faint
 * so text contrast never changes.
 */
const HUES: Record<string, number> = {
  experience: 38, lessons: 20, work: 185, builds: 290, started: 330, designs: 220, stack: 150, certifications: 70, now: 230, contact: 45,
}

export function Ambient() {
  // Sections can mount after this does (the home page orders them per visitor), so look them up on each check.
  useEffect(() => {
    const root = document.documentElement
    let frame = 0
    let current = -1
    const check = () => {
      frame = 0
      const mid = window.innerHeight / 2
      let hue = 45
      for (const id of Object.keys(HUES)) {
        const r = document.getElementById(id)?.getBoundingClientRect()
        if (r && r.top <= mid && r.bottom >= mid) { hue = HUES[id]; break }
      }
      if (hue !== current) { current = hue; root.style.setProperty("--amb-h", String(hue)) }
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check) }
    check()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])
  return <div className="ambient" aria-hidden="true" />
}
