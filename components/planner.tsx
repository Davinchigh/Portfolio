"use client"

import { useEffect, useRef, useState } from "react"
import { months } from "@/lib/content"

/** Pick a month, see what to plant and how to care for the garden. Opens on the current month. */
export function Planner() {
  const [i, setI] = useState(() => new Date().getMonth())
  const cur = months[i]
  const row = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = row.current
    const tab = el?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (el && tab) el.scrollLeft = tab.offsetLeft - el.clientWidth / 2 + tab.clientWidth / 2
  }, [i])
  return (
    <div className="overflow-hidden rounded-[32px] border border-line bg-white">
      <div ref={row} role="tablist" aria-label="Month" className="flex overflow-x-auto border-b border-line">
        {months.map((m, k) => (
          <button
            key={m.m}
            role="tab"
            type="button"
            aria-selected={k === i}
            aria-controls="month-panel"
            onClick={() => setI(k)}
            className={`relative min-h-14 min-w-[72px] flex-1 shrink-0 text-[15px] transition-colors duration-300 ${k === i ? "text-ink" : "text-ink-mute hover:text-ink"}`}
          >
            {m.m}
            <span aria-hidden="true" className={`absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-green transition-transform duration-500 ease-out ${k === i ? "scale-x-100" : "scale-x-0"}`} />
          </button>
        ))}
      </div>
      <div id="month-panel" role="tabpanel" aria-live="polite" className="grid gap-10 p-7 sm:p-12 md:grid-cols-[0.9fr_1.1fr]">
        <div key={cur.m} className="animate-[fadeUp_0.7s_cubic-bezier(0.16,1,0.3,1)]">
          <p className="kicker">{cur.season}</p>
          <p className="mt-3 font-serif text-[88px] leading-none tracking-tight text-green sm:text-[120px]">{cur.m}</p>
        </div>
        <div key={cur.m + "b"} className="grid content-start gap-8 animate-[fadeUp_0.7s_cubic-bezier(0.16,1,0.3,1)_0.06s_both]">
          <div>
            <h3 className="kicker">Plant now</h3>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {cur.plant.map((p) => (
                <li key={p} className="flex items-center justify-between py-3.5 text-lg tracking-tight">
                  {p}
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-green" />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="kicker">Care tip</h3>
            <p className="mt-3 text-xl leading-snug tracking-tight text-ink-soft">{cur.care}</p>
          </div>
        </div>
      </div>
      <p className="border-t border-line px-7 py-4 text-sm text-ink-mute sm:px-12">A rough guide for southern Ghana. Every garden is different, so ask us about yours.</p>
    </div>
  )
}
