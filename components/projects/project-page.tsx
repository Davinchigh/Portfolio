import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import type { ReactNode } from "react"

/** Shared frame for a project that runs on this site: a header, the live demo, then how it works. */
export function ProjectPage({
  eyebrow,
  title,
  intro,
  code,
  children,
}: {
  eyebrow: string
  title: string
  intro: ReactNode
  code: string
  children: ReactNode
}) {
  return (
    <main className="wrap pb-24 pt-28 sm:pt-36">
      <Link href="/projects" className="link inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> all projects
      </Link>
      <header className="settle mt-6">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 text-5xl tracking-[-0.05em] sm:text-7xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
        <p className="mt-4">
          <a href={code} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center gap-1 text-sm font-medium">
            read the code <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </p>
      </header>
      {children}
    </main>
  )
}

export function Notes({ items }: { items: { title: string; body: ReactNode }[] }) {
  return (
    <section className="mt-20" aria-label="How it works">
      <p className="eyebrow">how it works</p>
      <ul className="mt-6 grid gap-8 md:grid-cols-3">
        {items.map((item) => (
          <li key={item.title} className="border-l-2 border-route/40 pl-5">
            <h2 className="text-xl leading-tight">{item.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
