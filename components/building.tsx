/**
 * Abstract night-time residence block. Not a drawing of the real building.
 * Some windows light up once (CSS only). Reduced motion shows them already lit.
 */
const COLS = 12
const ROWS = 6

// Deterministic "random" so the server and client agree.
function lit(r: number, c: number) {
  const n = (r * 37 + c * 91 + r * c * 13) % 17
  return n < 7
}

export function Building() {
  const windows: { x: number; y: number; on: boolean; delay: number }[] = []
  let k = 0
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const on = lit(r, c)
      windows.push({ x: 70 + c * 52, y: 150 + r * 48, on, delay: on ? 0.3 + (k++ % 23) * 0.12 : 0 })
    }
  }
  return (
    <svg viewBox="0 0 760 520" className="h-auto w-full" role="img" aria-labelledby="bld-title">
      <title id="bld-title">An illustration of a residence hall at night with many lit windows. Not a picture of the real building.</title>
      <defs>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#F2B84B" stopOpacity="0.35" />
          <stop offset="1" stopColor="#F2B84B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14112B" />
          <stop offset="1" stopColor="#2C2659" />
        </linearGradient>
      </defs>
      <rect width="760" height="520" rx="28" fill="url(#sky)" />
      {/* stars */}
      {[
        [60, 50], [140, 90], [250, 40], [360, 70], [470, 30], [560, 80], [690, 55], [620, 120], [90, 120],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1.2} fill="#EDE9F7" opacity="0.7" />
      ))}
      {/* moon */}
      <circle cx="660" cy="70" r="22" fill="#FBE3AE" opacity="0.9" />
      <circle cx="670" cy="64" r="20" fill="#1A1636" />
      {/* trees */}
      <path d="M0 470c30-40 60-60 90-40s40-50 70-40 30 40 50 80H0Z" fill="#0D0B1F" />
      <path d="M760 470c-30-50-70-70-100-40s-40-30-70-20-20 40-30 60h200Z" fill="#0D0B1F" />
      {/* block */}
      <rect x="44" y="120" width="672" height="330" rx="6" fill="#1E1A3F" />
      <rect x="44" y="112" width="672" height="14" rx="4" fill="#2C2659" />
      {windows.map((w, i) => (
        <g key={i}>
          <rect x={w.x} y={w.y} width="34" height="30" rx="3" fill="#2A2452" />
          {w.on ? (
            <g className="window-lit" style={{ animationDelay: `${w.delay}s` }}>
              <rect x={w.x - 14} y={w.y - 12} width="62" height="54" fill="url(#glow)" />
              <rect x={w.x} y={w.y} width="34" height="30" rx="3" fill="#F2B84B" />
              <rect x={w.x + 16} y={w.y} width="2" height="30" fill="#C98A1E" opacity="0.6" />
            </g>
          ) : null}
        </g>
      ))}
      {/* entrance */}
      <rect x="340" y="400" width="80" height="50" rx="4" fill="#0D0B1F" />
      <rect x="352" y="410" width="56" height="40" rx="3" fill="#F2B84B" opacity="0.85" />
      <rect x="0" y="450" width="760" height="70" fill="#0D0B1F" />
      <path d="M0 520h760" stroke="#2C2659" />
    </svg>
  )
}
