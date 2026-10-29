import Link from "next/link"
export default function NotFound() {
  return (
    <section className="wrap py-28 text-center">
      <p className="eyebrow">NOT FOUND</p>
      <h1 className="mt-4 text-5xl">This piece has moved on</h1>
      <p className="mt-3 text-ash">It may have sold out. Have a look at what&apos;s new.</p>
      <Link href="/shop/new-in/" className="btn-gold mt-8">See new pieces</Link>
    </section>
  )
}
