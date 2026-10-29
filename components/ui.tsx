import { isPlaceholder, sources } from "@/lib/site"

/** Shows a value, or a highlighted placeholder if Ben has not filled it in yet. */
export function Ph({ value }: { value: string }) {
  if (!isPlaceholder(value)) return <>{value}</>
  return (
    <mark className="placeholder" title="Placeholder: to be filled in">
      {value}
    </mark>
  )
}

/** Small superscript-style source link to the Sources page. */
export function Cite({ id }: { id: string }) {
  const n = sources.findIndex((s) => s.id === id) + 1
  if (!n) return null
  return (
    <a
      href={`/sources/#src-${id}`}
      className="ml-0.5 inline-flex min-h-[24px] min-w-[24px] items-center justify-center rounded px-1 align-baseline text-xs font-bold text-lamp-deep underline underline-offset-2"
      aria-label={`Source ${n}`}
    >
      [{n}]
    </a>
  )
}

export function PageHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: React.ReactNode }) {
  return (
    <header className="bg-night text-mist">
      <div className="wrap pb-14 pt-12 sm:pb-20 sm:pt-16">
        <p className="eyebrow text-lamp">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        {intro ? <div className="mt-5 max-w-2xl text-lg text-mist-muted">{intro}</div> : null}
      </div>
    </header>
  )
}

export function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="wrap py-12 sm:py-16" aria-labelledby={id ? `${id}-h` : undefined}>
      <h2 id={id ? `${id}-h` : undefined} className="text-3xl sm:text-4xl">
        {title}
      </h2>
      <div className="prose-hall mt-5 max-w-prose">{children}</div>
    </section>
  )
}

export function AiFigure({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <figure className={className}>
      <img
        src={src}
        alt={alt}
        width={1200}
        height={800}
        loading="lazy"
        decoding="async"
        className="h-auto w-full rounded-2xl bg-night-2 object-cover"
      />
      <figcaption className="mt-2 text-sm text-ink-muted">
        Illustrative, AI-generated. Not a photo of Jean Nelson Aka Hall.
      </figcaption>
    </figure>
  )
}

export function Callout({ tone = "lamp", title, children }: { tone?: "lamp" | "warn"; title: string; children: React.ReactNode }) {
  const style = tone === "warn" ? "border-[#B3261E] bg-[#FCEDEB]" : "border-lamp-deep bg-paper-2"
  return (
    <aside className={`rounded-2xl border-l-8 p-5 sm:p-6 ${style}`} aria-label={title}>
      <p className="font-display text-xl">{title}</p>
      <div className="mt-2">{children}</div>
    </aside>
  )
}

export function Ext({ href, children, night = false }: { href: string; children: React.ReactNode; night?: boolean }) {
  return (
    <a href={href} className={night ? "link-night" : "link"} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
      <span aria-hidden="true"> ↗</span>
    </a>
  )
}
