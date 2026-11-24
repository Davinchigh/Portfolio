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

/**
 * An endless strip of cards that drifts sideways on its own and can be moved by hand:
 * drag it with a mouse, swipe it on touch, scroll it sideways with a trackpad or shift + wheel,
 * or use the arrow buttons and keys. Hovering slows the drift to a stop but never locks the strip.
 * Two copies make the loop seamless; the second is hidden from assistive tech.
 */
export function Marquee({ children, seconds = 60, label }: { children: ReactNode; seconds?: number; label: string }) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const nudge = useRef<(dir: number) => void>(() => {})

  useEffect(() => {
    const el = root.current
    const tr = track.current
    if (!el || !tr) return
    const still = reduced()
    let half = tr.scrollWidth / 2
    let x = 0 // how far the strip has moved left, in px
    let speed = 0 // current auto speed, px per ms; eases toward `cruise`
    let cruise = still ? 0 : half / (seconds * 1000)
    let fling = 0 // extra velocity from a throw, decays
    let glide: { from: number; to: number; start: number } | null = null
    let hovering = false
    let drag: { id: number; x: number; y: number; t: number; v: number; moved: boolean; axis: "x" | "y" | null } | null = null
    let last = performance.now()
    let frame = 0
    let visible = true

    const wrap = () => {
      if (half > 0) x = ((x % half) + half) % half
    }
    const paint = () => {
      tr.style.transform = `translate3d(${-x}px,0,0)`
    }
    const tick = (t: number) => {
      const dt = Math.min(64, t - last)
      last = t
      if (glide) {
        const k = Math.min(1, (t - glide.start) / 520)
        const e = 1 - Math.pow(1 - k, 3)
        x = glide.from + (glide.to - glide.from) * e
        if (k >= 1) glide = null
      } else if (!drag) {
        const target = hovering || el.matches(":focus-within") ? 0 : cruise
        speed += (target - speed) * Math.min(1, dt / 400)
        x += (speed + fling) * dt
        fling *= Math.pow(0.94, dt / 16)
        if (Math.abs(fling) < 0.002) fling = 0
      }
      wrap()
      paint()
      frame = visible ? requestAnimationFrame(tick) : 0
    }

    const measure = () => {
      half = tr.scrollWidth / 2
      cruise = still ? 0 : half / (seconds * 1000)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(tr)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !frame) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    })
    io.observe(el)

    const card = () => (tr.querySelector("li") as HTMLElement | null)?.offsetWidth ?? 320
    nudge.current = (dir: number) => {
      fling = 0
      glide = { from: x, to: x + dir * (card() + 24), start: performance.now() }
    }

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      glide = null
      fling = 0
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t: e.timeStamp, v: 0, moved: false, axis: e.pointerType === "mouse" ? "x" : null }
    }
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      const dx = e.clientX - drag.x
      const dy = e.clientY - drag.y
      // On touch, decide once whether this is a sideways swipe or the page scrolling.
      if (!drag.axis) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
        drag.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"
        if (drag.axis === "y") {
          drag = null
          return
        }
      }
      if (!drag.moved && Math.abs(dx) > 4) {
        drag.moved = true
        el.setPointerCapture(e.pointerId)
        el.dataset.dragging = ""
      }
      if (!drag.moved) return
      const dt = Math.max(1, e.timeStamp - drag.t)
      x -= dx
      drag.v = -dx / dt
      drag.x = e.clientX
      drag.y = e.clientY
      drag.t = e.timeStamp
    }
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      const recent = e.timeStamp - drag.t < 80
      if (drag.moved) {
        fling = recent ? Math.max(-3, Math.min(3, drag.v)) : 0
        speed = 0
        // Swallow the click that follows a drag so a card link doesn't open.
        const block = (c: Event) => {
          c.preventDefault()
          c.stopPropagation()
        }
        el.addEventListener("click", block, { capture: true, once: true })
        window.setTimeout(() => el.removeEventListener("click", block, { capture: true }), 0)
      }
      delete el.dataset.dragging
      drag = null
    }
    const onWheel = (e: WheelEvent) => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0
      if (!d) return
      e.preventDefault()
      glide = null
      fling = 0
      x += d
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nudge.current(1)
      else if (e.key === "ArrowLeft") nudge.current(-1)
      else return
      e.preventDefault()
    }
    // Tabbing to a card brings it into view (the browser would otherwise scroll the clipped box).
    const onFocus = (e: FocusEvent) => {
      el.scrollLeft = 0
      const li = (e.target as HTMLElement).closest("li")
      if (li) glide = { from: x, to: Math.max(0, li.offsetLeft - 48), start: performance.now() }
    }
    const onEnter = () => (hovering = true)
    const onLeave = () => (hovering = false)
    const noDrag = (e: Event) => e.preventDefault()

    el.addEventListener("pointerdown", onDown)
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerup", onUp)
    el.addEventListener("pointercancel", onUp)
    el.addEventListener("wheel", onWheel, { passive: false })
    el.addEventListener("keydown", onKey)
    el.addEventListener("pointerenter", onEnter)
    el.addEventListener("pointerleave", onLeave)
    el.addEventListener("dragstart", noDrag)
    el.addEventListener("focusin", onFocus)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
      el.removeEventListener("pointerdown", onDown)
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerup", onUp)
      el.removeEventListener("pointercancel", onUp)
      el.removeEventListener("wheel", onWheel)
      el.removeEventListener("keydown", onKey)
      el.removeEventListener("pointerenter", onEnter)
      el.removeEventListener("pointerleave", onLeave)
      el.removeEventListener("dragstart", noDrag)
      el.removeEventListener("focusin", onFocus)
    }
  }, [seconds])

  return (
    <div className="marquee-shell">
      <div ref={root} className="marquee" role="region" aria-roledescription="carousel" aria-label={`${label}. drag, swipe or use the arrow keys to move through it`}>
        <div ref={track} className="marquee-track">
          <ul className="marquee-run">{children}</ul>
          <ul className="marquee-run" aria-hidden="true" inert>
            {children}
          </ul>
        </div>
      </div>
      <div className="marquee-controls">
        <span className="meta hidden sm:inline">drag, swipe or scroll sideways</span>
        <button type="button" className="marquee-btn" aria-label="Previous" onClick={() => nudge.current(-1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" className="marquee-btn" aria-label="Next" onClick={() => nudge.current(1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  )
}
