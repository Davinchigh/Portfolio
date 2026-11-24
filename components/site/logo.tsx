/**
 * The bfb mark: a lowercase b whose bowl is the amber stop on the road this site follows.
 * The stem uses the text colour, so it works on both themes; the stop is always amber.
 */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`logo-mark ${className}`} aria-hidden="true">
      <rect className="logo-tile" x="1" y="1" width="62" height="62" rx="16" />
      <path className="logo-stem" d="M23 12v37" strokeLinecap="round" />
      <circle className="logo-ring" cx="35" cy="40" r="11" />
      <circle className="logo-stop" cx="35" cy="40" r="5" />
    </svg>
  )
}
