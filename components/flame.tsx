/** The site's own mark: a single candle flame for "Light in Darkness". Not the hall's logo. */
export function Flame({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <circle cx="16" cy="14" r="12" fill="#F2B84B" opacity="0.18" />
      <path d="M16 3c3 5 7 8.5 7 13.5A7 7 0 0 1 9 16.5C9 12 12 10 13 6c1.5 2.5 2.6 3.6 3 6 0-3 .3-6 0-9Z" fill="#F2B84B" />
      <path d="M16 13c1.6 2 3 3.4 3 5.3a3 3 0 0 1-6 0c0-1.7 1.4-3 3-5.3Z" fill="#FBE3AE" />
      <rect x="13" y="24" width="6" height="6" rx="1" fill="#EDE9F7" />
    </svg>
  )
}
