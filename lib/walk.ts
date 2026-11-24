/**
 * The scroll walk-through. Every stop says only what a published source says (cite ids point at lib/site.ts),
 * and the 3D model is a clay sketch, not a survey: block shapes, the room layout and the stage are illustrative.
 */
export type Stop = {
  id: string
  tick: string
  eyebrow: string
  title: string
  body: string
  cites: string[]
  illustrative?: string
}

export const stops: Stop[] = [
  {
    id: "arrive",
    tick: "Arrive",
    eyebrow: "Southern Legon",
    title: "Off the road to Noguchi",
    body: "The hall sits on the southern part of the Legon campus, off the road to the Noguchi Memorial Institute for Medical Research. It opened in 2011 as one of four new halls.",
    cites: ["cloth", "gna"],
  },
  {
    id: "name",
    tick: "Namesake",
    eyebrow: "Lux in Tenebris",
    title: "Named for an alumnus who gave back",
    body: "Dr. Jean Nelson Aka, a distinguished alumnus and former Managing Director of Ecobank, helped raise the funds that built Jubilee Hall. His advice, passed on by his son: whatever you do in life, do it well.",
    cites: ["cloth", "gna", "graphic2013", "rose"],
  },
  {
    id: "room",
    tick: "A room",
    eyebrow: "Self-contained",
    title: "Four to a room, with its own bathroom",
    body: "All 430 rooms are self-contained, and in the four new halls four students share a room. The JCR put ceiling fans in the rooms, and more were donated in 2016.",
    cites: ["cloth", "graphic2013", "fans"],
    illustrative: "Furniture and layout are a sketch. Rooms differ, and this is not an official plan.",
  },
  {
    id: "week",
    tick: "Hall Week",
    eyebrow: "The Royals",
    title: "Hall Week, and the hall cloth",
    body: "Residents are known as Royals. The hall launched its own cloth during Hall Week in 2014, and later Hall Weeks have run under themes like \"Stand Out\", with cooking competitions and safety talks.",
    cites: ["halls", "cloth", "standout", "lpg"],
    illustrative: "The stage and lights are an illustration of a Hall Week evening.",
  },
  {
    id: "conference",
    tick: "Conference room",
    eyebrow: "Refurbished 2024",
    title: "A hundred seats for talks and meetings",
    body: "The refurbished conference room was commissioned in July 2024: a 100-seat, air-conditioned, multi-purpose room with a 65-inch screen.",
    cites: ["rose"],
  },
  {
    id: "above",
    tick: "Above",
    eyebrow: "430 rooms, about 1,700 Royals",
    title: "One hall, many late nights",
    body: "A mixed hall for undergraduates, postgraduates and international students. If you lived here, help make this model truer: block names, a room photo, a rough floor plan.",
    cites: ["cloth"],
  },
]
