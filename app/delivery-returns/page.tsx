import type { Metadata } from "next"
import { ProsePage } from "@/components/prose-page"
import { shop } from "@/lib/store"

export const metadata: Metadata = { title: "Delivery and returns", description: "Delivery in Accra, across Ghana and worldwide by DHL, plus our 14-day returns policy." }

const rows = [
  ["Accra", "Rider, same or next day", "[GH₵ fee by zone]"],
  ["Rest of Ghana", "Courier or bus parcel, 1 to 3 days", "[GH₵ fee]"],
  ["Worldwide", "DHL, 3 to 6 working days", "Quoted for each order"],
]

export default function Delivery() {
  return (
    <ProsePage eyebrow="DELIVERY AND RETURNS" title="Wherever you are">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Delivery options</caption>
          <thead className="text-ash">
            <tr>
              <th scope="col" className="py-3 pr-4 font-medium">Where</th>
              <th scope="col" className="py-3 pr-4 font-medium">How and how long</th>
              <th scope="col" className="py-3 font-medium">Cost</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-t border-gold/15">
                {r.map((c, i) => (i === 0 ? <th key={i} scope="row" className="py-3 pr-4 font-medium">{c}</th> : <td key={i} className="py-3 pr-4 text-champagne/85">{c}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Pick-up is free from {shop.pickupArea}, {shop.hours}. We share the exact address on WhatsApp.</p>
      <h2>Returns</h2>
      <p>Ready-to-wear pieces can be exchanged or refunded within 14 days of delivery if unworn, with tags on. You cover only the direct cost of sending it back.</p>
      <p>Made-to-measure pieces are cut for you, so they can&apos;t be returned, but alterations are free within 14 days.</p>
      <p>To start a return, message us on WhatsApp with your order details.</p>
    </ProsePage>
  )
}
