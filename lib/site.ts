/**
 * Everything Ben still needs to fill in lives here.
 * Any value still wrapped in [SQUARE BRACKETS] is shown on the site as a visible placeholder.
 */
export const site = {
  name: "Jean Nelson Aka Hall",
  short: "Jean Nelson Hall",
  url: "[SITE URL]",
  maker: "Benedict Frimpong Boateng",
  // Digits only with country code, for example 233XXXXXXXXX. Left as a placeholder until Ben says which number to publish.
  whatsapp: "[WHATSAPP NUMBER]",
  email: "[CONTACT EMAIL]",
  hallOfficePhone: "[HALL OFFICE PHONE]",
  portersPhone: "[PORTERS' LODGE PHONE]",
  hallMaster: "[CURRENT HALL MASTER]",
  seniorTutor: "[CURRENT SENIOR TUTOR]",
  hallWeekDates: "[HALL WEEK DATES]",
  fees: "[CURRENT FEES]",
  benMemory: "[BEN'S MEMORY]",
  benYears: "[BEN'S YEARS IN HALL]",
} as const

export const isPlaceholder = (v: string) => v.startsWith("[") && v.endsWith("]")

export const disclaimer =
  "An unofficial site made by a former resident. Not affiliated with the University of Ghana or the hall administration."

/** Official places to send people. We link out; we never copy or imitate them. */
export const official = {
  sts: { href: "https://sts.ug.edu.gh", label: "UG Student Portal (STS)" },
  ug: { href: "https://www.ug.edu.gh", label: "University of Ghana website" },
  aad: { href: "https://www.ug.edu.gh/aad/", label: "UG Academic Affairs Directorate" },
  allocationNotice: {
    href: "https://www.graphic.com.gh/news/education/ug-warns-against-fraud-ahead-of-random-room-allocation-for-freshers-on-january-12.html",
    label: "Graphic Online: UG notice on random room allocation for freshers (Jan 2026)",
  },
}

export type Source = { id: string; title: string; publisher: string; date: string; href: string }

export const sources: Source[] = [
  {
    id: "cloth",
    title: "Jean Nelson Aka Hall Launch Hall Cloth",
    publisher: "University of Ghana",
    date: "7 Nov 2014",
    href: "https://old1.ug.edu.gh/node/7306",
  },
  {
    id: "halls",
    title: "A brief description of the various halls",
    publisher: "University of Ghana, Students",
    date: "undated",
    href: "https://www.ug.edu.gh/students/node/89",
  },
  {
    id: "gna",
    title: "University of Ghana inaugurates hall in honour of first female graduate",
    publisher: "Ghana News Agency via Modern Ghana",
    date: "Jan 2012",
    href: "https://www.modernghana.com/news/372972/university-of-ghana-inaugurates-hall-in-honour-of-first-fema.html",
  },
  {
    id: "graphic2013",
    title: "Changing face of the University of Ghana, Legon",
    publisher: "Graphic Online",
    date: "16 Jul 2013",
    href: "https://www.graphic.com.gh/news/general-news/changing-face-of-the-university-of-ghana-legon.html",
  },
  {
    id: "rose",
    title: "Refurbished Conference Room at the Jean Nelson Hall Commissioned",
    publisher: "University of Ghana",
    date: "15 Jul 2024",
    href: "https://ug.edu.gh/node/602",
  },
  {
    id: "fans",
    title: "MP for Ayawaso West Wuogon Makes Donation to Jean Nelson Aka Hall",
    publisher: "University of Ghana",
    date: "26 Aug 2016",
    href: "https://lawlibrary.ug.edu.gh/node/8019",
  },
  {
    id: "alloc",
    title: "UG warns against fraud ahead of random room allocation for freshers on January 12",
    publisher: "Graphic Online",
    date: "5 Jan 2026",
    href: official.allocationNotice.href,
  },
  {
    id: "aad",
    title: "Further information on on-campus accommodation (freshmen)",
    publisher: "University of Ghana, Academic Affairs",
    date: "2020/21 edition",
    href: "https://lawlibrary.ug.edu.gh/node/280",
  },
]

export const nav = [
  { href: "/", label: "Home" },
  { href: "/hall/", label: "The hall" },
  { href: "/life/", label: "Life" },
  { href: "/rooms/", label: "Rooms" },
  { href: "/map/", label: "Map" },
  { href: "/memories/", label: "Memories" },
  { href: "/faq/", label: "FAQ" },
]
