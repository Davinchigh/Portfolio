"use client"

import { useRef } from "react"

/** The certifications list on a faint grid. A soft spotlight on the grid follows the pointer. */
export function CertGrid({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null)
  const move = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== "mouse") return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
  return (
    <ul ref={ref} onPointerMove={move} className="cert-grid">
      {children}
    </ul>
  )
}
