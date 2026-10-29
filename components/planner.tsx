"use client"

import { useEffect, useRef, useState } from "react"
import { Droplets, Sprout } from "lucide-react"
import { months } from "@/lib/content"

/** Pick a month, see what to plant and how to care for the garden. Opens on the current month. */
export function Planner() {
  const [i, setI] = useState(() => new Date().getMonth())
  const cur = months[i]
  const row = useRef<HTMLDivElement>(null)
  // keep the chosen month in view on narrow screens (scrolls the tab row only, never the page)
  useEffect(() => {
    const el = row.current
    const tab = el?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (el && tab) el.scrollLeft = tab.offsetLeft - el.clientWidth / 2 + tab.clientWidth / 2
  }, [i])
  return (
    <div className="rounded-[28px] bg-forest p-6 text-cream sm:p-10">
      <div ref={row} role="tablist" aria-label="Month" className="-mx-1 flex gap-1 overflow-x-auto pb-2">
        {months.map((m, k) => (
          <button
            key={m.m}
            role="tab"
            type="button"
            aria-selected={k === i}
            aria-controls="month-panel"
            onClick={() => setI(k)}
            className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors ${k === i ? "bg-sun text-forest-deep" : "text-cream/80 hover:bg-white/10 hover:text-cream"}`}
          >
            {m.m}
          </button>
        ))}
      </div>
      <div id="month-panel" role="tabpanel" aria-live="polite" className="mt-6 grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-leaf">{cur.season}</p>
          <p key={cur.m} className="mt-3 font-display text-6xl sm:text-7xl">{cur.m}</p>
        </div>
        <div className="grid gap-6">
          <div>
            <h3 className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-[0.14em] text-sun">
              <Sprout className="h-4 w-4" aria-hidden="true" /> Plant now
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {cur.plant.map((p) => (
                <li key={p} className="rounded-full border border-cream/25 px-4 py-2 text-[15px]">{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-[0.14em] text-sun">
              <Droplets className="h-4 w-4" aria-hidden="true" /> Care tip
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-cream/90">{cur.care}</p>
          </div>
        </div>
      </div>
      <p className="mt-8 text-sm text-cream/70">A rough guide for southern Ghana. Every garden is different, so ask us about yours.</p>
    </div>
  )
}
