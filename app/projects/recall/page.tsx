import type { Metadata } from "next"
import { Notes, ProjectPage } from "@/components/projects/project-page"
import { RecallDemo } from "@/components/projects/recall-demo"
import { corpus } from "@/lib/recall/corpus"
import { evaluate } from "@/lib/recall/eval"

export const metadata: Metadata = {
  title: "Recall, a search engine for this site | Benedict Frimpong Boateng",
  description: "Ask this portfolio a question and get the passage that answers it. A BM25 search engine built from scratch, with its evaluation score shown live.",
}

export default function RecallPage() {
  const docs = corpus()
  // Scored at build time against the same code the page runs, so the numbers below cannot drift.
  const score = evaluate(docs)
  const percent = (n: number) => `${Math.round((n / score.questions) * 100)}%`

  return (
    <ProjectPage
      eyebrow="project, search and evaluation"
      title="recall"
      intro="ask this portfolio a question and get the passage that answers it, with its source. it is the retrieval half of a rag system, built from scratch, with no language model: every answer is text that exists on this site."
      code="https://github.com/Davinchigh/Portfolio/tree/main/lib/recall"
    >
      <section className="mt-12" aria-label="Live demo">
        <RecallDemo docs={docs} />
      </section>

      <section className="mt-20" aria-labelledby="score-title">
        <p className="eyebrow">how well does it work</p>
        <h2 id="score-title" className="mt-3 text-3xl sm:text-[2.6rem] sm:leading-[1.05]">
          measured, not claimed
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {score.questions} questions a visitor might ask, each with the passage that should answer it. the score is recomputed every time the
          site is built.
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 border-y py-10 sm:grid-cols-4">
          {[
            { value: percent(score.top1), label: `right answer first (${score.top1} of ${score.questions})` },
            { value: percent(score.top3), label: `right answer in the top three (${score.top3} of ${score.questions})` },
            { value: score.mrr.toFixed(2), label: "mean reciprocal rank, where 1.00 is perfect" },
            { value: String(docs.length), label: "passages indexed from this site" },
          ].map((s) => (
            <div key={s.label}>
              <dd className="text-4xl font-medium tabular-nums tracking-tight sm:text-5xl">{s.value}</dd>
              <dt className="mt-2 text-sm text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>
        {score.misses.length > 0 && (
          <div className="mt-8 max-w-2xl">
            <p className="eyebrow">where it still gets it wrong</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {score.misses.map((m) => (
                <li key={m.question}>
                  <span className="text-foreground">&ldquo;{m.question}&rdquo;</span> does not reach the right passage in the top three.
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <Notes
        items={[
          {
            title: "ranking with bm25",
            body: "each passage is scored by how often it uses your words, how rare those words are across the site, and how long the passage is. words in a title count three times.",
          },
          {
            title: "matching how people ask",
            body: "a small stemmer makes 'tested' find 'testing', and a synonym table lets 'managed people' reach 'led a team'. typed words always outweigh their synonyms.",
          },
          {
            title: "an evaluation set keeps it honest",
            body: "every change to the ranking is checked against the same questions. two fixes came straight from its misses: indexing each project's context, and teaching the stemmer irregular verbs.",
          },
        ]}
      />
    </ProjectPage>
  )
}
