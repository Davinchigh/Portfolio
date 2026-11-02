"use client"

import { useEffect, useRef } from "react"

/** The certifications list on a faint grid. A soft spotlight on the grid follows the pointer. */
export function CertGrid({ children }: { children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null)
  const lines = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || frame.current) return
    const { clientX, clientY } = e
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      const el = lines.current
      const parent = box.current
      if (!el || !parent) return
      // The grid sits 20px left of and 28px above the list, so it needs its own offset.
      const r = parent.getBoundingClientRect()
      el.style.setProperty("--mx", `${clientX - r.left + 20}px`)
      el.style.setProperty("--my", `${clientY - r.top + 28}px`)
    })
  }

  return (
    <div ref={box} onPointerMove={move} className="cert-grid">
      <div ref={lines} aria-hidden="true" className="cert-grid-lines" />
      <ul>{children}</ul>
    </div>
  )
}
