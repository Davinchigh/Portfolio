"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { ThemedShot } from "@/components/site/themed-shot"
import type { Work as WorkItem } from "@/lib/site"

const STEP = 44 // degrees between cards on the wheel

function Links({ item }: { item: WorkItem }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
      {item.links.map((l) => (
        <li key={l.href}>
          {l.href.startsWith("/") ? (
            <Link href={l.href} className="link inline-flex min-h-11 items-center gap-1 text-sm font-medium">
              {l.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center gap-1 text-sm font-medium">
              {l.label} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </li>
      ))}
    </ul>
  )
}

/**
 * The featured work on a wheel that rolls as you scroll: the section holds still while each project
 * turns to face you, and its story fades in beside it. Desktop with motion allowed only; everyone
 * else gets `fallback` (the same case studies as a list).
 */
export function WorkWheel({ items, fallback }: { items: WorkItem[]; fallback: ReactNode }) {
  const [on, setOn] = useState(false)
  const [active, setActive] = useState(0)
  const outer = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)")
    const set = () => setOn(desktop.matches)
    set()
    desktop.addEventListener("change", set)
    return () => desktop.removeEventListener("change", set)
  }, [])

  useEffect(() => {
    if (!on) return
    const el = outer.current
    if (!el) return
    let frame = 0
    const n = items.length
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const travel = r.height - window.innerHeight
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, travel)))
      const pos = p * (n - 1)
      el.style.setProperty("--turn", `${(pos * STEP).toFixed(3)}deg`)
      el.style.setProperty("--pos", pos.toFixed(4))
      setActive(Math.round(pos))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [on, items.length])

  if (!on) return <>{fallback}</>

  const jump = (i: number) => {
    const el = outer.current
    if (!el) return
    const travel = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (travel * i) / (items.length - 1) + 2, behavior: "smooth" })
  }

  const item = items[active]

  return (
    <div ref={outer} className="relative border-t" style={{ height: `${items.length * 80 + 40}vh` }}>
      <div className="sticky top-0 flex h-screen items-center pt-16">
        <div className="grid w-full grid-cols-12 items-center gap-10">
          <div className="col-span-5">
            <div className="wheel-steps mb-8" style={{ "--count": items.length } as CSSProperties}>
              <ol className="relative inline-flex rounded-full border bg-card/60 p-1" aria-label="Jump to a project">
                <span aria-hidden="true" className="wheel-glide" />
                {items.map((it, i) => (
                  <li key={it.slug} className="relative z-10">
                    <button
                      type="button"
                      onClick={() => jump(i)}
                      aria-current={i === active ? "step" : undefined}
                      className={`inline-flex h-9 w-12 items-center justify-center rounded-full font-mono text-xs transition-colors duration-300 ${
                        i === active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="sr-only">{it.title}, </span>
                      {String(i + 1).padStart(2, "0")}
                    </button>
                  </li>
                ))}
              </ol>
              <div aria-hidden="true" className="wheel-track mt-3">
                <span />
              </div>
            </div>
            <div aria-live="polite">
            <div key={item.slug} className="wheel-copy">
              <p className="meta flex gap-3">
                <span className="text-route">{String(active + 1).padStart(2, "0")}</span>
                <span>{item.org}</span>
              </p>
              <h3 className="mt-3 text-3xl">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.hook}</p>
              <dl className="mt-5 space-y-3 text-sm">
                {[
                  ["problem", item.problem],
                  ["what i did", item.role],
                  ["result", item.outcome],
                ].map(([term, text]) => (
                  <div key={term} className={term === "result" ? "" : "wheel-detail"}>
                    <dt className="eyebrow">{term}</dt>
                    <dd className="mt-1 text-[14.5px] leading-relaxed text-muted-foreground">{text}</dd>
                  </div>
                ))}
              </dl>
              <p className="meta mt-4">{item.tags.join(", ")}</p>
              <Links item={item} />
            </div>
            </div>
          </div>

          <div className="col-span-7">
            <div className="wheel-stage">
              <div ref={ring} className="wheel-ring">
                {items.map((it, i) => (
                  <div
                    key={it.slug}
                    className="wheel-card"
                    data-active={i === active ? "" : undefined}
                    aria-hidden={i !== active}
                    style={{ "--i": i, "--step": `${STEP}deg` } as CSSProperties}
                  >
                    <div className={`shot ${it.slug === "zero" ? "bg-[#060608]" : ""}`}>
                      <ThemedShot
                        light={it.image}
                        dark={it.imageDark}
                        alt={it.imageAlt}
                        label={it.title}
                        switchable={i === active}
                        className={`aspect-[16/10] w-full ${it.contain ? "bg-white object-contain p-3" : "object-cover object-top"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
