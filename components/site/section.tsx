import type { ReactNode } from "react"

/** A home page section: small mono eyebrow, a heading, optional one-line intro, then content. */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  aside,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  intro?: ReactNode
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="wrap scroll-mt-20 py-16 sm:py-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`} className="mt-3 text-3xl sm:text-4xl">
            {title}
          </h2>
          {intro && <p className="mt-3 max-w-xl text-muted-foreground">{intro}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  )
}
