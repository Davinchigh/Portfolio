import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page not found | Benedict Frimpong Boateng",
  robots: { index: false },
}

const routes = [
  { href: "/#work", label: "the work", note: "five builds, the problem and the result" },
  { href: "/projects", label: "every project", note: "everything i've shipped" },
  { href: "/resume", label: "the resume", note: "roles, education and certificates" },
]

/** A wrong turn on the road: says so plainly and offers three ways back. */
export default function NotFound() {
  return (
    <main className="wrap flex min-h-[78svh] flex-col justify-center pb-16 pt-32">
      <p className="eyebrow">404, off the road</p>
      <h1 className="mt-4 max-w-2xl text-4xl sm:text-6xl sm:leading-[1.02]">this road doesn&apos;t go anywhere.</h1>
      <p className="mt-5 max-w-lg text-muted-foreground">
        The page you were after has moved or never existed. Here are three places that do.
      </p>
      <ul className="mt-10 max-w-xl border-t">
        {routes.map((r) => (
          <li key={r.href} className="border-b">
            <Link href={r.href} className="group flex min-h-16 items-center justify-between gap-6 py-4">
              <span>
                <span className="block text-lg transition-colors group-hover:text-route">{r.label}</span>
                <span className="meta">{r.note}</span>
              </span>
              <span aria-hidden="true" className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-route">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/" className="link mt-8 inline-flex min-h-11 w-fit items-center text-sm">
        or start from the beginning
      </Link>
    </main>
  )
}
