"use client"

import { useEffect, useRef, useState } from "react"
import { Cite } from "@/components/ui"
import { stops } from "@/lib/walk"
import { disclaimer } from "@/lib/site"

/**
 * Scroll to walk through a clay model of the hall. The page is tall; a canvas stays pinned while you scroll,
 * and scroll only decides how far along the camera's path you are (eased 8% per frame so it glides).
 * Without WebGL, or with reduced motion, it is a plain illustrated article with the same words.
 */
export function Walk() {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const dot = useRef<SVGCircleElement>(null)
  const [mode, setMode] = useState<"loading" | "3d" | "text">("loading")
  const [active, setActive] = useState(0)
  const [stopT, setStopT] = useState<number[]>(stops.map((_, i) => i / (stops.length - 1)))
  const yaw = useRef({ target: 0, now: 0, dragging: false, x0: 0 })

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const gl = (() => {
      try {
        const c = document.createElement("canvas")
        return !!(c.getContext("webgl2") || c.getContext("webgl"))
      } catch {
        return false
      }
    })()
    if (reduce || !gl) {
      setMode("text")
      return
    }
    let disposed = false
    let frame = 0
    let visible = true
    let cleanup = () => {}
    import("./scene").then(({ createWalkScene }) => {
      if (disposed || !canvas.current || !host.current) return
      const small = window.innerWidth < 640
      const walk = createWalkScene(canvas.current, { small })
      setStopT(walk.stopT)
      setMode("3d")
      const el = host.current
      let p = 0
      const size = () => walk.resize(canvas.current!.clientWidth, canvas.current!.clientHeight)
      size()
      const target = () => {
        const r = el.getBoundingClientRect()
        const total = r.height - window.innerHeight
        return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0
      }
      let shown = -1
      const tick = () => {
        frame = 0
        const goal = target()
        p += (goal - p) * 0.08
        if (Math.abs(goal - p) < 0.0004) p = goal
        const y = yaw.current
        if (!y.dragging) y.target *= 0.86
        y.now += (y.target - y.now) * 0.18
        const pos = walk.render(p, y.now)
        // Which stop are we nearest to?
        let idx = 0
        walk.stopT.forEach((t, i) => {
          if (p >= t - 0.04) idx = i
        })
        if (idx !== shown) {
          shown = idx
          setActive(idx)
        }
        if (dot.current) {
          dot.current.setAttribute("cx", String(Math.max(4, Math.min(96, 50 + pos.x * 1.1))))
          dot.current.setAttribute("cy", String(Math.max(4, Math.min(96, 50 + pos.z * 1.1))))
        }
        if (visible) frame = requestAnimationFrame(tick)
      }
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting
        if (visible && !frame) frame = requestAnimationFrame(tick)
      })
      io.observe(el)
      window.addEventListener("resize", size)
      frame = requestAnimationFrame(tick)
      cleanup = () => {
        io.disconnect()
        window.removeEventListener("resize", size)
        cancelAnimationFrame(frame)
        walk.dispose()
      }
    })
    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  const goTo = (i: number) => {
    const el = host.current
    if (!el) return
    const total = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + stopT[i] * total + 2, behavior: "smooth" })
  }

  // Look around: drag sideways to turn your head up to 15 degrees; let go and it springs back.
  const MAX = (15 * Math.PI) / 180
  const onDown = (e: React.PointerEvent) => {
    yaw.current.dragging = true
    yaw.current.x0 = e.clientX
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    const y = yaw.current
    if (!y.dragging) return
    y.target = Math.max(-MAX, Math.min(MAX, ((y.x0 - e.clientX) / 300) * MAX))
  }
  const onUp = () => (yaw.current.dragging = false)

  const s = stops[active]

  if (mode === "text") return <WalkText />

  return (
    <>
      <div ref={host} className="walk" style={{ height: `${stops.length * 110 + 40}vh` }}>
        <div className="walk-pin">
          <canvas ref={canvas} className="walk-canvas" aria-hidden="true" />
          {mode === "loading" && <p className="walk-loading">Building the hall…</p>}

          <div className="walk-top">
            <p className="walk-count">
              <span className="tabular-nums">{String(active + 1).padStart(2, "0")}</span>
              <span className="opacity-50"> / {String(stops.length).padStart(2, "0")}</span>
            </p>
            <svg className="walk-map" viewBox="0 0 100 100" role="img" aria-label="Plan of the hall with your position">
              <rect x="31" y="24" width="38" height="9" rx="1.5" />
              <rect x="22" y="34" width="9" height="31" rx="1.5" />
              <rect x="69" y="34" width="9" height="31" rx="1.5" />
              <rect x="31" y="64" width="13" height="9" rx="1.5" />
              <rect x="56" y="64" width="13" height="9" rx="1.5" />
              <circle ref={dot} cx="50" cy="96" r="2.6" />
            </svg>
          </div>

          <article key={s.id} className="walk-card" aria-live="polite">
            <p className="label text-lamp-deep">{s.eyebrow}</p>
            <h2 className="mt-2 font-display text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.05]">{s.title}</h2>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-muted">
              {s.body}
              {s.cites.map((c) => (
                <Cite key={c} id={c} />
              ))}
            </p>
            {s.illustrative && <p className="walk-note">Illustration: {s.illustrative}</p>}
          </article>

          <button
            type="button"
            className="walk-look"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            aria-label="Look around: drag left or right"
          >
            <span aria-hidden="true">↔</span> Look
          </button>

          <nav className="walk-ticks" aria-label="Stops on the walk">
            {stops.map((st, i) => (
              <button key={st.id} type="button" onClick={() => goTo(i)} aria-current={i === active ? "step" : undefined}>
                <i aria-hidden="true" />
                <span>{st.tick}</span>
              </button>
            ))}
          </nav>
          <p className="walk-disclaimer">A clay sketch, not an official plan. {disclaimer}</p>
        </div>
      </div>
      <WalkText compact />
    </>
  )
}

/** The same walk as an ordinary article: for reduced motion, no WebGL, search engines and anyone who prefers reading. */
function WalkText({ compact = false }: { compact?: boolean }) {
  return (
    <section aria-labelledby="walk-text-h" className={`wrap ${compact ? "py-20" : "py-10"}`}>
      <h2 id="walk-text-h" className={compact ? "text-3xl sm:text-4xl" : "sr-only"}>
        The walk, in words
      </h2>
      <ol className="mt-8 grid gap-5 md:grid-cols-2">
        {stops.map((s, i) => (
          <li key={s.id} className="rounded-2xl border border-line bg-white p-7">
            <p className="label text-lamp-deep">
              {String(i + 1).padStart(2, "0")} · {s.eyebrow}
            </p>
            <h3 className="mt-3 text-2xl">{s.title}</h3>
            <p className="mt-3 text-ink-muted">
              {s.body}
              {s.cites.map((c) => (
                <Cite key={c} id={c} />
              ))}
            </p>
            {s.illustrative && <p className="mt-3 text-sm text-ink-muted">Illustration: {s.illustrative}</p>}
          </li>
        ))}
      </ol>
    </section>
  )
}
