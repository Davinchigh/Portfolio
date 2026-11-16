/**
 * A multinomial naive Bayes text classifier with Laplace smoothing.
 * Small on purpose: it trains in a millisecond in the browser, and every prediction can be
 * explained by the words that pushed it there.
 */

const STOP = new Set(
  "a an the and or but if then so to of in on at for from by with is are was were be been am i me my we our you your it its this that these those as do does did have has had not no can could would should will just".split(
    " ",
  ),
)

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9₵$ ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w))
}

export type Example = { text: string; label: string }

export type Model = {
  labels: string[]
  vocabulary: number
  /** Number of training examples per label. */
  docs: Record<string, number>
  /** Total word count per label. */
  totals: Record<string, number>
  counts: Record<string, Record<string, number>>
  examples: number
}

export function train(examples: Example[]): Model {
  const docs: Model["docs"] = {}
  const totals: Model["totals"] = {}
  const counts: Model["counts"] = {}
  const vocabulary = new Set<string>()
  for (const { text, label } of examples) {
    docs[label] = (docs[label] ?? 0) + 1
    counts[label] ??= {}
    for (const word of tokenize(text)) {
      vocabulary.add(word)
      counts[label][word] = (counts[label][word] ?? 0) + 1
      totals[label] = (totals[label] ?? 0) + 1
    }
  }
  return { labels: Object.keys(docs).sort(), vocabulary: vocabulary.size, docs, totals, counts, examples: examples.length }
}

export type Prediction = {
  label: string
  /** Probability of the winning label, 0 to 1. */
  confidence: number
  scores: { label: string; probability: number }[]
  /** The words that argued hardest for the winning label over the runner-up. */
  evidence: string[]
}

export function predict(model: Model, text: string): Prediction {
  const words = tokenize(text)
  const logWord = (label: string, word: string) =>
    Math.log(((model.counts[label]?.[word] ?? 0) + 1) / ((model.totals[label] ?? 0) + model.vocabulary))

  const logs = model.labels.map((label) => {
    let score = Math.log(model.docs[label] / model.examples)
    for (const word of words) score += logWord(label, word)
    return { label, score }
  })
  // Softmax over the log scores, shifted by the max so it cannot overflow.
  const max = Math.max(...logs.map((l) => l.score))
  const sum = logs.reduce((total, l) => total + Math.exp(l.score - max), 0)
  const scores = logs
    .map((l) => ({ label: l.label, probability: Math.exp(l.score - max) / sum }))
    .sort((a, b) => b.probability - a.probability)

  const [best, second] = scores
  const evidence = [...new Set(words)]
    .map((word) => ({ word, pull: second ? logWord(best.label, word) - logWord(second.label, word) : 0 }))
    .filter((w) => w.pull > 0.4)
    .sort((a, b) => b.pull - a.pull)
    .slice(0, 4)
    .map((w) => w.word)

  return { label: best.label, confidence: best.probability, scores, evidence }
}

/** Share of examples the model labels correctly. */
export function accuracy(model: Model, examples: Example[]): number {
  if (examples.length === 0) return 0
  return examples.filter((e) => predict(model, e.text).label === e.label).length / examples.length
}
