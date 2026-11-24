/**
 * The Glee Garden business, as a concept: who it serves, how it charges, and what members get.
 * Prices are indicative concept prices for a business plan, not quotes. No reviews or client numbers are invented.
 */

export const audiences = [
  {
    id: "home",
    title: "Homes with a compound",
    body: "A lawn, a few beds and a mango tree that needs taming. Most of our work is family homes in and around Accra.",
  },
  {
    id: "balcony",
    title: "Apartments and balconies",
    body: "Pots, planters and a bit of green on a ledge. Small spaces, chosen carefully so they thrive in the heat.",
  },
  {
    id: "business",
    title: "Cafés, offices and shops",
    body: "Plants that make a room feel cared for, looked after on a schedule so your team never has to think about it.",
  },
  {
    id: "estate",
    title: "Gated estates",
    body: "Shared verges, entrances and play areas, kept tidy for property managers with a short report after every visit.",
  },
] as const

export type Plan = {
  id: "pots" | "home" | "estate"
  name: string
  for: string
  price: number
  per: string
  visits: string
  includes: string[]
  featured?: boolean
}

export const plans: Plan[] = [
  {
    id: "pots",
    name: "Pots",
    for: "Balconies, terraces and indoor plants",
    price: 350,
    per: "a month",
    visits: "2 visits a month",
    includes: ["Watering checks, feeding and pruning", "Repotting when roots outgrow a pot", "Swap any plant that fails, free"],
  },
  {
    id: "home",
    name: "Home",
    for: "A family compound with lawn and beds",
    price: 900,
    per: "a month",
    visits: "Weekly visits",
    includes: ["Mowing, edging and weeding", "Feeding, pruning and pest checks", "Rainy and dry season changeovers", "Plant clinic on WhatsApp"],
    featured: true,
  },
  {
    id: "estate",
    name: "Estate",
    for: "Large grounds, estates and businesses",
    price: 2800,
    per: "a month, from",
    visits: "Two visits a week",
    includes: ["A named lead gardener", "Irrigation checks and repairs", "A short photo report after each visit", "Seasonal colour planting"],
  },
]

export const promises = [
  { title: "A fixed quote before we start", body: "After the free visit you get one price for the job. If something unexpected comes up, we ask before spending a cedi more." },
  { title: "90-day plant guarantee", body: "Anything we plant that fails within 90 days under our care is replaced free." },
  { title: "Month to month", body: "Care plans have no contract. Pause during a trip or stop any time with a message." },
  { title: "Plant clinic", body: "Members send a photo on WhatsApp and get an answer within a working day: pest, water, sun or soil." },
]

export const projects = [
  { name: "Balcony makeover", range: "GH₵ 1,500 – 4,000", note: "Pots, soil, plants and setup" },
  { name: "New lawn", range: "GH₵ 25 – 45 per m²", note: "Levelling, soil and grass" },
  { name: "Garden redesign", range: "GH₵ 8,000 – 30,000", note: "Plan, beds, paths and planting" },
]

/* Plan builder: a rough guide to which plan fits and what it might cost. */
export const spaces = [
  { id: "balcony", label: "Balcony or pots", base: "pots" },
  { id: "compound", label: "Home compound", base: "home" },
  { id: "grounds", label: "Estate or business", base: "estate" },
] as const

export const needs = [
  { id: "lawn", label: "Lawn care", add: 150, home: true },
  { id: "beds", label: "Flower beds", add: 120, home: true },
  { id: "veg", label: "Kitchen garden", add: 140, home: true },
  { id: "trees", label: "Trees and hedges", add: 180, home: true },
  { id: "water", label: "Watering system", add: 160, home: false },
  { id: "pots", label: "Pots and planters", add: 90, home: false },
] as const

export type NeedId = (typeof needs)[number]["id"]
export type SpaceId = (typeof spaces)[number]["id"]

/** Indicative monthly price: the plan's base, scaled by size, plus each need, rounded to the nearest 50. */
export function estimate(space: SpaceId, size: number, sun: "full" | "part" | "shade", chosen: NeedId[]) {
  const plan = plans.find((p) => p.id === spaces.find((s) => s.id === space)!.base)!
  const sizeFactor = space === "balcony" ? 1 + size / 40 : space === "compound" ? 0.7 + size / 600 : 0.8 + size / 2500
  const extras = chosen.reduce((sum, id) => sum + (needs.find((n) => n.id === id)?.add ?? 0), 0)
  const sunFactor = sun === "full" ? 1.08 : sun === "shade" ? 0.96 : 1
  const raw = (plan.price * sizeFactor + extras * (space === "grounds" ? 2.5 : 1)) * sunFactor
  return { plan, monthly: Math.max(plan.price, Math.round(raw / 50) * 50) }
}
