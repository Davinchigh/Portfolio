import Link from "next/link"
import { PageHead } from "@/components/ui"

export default function NotFound() {
  return (
    <>
      <PageHead eyebrow="404" title="This room is empty" intro="The page you were looking for isn't here." />
      <div className="wrap py-12">
        <Link href="/" className="btn-ink">
          Back to the home page
        </Link>
      </div>
    </>
  )
}
