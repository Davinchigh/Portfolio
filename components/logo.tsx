/** The Lizab mark: the laurel and the script L, redrawn as single-weight gold line art (lady silhouette dropped). */
export function Monogram({ className = "", title }: { className?: string; title?: string }) {
  const leaves = Array.from({ length: 8 }, (_, i) => i)
  // Two branches climbing the sides of a circle from the bottom, leaves along the tangent, tilted outward.
  const leaf = (side: 1 | -1, i: number) => {
    const aDeg = 250 - i * 17 // bottom-left up to upper-left
    const a = (aDeg * Math.PI) / 180
    const r = 42
    const x = Math.round((60 + side * Math.cos(a) * r) * 1000) / 1000
    const y = Math.round((62 - Math.sin(a) * r) * 1000) / 1000
    const tangent = aDeg - 90 // direction of travel (clockwise up the left side)
    const rot = side === 1 ? -tangent - 28 : -(180 - tangent) + 28
    return <ellipse key={`${side}${i}`} cx={x} cy={y} rx="7.5" ry="2.8" transform={`rotate(${rot} ${x} ${y})`} />
  }
  return (
    <svg viewBox="0 0 120 120" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {leaves.map((i) => leaf(1, i))}
        {leaves.map((i) => leaf(-1, i))}
        <path d="M44 104 Q60 110 76 104" />
      </g>
      <text x="60" y="76" textAnchor="middle" fill="currentColor" fontFamily="'Bodoni Moda Variable', Georgia, serif" fontStyle="italic" fontSize="46">
        L
      </text>
    </svg>
  )
}

export function Lockup({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 text-gold ${className}`}>
      <Monogram className="h-10 w-10" />
      <span aria-hidden="true" className="h-9 w-px bg-gold/60" />
      <span className="leading-none">
        <span className="block font-display text-xl font-semibold tracking-[0.12em]">LIZAB</span>
        <span className="mt-1 block text-[10px] font-medium tracking-caps text-champagne/80">HOUSE OF FASHION</span>
      </span>
    </span>
  )
}
