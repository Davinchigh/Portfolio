import type { Metadata } from "next"
import { PageHead, Ph, Section } from "@/components/ui"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Privacy",
  description: "This site has no cookies, no tracking and no forms.",
}

export default function PrivacyPage() {
  return (
    <>
      <PageHead eyebrow="Privacy" title="Short and simple" />
      <Section title="What this site collects" id="collect">
        <p>Nothing. There are no cookies, no analytics, no ads, no accounts and no forms.</p>
        <p>
          The site is a set of plain web pages. The company hosting it may keep standard server logs, like any website,
          to keep it running.
        </p>
      </Section>
      <Section title="When you share a memory" id="share">
        <p>
          The share buttons open your own WhatsApp or email app. If you choose to send a message, it goes straight to the
          site's maker, {site.maker}, and is only used to add your story to the site with your permission.
        </p>
        <p>
          Want your story or your details removed? Email <Ph value={site.email} /> and it will be done.
        </p>
      </Section>
      <Section title="Links to other sites" id="links">
        <p>
          We link to University of Ghana pages and news sites. Once you're there, their own privacy policies apply.
        </p>
      </Section>
    </>
  )
}
