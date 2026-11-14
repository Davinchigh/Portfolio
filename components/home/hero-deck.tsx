"use client"

import { useEffect, useRef, type CSSProperties } from "react"

/** Three pieces of work, layered in 3D. Purely decorative: the real case studies are further down the page. */
const cards = [
  { src: "/images/glee-garden.webp", x: "30%", y: "0px", z: "-90px", fanX: "18px", fanY: "-14px", delay: "-4.5s", fit: "object-cover object-top" },
  { src: "/images/class-planner.jpg", x: "18%", y: "92px", z: "0px", fanX: "0px", fanY: "0px", delay: "-2s", fit: "object-cover object-top" },
  { src: "/images/zero/zero-mark.webp", x: "7%", y: "196px", z: "90px", fanX: "-18px", fanY: "16px", delay: "0s", fit: "object-contain bg-[#060608]" },
]

export function HeroDeck({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

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
      <div className="deck-stage">
        <span className="deck-glow" />
        {cards.map((c) => (
          <div
            key={c.src}
            className="deck-card"
            style={{ "--x": c.x, "--y": c.y, "--z": c.z, "--fan-x": c.fanX, "--fan-y": c.fanY, "--float-delay": c.delay } as CSSProperties}
          >
            <div className="deck-bar">
              <i />
              <i />
              <i />
            </div>
            <img src={c.src} alt="" className={`aspect-[16/10] w-full ${c.fit}`} />
          </div>
        ))}
      </div>
    </div>
  )
}
