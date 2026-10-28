/**
 * A handwritten margin note with a small drawn arrow, like a comment scribbled on a printout.
 * Decorative: hidden from screen readers unless `readable` is set.
 */
export function HandNote({
  children,
  arrow = "left",
  className = "",
  readable = false,
}: {
  children: React.ReactNode
  arrow?: "left" | "down-left" | "none"
  className?: string
  readable?: boolean
}) {
  return (
    <span className={`hand inline-flex items-center gap-1 ${className}`} aria-hidden={readable ? undefined : true}>
      {arrow === "left" && (
        <svg viewBox="0 0 40 16" className="h-4 w-9 shrink-0" fill="none" aria-hidden="true">
          <path d="M39 9C28 4 15 3 3 8m0 0 6-5M3 8l6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {arrow === "down-left" && (
        <svg viewBox="0 0 30 26" className="h-6 w-7 shrink-0" fill="none" aria-hidden="true">
          <path d="M28 2C24 12 16 19 4 22m0 0 6-6M4 22l7 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span>{children}</span>
    </span>
  )
}
