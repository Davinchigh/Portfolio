import type { Metadata } from "next"
import { ProsePage } from "@/components/prose-page"
import { shop } from "@/lib/store"

export const metadata: Metadata = { title: "About", description: "The story of Lizab House of Fashion, a fashion house in Accra." }

export default function About() {
  return (
    <ProsePage eyebrow="ABOUT LIZAB" title="Cut in Accra. Worn everywhere.">
      <p className="font-display text-2xl italic text-champagne">[Her story in her own words: how Lizab started, what she makes, and who she makes it for.]</p>
      <p>[A photo of her or the workroom goes here, if she is happy to share one. Real faces build trust.]</p>
      <h2>Visit or chat</h2>
      <p>{shop.city}. WhatsApp {shop.phoneDisplay}. Instagram @{shop.instagram}.</p>
    </ProsePage>
  )
}
