/** The site's own mark: a fine ring with the initials JN. Not the hall's crest. */
export function Flame({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="20" cy="20" r="15.5" fill="none" stroke="#D4B26A" strokeWidth="0.75" />
      <text x="20" y="25.2" textAnchor="middle" fontFamily="'Newsreader Variable', Georgia, serif" fontSize="15" fontStyle="italic" fill="currentColor">
        JN
      </text>
    </svg>
  )
}
