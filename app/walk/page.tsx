import type { Metadata } from "next"
import { PageHead } from "@/components/ui"
import { Walk } from "@/components/walk/walk"

export const metadata: Metadata = {
  title: "Walk through the hall",
  description: "Scroll through a clay model of Jean Nelson Aka Hall: the way in, the namesake, a room, Hall Week and the conference room.",
}

export default function WalkPage() {
  return (
    <>
      <PageHead
        eyebrow="Walk through"
        title="Scroll to walk the hall"
        intro="A clay model, built in code from what's published about the hall. Scroll to move, use the stops along the bottom to jump, and drag Look to turn your head."
      />
      <Walk />
    </>
  )
}
