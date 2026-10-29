/**
 * Everything the shop says, in one place. Edit here, not in the components.
 *
 * Before launch:
 *  - Replace every `sample: true` product with her real items, real photos and real prices.
 *  - Fill the [BRACKETED] details below.
 */

export const shop = {
  name: "Lizab House of Fashion",
  short: "Lizab",
  tagline: "Men's & Women's Fashion. Handcrafted Elegance.",
  city: "Accra, Ghana",
  whatsapp: "233244144899", // wa.me format: country code, no plus, no leading zero
  phoneDisplay: "+233 244 144 899",
  instagram: "LizabHouseOfFashion",
  domain: "lizabhouseoffashion.com", // unverified: check it is registered to her before printing it
  email: "[EMAIL]",
  pickupArea: "[PICK-UP AREA, ACCRA]",
  hours: "[OPENING HOURS]",
  usdRate: 0, // GHS per 1 USD, set by hand each week. 0 hides the approximate USD price.
}

export type CollectionSlug = "women" | "men" | "bags-shoes" | "new-in"

export const collections: { slug: CollectionSlug; name: string; line: string }[] = [
  { slug: "new-in", name: "New in", line: "The latest pieces from the workroom." },
  { slug: "women", name: "Women", line: "Dresses, sets and tailoring." },
  { slug: "men", name: "Men", line: "Tailored pieces for him." },
  { slug: "bags-shoes", name: "Bags & Shoes", line: "The finishing touch." },
]

export type Product = {
  code: string
  name: string
  collection: Exclude<CollectionSlug, "new-in">
  newIn?: boolean
  price: number // GHS
  colours: string[]
  sizes: string[]
  availability: "ready" | "made-to-order" | "sold-out"
  leadTime: string
  fabric: string
  care: string
  images: { src: string; alt: string }[]
  /** Placeholder taken from the old flyer. Never publish a sample as a real product. */
  sample?: boolean
}

export const products: Product[] = [
  {
    code: "LZ-W-001",
    name: "Tailored blazer and wide-leg trouser set",
    collection: "women",
    newIn: true,
    price: 950,
    colours: ["Black and sand"],
    sizes: ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16"],
    availability: "made-to-order",
    leadTime: "Made to order in 7 to 10 days",
    fabric: "[FABRIC]",
    care: "[CARE]",
    images: [{ src: "/campaign/look-blazer.webp", alt: "Black single-breasted blazer over a cream silk camisole, with high-waisted sand wide-leg trousers" }],
    sample: true,
  },
  {
    code: "LZ-W-002",
    name: "Silk wrap midi dress",
    collection: "women",
    newIn: true,
    price: 850,
    colours: ["Emerald"],
    sizes: ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16"],
    availability: "made-to-order",
    leadTime: "Made to order in 7 to 10 days",
    fabric: "[FABRIC]",
    care: "[CARE]",
    images: [{ src: "/campaign/look-emerald.webp", alt: "Emerald silk wrap midi dress with long sleeves and a tie waist, the skirt swirling" }],
    sample: true,
  },
  {
    code: "LZ-M-001",
    name: "Tailored two-piece suit",
    collection: "men",
    newIn: true,
    price: 1800,
    colours: ["Charcoal"],
    sizes: ["38", "40", "42", "44", "46", "Made to measure"],
    availability: "made-to-order",
    leadTime: "Made to order in 10 to 14 days",
    fabric: "[FABRIC]",
    care: "[CARE]",
    images: [{ src: "/campaign/look-menswear.webp", alt: "Charcoal two-piece suit with a cream open-collar shirt and brown leather loafers" }],
    sample: true,
  },
  {
    code: "LZ-S-001",
    name: "Cap-toe court pumps",
    collection: "bags-shoes",
    price: 480,
    colours: ["Nude and black"],
    sizes: ["EU 37", "EU 38", "EU 39", "EU 40", "EU 41"],
    availability: "ready",
    leadTime: "Ready to ship in 1 to 2 days",
    fabric: "[MATERIAL]",
    care: "[CARE]",
    images: [{ src: "/campaign/product-pumps.webp", alt: "Pair of nude pointed court shoes with black patent toe caps and slim stiletto heels" }],
    sample: true,
  },
  {
    code: "LZ-B-001",
    name: "Top-handle bag with gold chain",
    collection: "bags-shoes",
    newIn: true,
    price: 780,
    colours: ["Black"],
    sizes: ["One size"],
    availability: "ready",
    leadTime: "Ready to ship in 1 to 2 days",
    fabric: "[MATERIAL]",
    care: "[CARE]",
    images: [{ src: "/campaign/product-bag.webp", alt: "Black structured top-handle bag with a round gold clasp and a gold chain strap" }],
    sample: true,
  },
]

export const hasSamples = products.some((p) => p.sample)

export function productsIn(slug: CollectionSlug) {
  return slug === "new-in" ? products.filter((p) => p.newIn) : products.filter((p) => p.collection === slug)
}

export const findProduct = (code: string) => products.find((p) => p.code.toLowerCase() === code.toLowerCase())

export const ghs = (n: number) => `GH₵ ${n.toLocaleString("en-GH")}`
export const usd = (n: number) => (shop.usdRate > 0 ? `≈ US$ ${Math.round(n / shop.usdRate)}` : null)

export const productUrl = (code: string) => `https://${shop.domain}/p/${code.toLowerCase()}/`

export type OrderLine = { code: string; name: string; colour: string; size: string; price: number }

/** One WhatsApp message for one item or a whole bag. *bold* renders in WhatsApp. */
export function whatsappLink(lines: OrderLine[]) {
  const items = lines.map((l, i) =>
    [
      `${lines.length > 1 ? `${i + 1}. ` : ""}*${l.name}*`,
      `Code: ${l.code}`,
      `Colour: ${l.colour}`,
      `Size: ${l.size}`,
      `Price: ${ghs(l.price)}`,
      productUrl(l.code),
    ].join("\n"),
  )
  const total = lines.length > 1 ? `\n\nSubtotal: ${ghs(lines.reduce((n, l) => n + l.price, 0))} (delivery to be confirmed)` : ""
  const text = `Hello ${shop.name}, I'd like to order:\n\n${items.join("\n\n")}${total}\n\nDelivery to: `
  return `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(text)}`
}

export const askLink = (about?: string) =>
  `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(about ? `Hello ${shop.name}, I have a question about ${about}.` : `Hello ${shop.name}!`)}`
