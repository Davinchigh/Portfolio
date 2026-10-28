import type { ReactNode } from "react"

export default function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="page pb-12 pt-32 md:pb-16 md:pt-40">
      <h1 className="text-5xl font-semibold tracking-[-0.04em] md:text-7xl">{title}</h1>
      {children && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">{children}</div>}
    </header>
  )
}
