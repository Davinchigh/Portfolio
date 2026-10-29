import type { Metadata } from "next"
import { ProsePage } from "@/components/prose-page"
import { askLink, shop } from "@/lib/store"

export const metadata: Metadata = { title: "How to order", description: "Order on WhatsApp in three steps. Pay by mobile money or bank transfer only after we confirm your item." }

export default function HowToOrder() {
  return (
    <ProsePage eyebrow="HOW TO ORDER" title="Ordering is a conversation">
      <p>Every order happens on WhatsApp, with a real person: {shop.name}.</p>
      <h2>1. Choose your piece</h2>
      <p>Open a product, pick your colour and size, then tap <strong>Order on WhatsApp</strong>. Your message is written for you with the item name, code, size and price. Add where it should be delivered and send.</p>
      <p>Buying a few pieces? Add them to your bag and send them all in one message.</p>
      <h2>2. We confirm</h2>
      <p>We check the piece is available (or when it will be ready, if it is made to order), confirm your delivery cost, and answer any questions about fit.</p>
      <h2>3. Pay and receive</h2>
      <p>Pay by mobile money or bank transfer. <strong>We never ask for payment before confirming your item is available.</strong> Then we deliver, or you pick up from {shop.pickupArea}.</p>
      <h2>Not sure of your size?</h2>
      <p>Choose &ldquo;Not sure, please advise&rdquo; when ordering, or send us your measurements. Made-to-measure is available for most pieces.</p>
      <p><a className="btn-gold mt-4" href={askLink()} target="_blank" rel="noopener noreferrer">Start a chat on WhatsApp</a></p>
    </ProsePage>
  )
}
