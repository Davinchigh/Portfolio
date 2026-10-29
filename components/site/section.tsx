import type { ReactNode } from "react"
import { Stop } from "@/components/site/route"

/** A stop on the route: the stop's name, a heading, an optional one-line intro, then content. */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  aside,
  children,
}: {
  id: string
  eyebrow: ReactNode
  title: ReactNode
  intro?: ReactNode
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="wrap scroll-mt-20 py-16 sm:py-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow relative">
            <Stop />
            {eyebrow}
          </p>
          <h2 id={`${id}-title`} className="mt-3 text-3xl sm:text-[2.6rem] sm:leading-[1.05]">
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
