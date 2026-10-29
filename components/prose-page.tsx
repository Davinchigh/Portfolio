export function ProsePage({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <article className="wrap max-w-3xl py-16">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 text-5xl leading-tight">{title}</h1>
      <div className="nkyemu my-10" />
      <div className="prose-lizab space-y-4">{children}</div>
    </article>
  )
}
