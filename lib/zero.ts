/**
 * ZERO, The Architect's Edition. An original card game by Benedict Frimpong Boateng.
 */

export type Tag = "psychology" | "information" | "power" | "punishment" | "chaos"

export const zeroStats = [
  { value: "7", label: "max players" },
  { value: "12", label: "laws" },
  { value: "6", label: "special cards" },
  { value: "4", label: "wild types" },
  { value: "3", label: "token tiers" },
]

export const philosophy =
  "Most shedding card games are luck disguised as skill. ZERO strips away the disguise. Information asymmetry is weaponised. Alliances are permitted, and punished. Every act of cooperation leaves a debt. Every act of aggression leaves a scar. The winner is not the fastest, nor the luckiest, but the one who made everyone else believe they had a chance."

/**
 * Teaser only. The full rule text stays private until the name is cleared and the trademark is filed.
 * One line per law: enough to show the design, not enough to play.
 */
export const phases: { title: string; tag: string; rules: { n: string; name: string; line: string; tag: Tag }[] }[] = [
  {
    title: "Setup",
    tag: "before the first card",
    rules: [
      { n: "01", name: "The Silent Auction", line: "What you give up at the start comes back to haunt you.", tag: "psychology" },
      { n: "02", name: "The Seating Tribunal", line: "Where you sit is earned, not random.", tag: "information" },
      { n: "03", name: "The Open Ledger", line: "Everyone's influence is on show. Poverty and power are both visible.", tag: "power" },
    ],
  },
  {
    title: "Core laws",
    tag: "during play",
    rules: [
      { n: "04", name: "The Debt Clause", line: "Every favour creates a debt, and debts get called in at the worst moment.", tag: "psychology" },
      { n: "05", name: "The Silence Tax", line: "Talking out of turn costs you. One player is exempt.", tag: "punishment" },
      { n: "06", name: "The Veto", line: "The table can band together to stop a player who's about to win.", tag: "chaos" },
      { n: "07", name: "The Dossier", line: "Influence can buy a look at the future.", tag: "information" },
      { n: "08", name: "The Kingmaker Clause", line: "Being knocked out doesn't mean you stop playing.", tag: "power" },
      { n: "09", name: "The Confession", line: "After every round, the table names who manipulated it most.", tag: "psychology" },
    ],
  },
  {
    title: "Victory",
    tag: "how it ends",
    rules: [
      { n: "10", name: "Standard Victory", line: "Empty your hand, and don't forget to say the word.", tag: "power" },
      { n: "11", name: "The Phantom Victory", line: "A secret path to winning that plays out across sessions.", tag: "information" },
      { n: "12", name: "The Architect's Exemption", line: "Win enough and you get to rewrite the rules.", tag: "psychology" },
    ],
  },
]

export type ZeroCard = { symbol: string; name: string; effect: string; tone: "gold" | "crimson" | "ice" | "violet" | "void" }

/** The six Ω instruments. Two of each are added to a standard deck. */
export const specials: ZeroCard[] = [
  { symbol: "⚖", name: "Equilibrium", effect: "Every hand is made equal to the largest in play. The leader's advantage is erased.", tone: "gold" },
  { symbol: "†", name: "Sacrifice", effect: "Avoid any effect aimed at you and pass it to a player of your choice. Draw 1 as the cost.", tone: "crimson" },
  { symbol: "◈", name: "Mirror", effect: "Copy the last special card played and aim it at a new target. Plays on any colour.", tone: "ice" },
  { symbol: "⊘", name: "Nullify", effect: "Cancel the card played just before this one. It never happened, and that player loses their turn.", tone: "void" },
  { symbol: "⟁", name: "Tribunal", effect: "Everyone votes: one player draws 3. A tie goes to the Architect. Plays on any colour.", tone: "violet" },
  { symbol: "∞", name: "Chain", effect: "Play this, then any other card from your hand straight away. Once per hand.", tone: "crimson" },
]

export const wilds: ZeroCard[] = [
  { symbol: "◉", name: "Wild", effect: "Declare any colour. The simplest form of control.", tone: "gold" },
  { symbol: "+4", name: "Wild Draw 4", effect: "Declare a colour. The next player draws 4 and loses their turn.", tone: "gold" },
  { symbol: "Ω", name: "Wild Zero", effect: "Declare any colour and invoke one Ω special card's effect of your choice.", tone: "gold" },
  { symbol: "⚡", name: "Wild Surge", effect: "Declare a colour. Every other player draws 1.", tone: "gold" },
]

export const suits = [
  { name: "Crimson", subtitle: "the crimson directive", color: "#c0392b" },
  { name: "Cold", subtitle: "the cold calculation", color: "#3498db" },
  { name: "Silent", subtitle: "the patient accumulation", color: "#2ecc71" },
  { name: "Gilded", subtitle: "the gilded distraction", color: "#f1c40f" },
]

export const tokenTiers = [
  { name: "Void", tier: "I", value: 1, image: "/images/zero/token-void.webp" },
  { name: "Gold", tier: "II", value: 3, image: "/images/zero/token-gold.webp" },
  { name: "Crimson", tier: "III", value: 5, image: "/images/zero/token-crimson.webp" },
]

export const madeWith = ["game design", "rules writing", "brand identity", "web design", "claude code", "vercel"]
