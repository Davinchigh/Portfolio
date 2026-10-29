/** The Glee Garden mark: a sprout rising out of a smile, drawn in one weight of line. */
export function Mark({ className = "h-8 w-8", color = "#1F4D3A" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 22.5c3.4 6.2 8 9.3 13 9.3s9.6-3.1 13-9.3" />
      <path d="M20 31.6V14.5" />
      <path d="M20 21c-5.6 0-9.4-3.6-10-9.4 5.6 0 9.4 3.6 10 9.4Z" fill={color} fillOpacity="0.14" />
      <path d="M20 16.6c5.3 0 8.9-3.4 9.5-9 -5.3 0-8.9 3.4-9.5 9Z" fill={color} fillOpacity="0.14" />
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <Mark color={light ? "#FFFFFF" : "#1F4D3A"} />
      <span className={`text-[21px] leading-none ${light ? "text-white" : "text-ink"}`}>
        <span className="font-serif italic">Glee</span> <span className="font-medium tracking-[-0.03em]">Garden</span>
      </span>
    </span>
  )
}
