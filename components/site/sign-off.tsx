"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import { LogoMark } from "@/components/site/logo"

/** The page's last word: a big "let's build." that rises letter by letter when the footer comes into view. */
export function SignOff() {
  const ref = useRef<HTMLParagraphElement>(null)
  const word = "let's build"

  // Plays every time the footer scrolls into view: it resets once the word has left the screen entirely.
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (el.getBoundingClientRect().top >= window.innerHeight) el.dataset.state = "waiting"
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.35) el.dataset.state = "in"
        else if (!e.isIntersecting) el.dataset.state = "waiting"
      },
      { threshold: [0, 0.35] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="wrap pt-16">
      <div className="flex items-center gap-3">
        <LogoMark className="h-7 w-7" />
        <p className="meta">thanks for walking the road.</p>
      </div>
      <p ref={ref} className="sign-off mt-6">
        <span className="sr-only">let&apos;s build.</span>
        {[...word, "."].map((ch, i) => (
          <span key={i} aria-hidden="true" className={ch === "." ? "sign-dot" : undefined} style={{ "--i": i } as CSSProperties}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </p>
    </div>
  )
}
