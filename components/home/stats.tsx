"use client"

import { useEffect, useRef, useState } from "react"
import { stats } from "@/lib/site"

/** Counts up once when scrolled into view. Shows final numbers straight away with reduced motion. */
function Count({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(to)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setValue(0)
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 900)
          setValue(Math.round(to * (1 - Math.pow(1 - t, 3))))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [to])

  return (
    <span ref={ref} aria-hidden="true">
      {value}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="wrap" aria-label="In numbers">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-y py-10 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="sr-only">{s.label}</dt>
            <dd className="text-4xl font-medium tabular-nums tracking-tight sm:text-5xl">
              <Count to={s.value} suffix={s.suffix} />
              <span className="sr-only">
                {s.value}
                {s.suffix}
              </span>
            </dd>
            <dd aria-hidden="true" className="mt-2 text-sm text-muted-foreground">
              {s.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
