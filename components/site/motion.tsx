"use client"

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react"

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Content that folds up into place the first time it scrolls into view.
 * Nothing is hidden unless JavaScript is running, motion is allowed and the element
 * starts below the fold, so the page never flashes and still reads fine without scripts.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  flat = false,
  className = "",
}: {
  children: ReactNode
  as?: ElementType
  delay?: number
  /** Rise and fade only, without the 3D fold. Use for tall blocks, where a fold would swing wide. */
  flat?: boolean
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion() || !("IntersectionObserver" in window)) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return
    el.dataset.reveal = "pending"
    const show = () => {
      el.dataset.reveal = "in"
      observer.disconnect()
    }
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && show(), {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.05,
    })
    observer.observe(el)
    // Jumping to a section with the keyboard or a link must never leave it hidden.
    el.addEventListener("focusin", show)
    return () => {
      observer.disconnect()
      el.removeEventListener("focusin", show)
    }
  }, [])

  return (
    <Tag ref={ref} className={`reveal ${flat ? "reveal-flat" : ""} ${className}`} style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}>
      {children}
    </Tag>
  )
}

/**
 * A surface that leans toward the pointer in 3D, with a soft light that follows it.
 * Mouse only (touch and keyboard users get the flat card), and off with reduced motion.
 */
export function Tilt({
  children,
  as: Tag = "div",
  max = 6,
  className = "",
}: {
  children: ReactNode
  as?: ElementType
  max?: number
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const frame = useRef(0)

  const move = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== "mouse" || reducedMotion()) return
    const { clientX, clientY } = e
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect()
      const x = (clientX - r.left) / r.width
      const y = (clientY - r.top) / r.height
      el.style.setProperty("--tilt-x", `${((0.5 - y) * max * 2).toFixed(2)}deg`)
      el.style.setProperty("--tilt-y", `${((x - 0.5) * max * 2).toFixed(2)}deg`)
      el.style.setProperty("--glare-x", `${(x * 100).toFixed(1)}%`)
      el.style.setProperty("--glare-y", `${(y * 100).toFixed(1)}%`)
      el.dataset.tilting = ""
    })
  }
  const leave = () => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    el.style.setProperty("--tilt-x", "0deg")
    el.style.setProperty("--tilt-y", "0deg")
    delete el.dataset.tilting
  }

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  return (
    <Tag ref={ref} onPointerMove={move} onPointerLeave={leave} className={`tilt ${className}`}>
      {children}
    </Tag>
  )
}

/** Runs a state change inside a view transition where the browser supports it, so the page cross-fades instead of jumping. */
export function withViewTransition(update: () => void, className?: string) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }
  if (!doc.startViewTransition || reducedMotion()) return update()
  const root = document.documentElement
  if (className) root.classList.add(className)
  const transition = doc.startViewTransition(update)
  transition.finished.finally(() => className && root.classList.remove(className))
}
