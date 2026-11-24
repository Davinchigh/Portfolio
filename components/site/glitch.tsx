"use client"

import { useEffect, useRef } from "react"

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** A jagged line from left to right, like an arc of current. */
function bolt(w: number, h: number) {
  const steps = 14
  let d = `M0 ${h / 2}`
  for (let i = 1; i <= steps; i++) {
    const x = (w * i) / steps
    const y = i === steps ? h / 2 : h / 2 + (Math.random() - 0.5) * h * 0.9
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

/**
 * Text that shorts out now and then: colour channels split, slices jump sideways, and an arc of
 * current runs under it. Bursts come every few seconds while it is on screen, and on hover.
 * The real text is the first span; the copies and the arc are hidden from screen readers.
 * With reduced motion it is plain text.
 */
export function Glitch({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const arc = useRef<SVGPathElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return
    let visible = false
    let timer = 0
    let frame = 0
    let stopAt = 0
    let lastBolt = 0

    const draw = (t: number) => {
      if (t > stopAt) {
        el.removeAttribute("data-glitch")
        frame = 0
        return
      }
      if (t - lastBolt > 55 && arc.current) {
        arc.current.setAttribute("d", bolt(400, 24))
        lastBolt = t
      }
      frame = requestAnimationFrame(draw)
    }
    const burst = (ms = 650) => {
      el.setAttribute("data-glitch", "")
      stopAt = performance.now() + ms
      if (!frame) frame = requestAnimationFrame(draw)
    }
    const schedule = () => {
      window.clearTimeout(timer)
      if (!visible) return
      timer = window.setTimeout(() => {
        burst(400 + Math.random() * 500)
        schedule()
      }, 2600 + Math.random() * 3400)
    }

    const io = new IntersectionObserver(
      ([e]) => {
        const was = visible
        visible = e.isIntersecting
        if (visible && !was) {
          burst(900)
          schedule()
        }
        if (!visible) window.clearTimeout(timer)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    const onEnter = () => burst(700)
    el.addEventListener("pointerenter", onEnter)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
      el.removeEventListener("pointerenter", onEnter)
    }
  }, [])

  return (
    <span ref={ref} className={`glitch ${className}`}>
      <span className="glitch-base">{text}</span>
      <span className="glitch-a" aria-hidden="true">
        {text}
      </span>
      <span className="glitch-b" aria-hidden="true">
        {text}
      </span>
      <svg className="glitch-arc" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true">
        <path ref={arc} d="M0 12 L400 12" />
      </svg>
    </span>
  )
}
