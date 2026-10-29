/** The Glee Garden mark: a sprout rising out of a smile. Gardening, made joyful. */
export function Mark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#183A2C" />
      <path d="M14 35 Q32 54 50 35" fill="none" stroke="#F2B84B" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M32 44.5 V23" fill="none" stroke="#7FB069" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M32 31 C23.5 31 18 25.5 17 17 C25.5 17 31 22.5 32 31 Z" fill="#7FB069" />
      <path d="M32 25.5 C40 25.5 45.5 20 46.5 11.5 C38 11.5 32.5 17 32 25.5 Z" fill="#A9D18E" />
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Mark />
      <span className={`font-display text-[22px] leading-none ${light ? "text-cream" : "text-forest"}`} style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}>
        <em className="font-semibold">Glee</em> <span className="font-medium">Garden</span>
      </span>
    </span>
  )
}
