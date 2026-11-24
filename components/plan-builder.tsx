"use client"

import { useMemo, useState } from "react"
import { estimate, needs, spaces, type NeedId, type SpaceId } from "@/lib/business"

const sizes: Record<SpaceId, { min: number; max: number; step: number; start: number }> = {
  balcony: { min: 2, max: 40, step: 1, start: 8 },
  compound: { min: 50, max: 1200, step: 25, start: 300 },
  grounds: { min: 500, max: 8000, step: 100, start: 2000 },
}

/**
 * Build your garden plan: choose a space, size, sun and needs, and a little garden grows to match.
 * Gives the plan that fits and an indicative monthly price. Nothing is sent anywhere.
 */
export function PlanBuilder() {
  const [space, setSpace] = useState<SpaceId>("compound")
  const [size, setSize] = useState(sizes.compound.start)
  const [sun, setSun] = useState<"full" | "part" | "shade">("full")
  const [chosen, setChosen] = useState<NeedId[]>(["lawn", "beds"])
  const { plan, monthly } = useMemo(() => estimate(space, size, sun, chosen), [space, size, sun, chosen])
  const has = (id: NeedId) => chosen.includes(id)
  const toggle = (id: NeedId) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))
  const s = sizes[space]
  const unit = "m²"

  return (
    <div className="builder grid overflow-hidden rounded-[32px] border border-line bg-white lg:grid-cols-[1.05fr_1fr]">
      {/* The garden, growing as you choose */}
      <div className="relative min-h-[300px] bg-[#EEF2EC] sm:min-h-[420px]" aria-hidden="true">
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={sun === "shade" ? "#DDE4DE" : "#F4F1E6"} />
              <stop offset="1" stopColor="#EEF2EC" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#sky)" />
          {/* sun */}
          <g className="g-sun" style={{ opacity: sun === "shade" ? 0.25 : 1, transform: `translateY(${sun === "full" ? 0 : 14}px)` }}>
            <circle cx="330" cy="56" r={sun === "full" ? 24 : 18} fill="#F2C14E" />
            {sun === "part" && <path d="M300 70 q10 -18 28 -10 q14 -14 30 2 q16 0 14 16 h-76 q-8 -6 4 -8z" fill="#fff" />}
          </g>
          {/* the space */}
          {space === "balcony" && (
            <g>
              <rect x="0" y="230" width="400" height="70" fill="#D9CDB8" />
              <rect x="0" y="40" width="70" height="190" fill="#E7E1D5" />
              {[...Array(13)].map((_, i) => (
                <rect key={i} x={20 + i * 30} y="196" width="4" height="40" fill="#3C4540" opacity=".55" />
              ))}
              <rect x="10" y="192" width="390" height="6" rx="3" fill="#3C4540" opacity=".7" />
            </g>
          )}
          {space !== "balcony" && (
            <g>
              <rect x="0" y="210" width="400" height="90" fill={has("lawn") ? "#9CC08A" : "#C9BC9C"} className="g-ground" />
              {has("lawn") &&
                [...Array(8)].map((_, i) => <rect key={i} x={i * 50} y="210" width="25" height="90" fill="#8DB57A" className="g-grow" style={{ animationDelay: `${i * 40}ms` }} />)}
              {space === "compound" ? (
                <g>
                  <rect x="18" y="120" width="120" height="92" fill="#F3EEE5" />
                  <path d="M10 124 L78 82 L146 124 Z" fill="#B5552F" />
                  <rect x="64" y="160" width="26" height="52" fill="#7A5C3E" />
                  <rect x="30" y="140" width="24" height="20" fill="#9EB4C4" />
                  <rect x="104" y="140" width="24" height="20" fill="#9EB4C4" />
                </g>
              ) : (
                <g>
                  <rect x="10" y="110" width="170" height="102" fill="#F3EEE5" />
                  {[...Array(4)].map((_, i) => (
                    <rect key={i} x={24 + i * 40} y="126" width="24" height="22" fill="#9EB4C4" />
                  ))}
                  {[...Array(4)].map((_, i) => (
                    <rect key={i} x={24 + i * 40} y="164" width="24" height="22" fill="#9EB4C4" />
                  ))}
                  <path d="M200 300 C 230 260, 260 240, 400 236" stroke="#E7DDC8" strokeWidth="18" fill="none" />
                </g>
              )}
            </g>
          )}
          {/* needs */}
          {has("trees") && (
            <g className="g-grow">
              <rect x="352" y="160" width="8" height="56" fill="#6B4F35" />
              <circle cx="356" cy="150" r="34" fill="#3F7A55" />
              <rect x="188" y="182" width="6" height="34" fill="#6B4F35" />
              <circle cx="191" cy="172" r="20" fill="#4E8A62" />
              <rect x="210" y="198" width="120" height="16" rx="8" fill="#5D9468" />
            </g>
          )}
          {has("beds") && (
            <g className="g-grow" style={{ animationDelay: "80ms" }}>
              <rect x={space === "balcony" ? 110 : 150} y="236" width="110" height="16" rx="8" fill="#7A5C3E" />
              {[...Array(9)].map((_, i) => (
                <circle key={i} cx={(space === "balcony" ? 118 : 158) + i * 12} cy={230 - (i % 2) * 6} r="6" fill={["#E0607E", "#F2C14E", "#F4F1E6", "#B5552F"][i % 4]} />
              ))}
            </g>
          )}
          {has("veg") && (
            <g className="g-grow" style={{ animationDelay: "120ms" }}>
              <rect x={space === "balcony" ? 250 : 280} y="250" width="96" height="26" fill="#8A6B4A" />
              {[...Array(6)].map((_, i) => (
                <path key={i} d={`M${(space === "balcony" ? 258 : 288) + i * 15} 250 q-6 -14 0 -20 q6 6 0 20`} fill="#4E8A62" />
              ))}
            </g>
          )}
          {has("pots") && (
            <g className="g-grow" style={{ animationDelay: "160ms" }}>
              {[0, 1, 2].map((i) => (
                <g key={i} transform={`translate(${(space === "balcony" ? 90 : 220) + i * 34} ${space === "balcony" ? 232 : 262})`}>
                  <path d="M0 0 h22 l-3 22 h-16 z" fill="#B5552F" />
                  <path d="M11 0 q-12 -22 -2 -30 q4 14 2 30 M11 0 q12 -20 4 -28 q-4 12 -4 28" fill="#3F7A55" />
                </g>
              ))}
            </g>
          )}
          {has("water") && (
            <g className="g-grow" style={{ animationDelay: "200ms" }}>
              <path d={space === "balcony" ? "M80 262 H380" : "M140 270 H390"} stroke="#5C8FB0" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" fill="none" className="g-drip" />
            </g>
          )}
        </svg>
        <p className="absolute left-5 top-5 rounded-full bg-white/80 px-3 py-1.5 text-[13px] font-medium text-ink-soft backdrop-blur">
          {size.toLocaleString()} {unit} · {sun === "full" ? "full sun" : sun === "part" ? "part sun" : "mostly shade"}
        </p>
      </div>

      {/* The choices */}
      <div className="flex flex-col gap-7 p-7 sm:p-10">
        <fieldset>
          <legend className="kicker">Your space</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {spaces.map((sp) => (
              <button
                key={sp.id}
                type="button"
                aria-pressed={space === sp.id}
                onClick={() => {
                  setSpace(sp.id)
                  setSize(sizes[sp.id].start)
                  if (sp.id === "balcony") setChosen(["pots"])
                }}
                className="chip"
              >
                {sp.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="kicker flex justify-between">
            <span>Roughly how big</span>
            <span className="tabular-nums normal-case tracking-normal text-ink">
              {size.toLocaleString()} {unit}
            </span>
          </span>
          <input type="range" min={s.min} max={s.max} step={s.step} value={size} onChange={(e) => setSize(Number(e.target.value))} className="range mt-4 w-full" />
        </label>

        <fieldset>
          <legend className="kicker">Sun</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["full", "part", "shade"] as const).map((v) => (
              <button key={v} type="button" aria-pressed={sun === v} onClick={() => setSun(v)} className="chip">
                {v === "full" ? "Full sun" : v === "part" ? "Part sun" : "Mostly shade"}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="kicker">What it needs</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {needs.map((n) => (
              <button key={n.id} type="button" aria-pressed={has(n.id)} onClick={() => toggle(n.id)} className="chip">
                {n.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div aria-live="polite" className="mt-auto rounded-3xl bg-green-deep p-6 text-white sm:p-7">
          <p className="text-[13px] uppercase tracking-[0.16em] text-white/60">Best fit</p>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-serif text-4xl italic">{plan.name} plan</p>
            <p className="text-right">
              <span className="text-[13px] text-white/60">about </span>
              <span className="font-serif text-4xl tabular-nums">GH₵ {monthly.toLocaleString()}</span>
              <span className="text-[13px] text-white/60"> / month</span>
            </p>
          </div>
          <p className="mt-3 text-[15px] text-white/75">
            {plan.visits}. An indicative concept price: the free visit gives you a fixed quote.
          </p>
          <a href="#visit" className="btn mt-5 bg-white text-ink hover:bg-sage">
            Book the free visit
          </a>
        </div>
      </div>
    </div>
  )
}
