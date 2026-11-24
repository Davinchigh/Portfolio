"use client"

import { useEffect, useRef, useState } from "react"
import { MARK_B, SIGNATURE } from "@/lib/logo-paths"

const [bx0, by0, bx1, by1] = MARK_B.bounds
const bw = bx1 - bx0
const bh = by1 - by0

/**
 * The bfb mark: an italic serif b with an amber full stop.
 * `tile` sits it on a solid rounded square (favicon style); otherwise a hairline ring.
 */
export function LogoMark({ className = "h-8 w-8", tile = false }: { className?: string; tile?: boolean }) {
  const size = bh * 1.62
  const x = bx0 + bw / 2 - size / 2 - bw * 0.06
  const y = by0 + bh / 2 - size / 2
  return (
    <svg viewBox={`${x} ${y} ${size} ${size}`} className={`logo-mark ${tile ? "is-tile" : ""} ${className}`} aria-hidden="true">
      {tile ? (
        <rect className="logo-tile" x={x} y={y} width={size} height={size} rx={size * 0.24} />
      ) : (
        <circle className="logo-ring" cx={x + size / 2} cy={y + size / 2} r={size / 2 - size * 0.02} />
      )}
      <path className="logo-b" d={MARK_B.d} />
      <circle className="logo-stop" cx={bx1 + bw * 0.12} cy={by1 - bh * 0.06} r={bh * 0.055} />
    </svg>
  )
}

/**
 * "bfb" in a copperplate hand, written out left to right as if by a dip pen the first time the page
 * loads, and again when the logo is hovered. Still with reduced motion.
 */
export function Signature({ className = "" }: { className?: string }) {
  const [run, setRun] = useState(0)
  const ref = useRef<SVGSVGElement>(null)
  const [vx, vy, vw, vh] = SIGNATURE.viewBox

  useEffect(() => {
    const link = ref.current?.closest("a")
    if (!link) return
    const again = () => setRun((n) => n + 1)
    link.addEventListener("mouseenter", again)
    return () => link.removeEventListener("mouseenter", again)
  }, [])

  return (
    <svg ref={ref} key={run} viewBox={`${vx} ${vy} ${vw} ${vh}`} className={`signature ${className}`} aria-hidden="true">
      <defs>
        <mask id={`sig-wipe-${run}`} maskUnits="userSpaceOnUse" x={vx} y={vy} width={vw} height={vh}>
          <rect className="sig-wipe" x={vx} y={vy} width={vw} height={vh} fill="#fff" />
        </mask>
      </defs>
      <path className="sig-trace" d={SIGNATURE.d} pathLength={1} />
      <path className="sig-ink" d={SIGNATURE.d} mask={`url(#sig-wipe-${run})`} />
    </svg>
  )
}
