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

/** Small superscript source link to the Sources page. */
export function Cite({ id }: { id: string }) {
  const n = sources.findIndex((s) => s.id === id) + 1
  if (!n) return null
  return (
    <a
      href={`/sources/#src-${id}`}
      className="relative -top-[0.45em] ml-0.5 inline-flex min-h-[24px] min-w-[24px] items-center justify-center rounded text-[0.7rem] font-medium tabular-nums text-lamp-deep no-underline transition-colors hover:bg-lamp-soft"
      aria-label={`Source ${n}`}
    >
      {n}
    </a>
  )
}

/** Editorial page header: a small label, a large serif title and a short intro, over a hairline. */
export function PageHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: React.ReactNode }) {
  return (
    <header className="wrap pb-14 pt-16 sm:pb-20 sm:pt-24">
      <p className="label flex items-center gap-3 text-lamp-deep fade-in">
        <span className="rule" aria-hidden="true" />
        {eyebrow}
      </p>
      <h1 className="mt-6 max-w-4xl text-[clamp(2.6rem,6.5vw,5.2rem)]">
        <span className="line-mask">
          <span>{title}</span>
        </span>
      </h1>
      {intro ? <div className="fade-in mt-7 max-w-2xl text-lg leading-relaxed text-ink-muted">{intro}</div> : null}
      <div className="mt-14 h-px w-full bg-line" aria-hidden="true" />
    </header>
  )
}

/** Two-column editorial section: the heading sits in its own column on wide screens. */
export function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="wrap reveal py-14 sm:py-20" aria-labelledby={id ? `${id}-h` : undefined}>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16">
        <h2 id={id ? `${id}-h` : undefined} className="text-3xl sm:text-[2.6rem]">
          {title}
        </h2>
        <div className="prose-hall max-w-prose">{children}</div>
      </div>
    </section>
  )
}

export function Callout({ tone = "lamp", title, children }: { tone?: "lamp" | "warn"; title: string; children: React.ReactNode }) {
  const warn = tone === "warn"
  return (
    <aside
      className={`reveal relative overflow-hidden rounded-2xl border p-6 sm:p-8 ${warn ? "border-[#9B2C24]/25 bg-[#FBF1EF]" : "border-line bg-white"}`}
      aria-label={title}
    >
      <span className={`absolute inset-y-0 left-0 w-[3px] ${warn ? "bg-[#9B2C24]" : "bg-lamp"}`} aria-hidden="true" />
      <p className={`label ${warn ? "text-[#9B2C24]" : "text-lamp-deep"}`}>{warn ? "Important" : "Note"}</p>
      <p className="mt-2 font-display text-2xl">{title}</p>
      <div className="mt-3 text-ink/85">{children}</div>
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

/** The motto, set as a quiet piece of typography with a slow lamplight glow behind it. */
export function MottoCard({ className = "" }: { className?: string }) {
  return (
    <figure className={`on-night relative isolate overflow-hidden rounded-[28px] bg-night px-8 py-12 text-mist sm:px-12 sm:py-16 ${className}`}>
      <span
        aria-hidden="true"
        className="breathe absolute -right-24 -top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,rgba(212,178,106,0.55),rgba(212,178,106,0.12)_55%,transparent)] blur-2xl"
      />
      <span aria-hidden="true" className="absolute inset-x-8 top-8 h-px bg-white/10 sm:inset-x-12" />
      <p className="label text-lamp">The hall motto</p>
      <blockquote className="mt-10 font-display text-[clamp(2.8rem,5vw,4.4rem)] italic leading-[0.95] tracking-[-0.03em]">
        <p>
          Lux
          <br />
          in Tenebris.
        </p>
      </blockquote>
      <figcaption className="mt-8 max-w-xs text-mist-muted">Light in darkness. For every late night before a paper.</figcaption>
    </figure>
  )
}
