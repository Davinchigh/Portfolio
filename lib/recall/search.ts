/**
 * Recall: a small search engine. BM25 ranking over short passages, with light stemming,
 * a synonym table for query expansion and extra weight for words in a passage's title.
 * It is the retrieval half of a RAG system, with no model in the loop: every answer is a
 * passage that exists, shown with where it came from.
 */

export type Doc = {
  id: string
  /** What kind of thing this is: role, project, certificate and so on. */
  kind: string
  title: string
  text: string
  href: string
}

const STOP = new Set(
  "a an the and or but if so to of in on at for from by with is are was were be been am i me my we our you your he she his her him it its this that these those as do does did have has had not no can could would should will just what which who whom when where how why any some there about into than then also tell show give know".split(
    " ",
  ),
)

/** "manage" and "managed" should meet: both end up as "manag". */
function dropE(word: string) { return (word.length > 4 && word.endsWith("e") ? word.slice(0, -1) : word) }

const IRREGULAR: Record<string, string> = { taught: "teach", led: "lead", built: "build", wrote: "write", written: "write", ran: "run", made: "make" }

/** Words that should find each other. Each group is expanded in both directions. */
const SYNONYM_GROUPS = [
  ["job", "role", "work", "position", "employment", "career", "experience"],
  ["ai", "llm", "claude", "prompt", "gpt", "machine", "ml"],
  ["test", "qa", "quality", "defect", "bug"],
  ["lead", "manage", "led", "leadership", "manager", "team"],
  ["teach", "train", "course", "learning", "lesson", "tutor", "education"],
  ["database", "sql", "mysql", "postgres", "odoo", "data"],
  ["design", "ui", "ux", "figma", "brand", "logo"],
  ["certificate", "certification", "certified", "qualification", "credential"],
  ["school", "university", "degree", "study", "legon", "education"],
  ["automation", "automate", "workflow", "pipeline"],
  ["game", "card", "zero"],
  ["contact", "email", "reach", "hire", "available", "availability"],
  ["frontend", "react", "typescript", "javascript", "next"],
  ["backend", "api", "fastapi", "server", "python", "java"],
  ["forecast", "statistics", "analysis", "series", "model"],
  ["search", "retrieval", "rag", "bm25"],
  ["shop", "store", "supermarket", "retail", "stock", "inventory"],
  ["sap", "erp", "consultant", "consulting"],
  ["volunteer", "community", "youth", "church"],
]

const SYNONYMS = new Map<string, string[]>()
for (const group of SYNONYM_GROUPS) {
  const stems = group.map(stem)
  for (const word of stems) SYNONYMS.set(word, [...new Set([...(SYNONYMS.get(word) ?? []), ...stems.filter((w) => w !== word)])])
}

/** A deliberately small stemmer: enough to match "tested", "testing" and "tests". */
export function stem(word: string): string {
  if (IRREGULAR[word]) return IRREGULAR[word]
  if (word.length <= 3) return word
  for (const [suffix, replacement] of [
    ["ies", "y"],
    ["ing", ""],
    ["ed", ""],
    ["es", ""],
    ["s", ""],
  ] as const) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) return dropE(word.slice(0, -suffix.length) + replacement)
  }
  return dropE(word)
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#. ]+/g, " ")
    .split(/[\s.]+/)
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem)
}

export type Index = {
  docs: Doc[]
  /** Term frequencies per document. */
  frequencies: Map<string, number>[]
  lengths: number[]
  averageLength: number
  /** How many documents contain each term. */
  documentFrequency: Map<string, number>
}

const TITLE_WEIGHT = 3

export function buildIndex(docs: Doc[]): Index {
  const frequencies: Index["frequencies"] = []
  const lengths: number[] = []
  const documentFrequency = new Map<string, number>()
  for (const doc of docs) {
    const terms = [...Array(TITLE_WEIGHT).fill(tokenize(doc.title)).flat(), ...tokenize(`${doc.kind} ${doc.text}`)] as string[]
    const tf = new Map<string, number>()
    for (const term of terms) tf.set(term, (tf.get(term) ?? 0) + 1)
    for (const term of tf.keys()) documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1)
    frequencies.push(tf)
    lengths.push(terms.length)
  }
  const averageLength = lengths.reduce((a, b) => a + b, 0) / Math.max(1, lengths.length)
  return { docs, frequencies, lengths, averageLength, documentFrequency }
}

export type Hit = {
  doc: Doc
  score: number
  /** The sentence in the passage that matches the question best. */
  snippet: string
  /** Query terms (stemmed) found in the passage, for highlighting. */
  matched: string[]
}

const K1 = 1.4
const B = 0.75
/** Expanded terms count for less than the words actually typed. */
const SYNONYM_WEIGHT = 0.35

export function search(index: Index, query: string, limit = 3): Hit[] {
  const typed = [...new Set(tokenize(query))]
  if (typed.length === 0) return []
  const weights = new Map<string, number>(typed.map((t) => [t, 1]))
  for (const term of typed) for (const other of SYNONYMS.get(term) ?? []) if (!weights.has(other)) weights.set(other, SYNONYM_WEIGHT)

  const n = index.docs.length
  const hits: Hit[] = []
  index.docs.forEach((doc, i) => {
    let score = 0
    const matched: string[] = []
    for (const [term, weight] of weights) {
      const tf = index.frequencies[i].get(term)
      if (!tf) continue
      const df = index.documentFrequency.get(term) ?? 0
      const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5))
      score += weight * idf * ((tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * index.lengths[i]) / index.averageLength)))
      matched.push(term)
    }
    if (score > 0) hits.push({ doc, score, matched, snippet: bestSentence(doc.text, weights) })
  })
  return hits.sort((a, b) => b.score - a.score).slice(0, limit)
}

function bestSentence(text: string, weights: Map<string, number>): string {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean)
  let best = sentences[0] ?? text
  let bestScore = -1
  for (const sentence of sentences) {
    const terms = new Set(tokenize(sentence))
    let score = 0
    for (const [term, weight] of weights) if (terms.has(term)) score += weight
    if (score > bestScore) {
      bestScore = score
      best = sentence
    }
  }
  return best
}

/** Splits text into pieces, marking the words that match the query so a UI can highlight them. */
export function highlight(text: string, matched: string[]): { text: string; hit: boolean }[] {
  const terms = new Set(matched)
  return text
    .split(/(\s+)/)
    .map((piece) => ({ text: piece, hit: tokenize(piece).some((t) => terms.has(t)) }))
}
