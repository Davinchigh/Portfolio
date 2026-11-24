"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Writes how far an element has travelled through the viewport to `--p` on it:
 * 0 as its top enters from below, 1 as its bottom leaves at the top.
 * Only runs while the element is near the screen. Off with reduced motion (stays at the end state).
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced()) {
      el.style.setProperty("--p", "1")
      return
    }
    let frame = 0
    let active = false
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const total = r.height + window.innerHeight
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / total))
      el.style.setProperty("--p", p.toFixed(4))
    }
    const onScroll = () => {
      if (active && !frame) frame = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(([e]) => {
      active = e.isIntersecting
      if (active) update()
    }, { rootMargin: "20% 0px" })
    io.observe(el)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    update()
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])
  return ref
}

/**
 * Big lines of text that slide sideways as you scroll, alternate rows in opposite directions.
 * Purely decorative: the same words are on the page as real text.
 */
export function ScrollBand({ rows }: { rows: string[][] }) {
  const ref = useScrollProgress<HTMLDivElement>()
  return (
    <div ref={ref} aria-hidden="true" className="scroll-band select-none">
      {rows.map((words, r) => (
        <div key={r} className={`scroll-band-row ${r % 2 ? "is-reverse" : ""}`}>
          {[0, 1, 2].map((copy) => (
            <span key={copy} className="scroll-band-run">
              {words.map((w, i) => (
                <span key={i} className={(i + r) % 2 ? "band-outline" : "band-solid"}>
                  {w}
                  <i className="band-dot" />
                </span>
              ))}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

/** A paragraph whose words light up one after another as it scrolls through the screen, like reading along. */
export function ReadAlong({ text, className = "" }: { text: string; className?: string }) {
  const ref = useScrollProgress<HTMLParagraphElement>()
  const words = text.split(" ")
  return (
    <p ref={ref} className={`read-along ${className}`} style={{ "--n": words.length } as CSSProperties}>
      {words.map((w, i) => (
        <span key={i} style={{ "--i": i } as CSSProperties}>
          {w}{" "}
        </span>
      ))}
    </p>
  )
}

/** An endless strip that slides sideways on its own, pausing on hover or focus. Two copies make the loop seamless. */
export function Marquee({ children, seconds = 60, label }: { children: ReactNode; seconds?: number; label: string }) {
  return (
    <div className="marquee" style={{ "--marquee-s": `${seconds}s` } as CSSProperties} role="region" aria-label={label}>
      <div className="marquee-track">
        <ul className="marquee-run">{children}</ul>
        <ul className="marquee-run" aria-hidden="true" inert>
          {children}
        </ul>
      </div>
    </div>
  )
}
