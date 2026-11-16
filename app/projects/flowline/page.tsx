import type { Metadata } from "next"
import { FlowlineDemo } from "@/components/projects/flowline-demo"
import { Notes, ProjectPage } from "@/components/projects/project-page"

export const metadata: Metadata = {
  title: "Flowline, a workflow engine | Benedict Frimpong Boateng",
  description: "A small TypeScript workflow engine with retries, parallel steps and a live run view. Triage a support message or an invoice in your browser.",
}

export default function FlowlinePage() {
  return (
    <ProjectPage
      eyebrow="project, workflow automation"
      title="flowline"
      intro="a workflow engine you can watch work. give it a customer message or an invoice and it runs each step in order, retries what fails, skips what no longer applies and shows you why."
      code="https://github.com/Davinchigh/Portfolio/tree/main/lib/flowline"
    >
      <section className="mt-12" aria-label="Live demo">
        <FlowlineDemo />
      </section>
      <Notes
        items={[
          {
            title: "steps declare what they need",
            body: "the engine works out the order from those dependencies and runs independent steps at the same time. in the support workflow, classifying and extracting happen together.",
          },
          {
            title: "failure is part of the design",
            body: "a step can retry with exponential backoff. if it still fails, everything that depends on it is skipped and says so, while unrelated steps carry on. try the invoice whose totals do not add up.",
          },
          {
            title: "every decision is explained",
            body: "the classifier shows the words that decided it, the priority score lists its reasons, and anything the model is unsure about goes to a person instead of a team queue.",
          },
        ]}
      />
    </ProjectPage>
  )
}
