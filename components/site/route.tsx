"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"

/**
 * The route: one line down the left of the page that fills as you scroll,
 * with a stop on it for every section. The scroll position drives it, so it
 * only moves when the reader does (fine with reduced motion).
 *
 * Geometry: the rail sits in the same centred max-w-5xl box as `.wrap`, so the
 * line's centre is 11.5px in from the box edge below xl, and 14.5px outside it from xl up.
 */
const RailContext = createContext(false)

export function Rail({ children }: { children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = box.current
      if (!el || !fill.current) return
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / r.height))
      fill.current.style.transform = `scaleY(${p})`
    }
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", queue, { passive: true })
    window.addEventListener("resize", queue)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", queue)
      window.removeEventListener("resize", queue)
    }
  }, [])

  return (
    <RailContext.Provider value={true}>
      <div ref={box} className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-full max-w-5xl -translate-x-1/2">
          <div className="absolute bottom-0 left-[11px] top-24 w-px bg-border xl:-left-[15px]" />
          <div
            ref={fill}
            className="absolute bottom-0 left-[10px] top-24 w-[3px] origin-top rounded-full bg-route xl:-left-4"
            style={{ transform: "scaleY(0)" }}
          />
        </div>
        {children}
      </div>
    </RailContext.Provider>
  )
}

/**
 * A stop on the route. Place it inside the first line of a section (an element at the
 * `.wrap` content edge); it positions itself back onto the line. Hollow until the reader
 * reaches it. `you` marks the visitor's stop in signal orange.
 */
export function Stop({ you = false }: { you?: boolean }) {
  const inRail = useContext(RailContext)
  const ref = useRef<HTMLSpanElement>(null)
  const [reached, setReached] = useState(false)

  useEffect(() => {
    if (!inRail) return
    let frame = 0
    const check = () => {
      frame = 0
      const el = ref.current
      if (el) setReached(el.getBoundingClientRect().top < window.innerHeight * 0.5)
    }
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    check()
    window.addEventListener("scroll", queue, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", queue)
    }
  }, [inRail])

  if (!inRail) return null
  const on = you ? "border-signal bg-signal ring-signal/20" : "border-route bg-route ring-route/20"
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`absolute -left-[14px] top-1/2 h-[11px] w-[11px] -translate-y-1/2 rounded-full border-2 transition-[background-color,border-color,box-shadow] duration-300 sm:-left-[26px] xl:-left-[52px] motion-reduce:transition-none ${
        reached ? `${on} ring-4` : "border-input bg-background"
      }`}
    />
  )
}
