import type { Metadata } from "next"
import { ProsePage } from "@/components/prose-page"
import { shop } from "@/lib/store"

export const metadata: Metadata = { title: "Privacy", description: "What Lizab House of Fashion does with your information." }

export default function Privacy() {
  return (
    <ProsePage eyebrow="PRIVACY" title="Your information, in plain words">
      <p>This website has no accounts, no forms and no cookies. It doesn&apos;t collect your name, number or address.</p>
      <h2>Your bag</h2>
      <p>If you add pieces to your bag, the list is kept in your own browser so it&apos;s still there when you come back. It never reaches us until you choose to send it on WhatsApp. Clearing your browser data removes it.</p>
      <h2>When you order on WhatsApp</h2>
      <p>WhatsApp is run by Meta, and its own terms apply to your chat. We keep your name, number and delivery address only to fulfil your order and contact you about it. We don&apos;t sell or share them, and we only send offers to people who have said yes. Reply STOP any time.</p>
      <h2>Your rights</h2>
      <p>You can ask what we hold about you, correct it, or ask us to delete it: message {shop.phoneDisplay} or email {shop.email}. We follow Ghana&apos;s Data Protection Act, 2012 (Act 843).</p>
    </ProsePage>
  )
}
