"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import { useTheme } from "next-themes"

/**
 * Three pieces of work, layered in 3D. Purely decorative: the real case studies are further down the page.
 * Each card holds a light and a dark screen; the theme decides which one shows, with a cross-fade when it changes.
 */
const cards = [
  { light: "/images/cravebox.webp", dark: "/images/lizab.webp", x: "30%", y: "0px", z: "-90px", fanX: "18px", fanY: "-14px", delay: "-4.5s", enter: "120ms" },
  { light: "/images/flowline-light.webp", dark: "/images/flowline.webp", x: "18%", y: "92px", z: "0px", fanX: "0px", fanY: "0px", delay: "-2s", enter: "260ms" },
  { light: "/images/studyflow.webp", dark: "/images/studyflow-dark.webp", x: "7%", y: "196px", z: "90px", fanX: "-18px", fanY: "16px", delay: "0s", enter: "400ms" },
]

export function HeroDeck({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const stage = useRef<HTMLDivElement>(null)
  const last = useRef<string | undefined>(undefined)

  // A theme change (not the first paint) plays the wipe. Removing and re-adding the class restarts it.
  useEffect(() => {
    if (!resolvedTheme) return
    const el = stage.current
    if (el && last.current && last.current !== resolvedTheme) {
      el.classList.remove("deck-swap")
      void el.offsetWidth
      el.classList.add("deck-swap")
    }
    last.current = resolvedTheme
  }, [resolvedTheme])

  // The deck turns a little toward the pointer, wherever it is in the window.
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5
        const y = e.clientY / window.innerHeight - 0.5
        el.style.setProperty("--deck-y", `${(x * 16).toFixed(2)}deg`)
        el.style.setProperty("--deck-x", `${(-y * 10).toFixed(2)}deg`)
      })
    }
    window.addEventListener("pointermove", move, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", move)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className={`deck h-[400px] w-full max-w-[360px] ${className}`}>
      <div ref={stage} className="deck-stage">
        {cards.map((c) => (
          <div
            key={c.light}
            className="deck-card"
            style={{ "--x": c.x, "--y": c.y, "--z": c.z, "--fan-x": c.fanX, "--fan-y": c.fanY, "--float-delay": c.delay, "--enter-delay": c.enter } as CSSProperties}
          >
            <div className="deck-bar">
              <i />
              <i />
              <i />
            </div>
            <div className="deck-screen">
              <img src={c.light} alt="" className="deck-light" />
              <img src={c.dark} alt="" className="deck-dark" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
