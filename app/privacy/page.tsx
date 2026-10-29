import type { Metadata } from "next"
import { person } from "@/lib/site"

export const metadata: Metadata = {
  title: "Privacy | Benedict Frimpong Boateng",
  description: "What this site does with your data, in plain words.",
}

const updated = "28 October 2026"

export default function PrivacyPage() {
  return (
    <main className="wrap max-w-2xl pb-24 pt-28 sm:pt-32">
      <p className="eyebrow">privacy</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">what this site does with your data</h1>
      <p className="meta mt-3">last updated {updated}</p>

      <div className="mt-10 space-y-8 leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-medium text-foreground">the short version</h2>
          <p className="mt-2">
            No accounts, no cookies, no ads and no tracking. I don&apos;t store anything about you. The only personal thing
            this site touches is a rough idea of where you are, so the globe can say hello. It&apos;s shown to you and then
            forgotten.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">the globe</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              My host, Vercel, works out an approximate city and country from your IP address when your browser asks for the
              page. My code only ever sees that city, country and rough coordinates (rounded to about 10 km), never your IP
              address.
            </li>
            <li>That location is sent back to your browser only. It isn&apos;t saved, logged or shared with anyone.</li>
            <li>Your local time comes from your own browser&apos;s time zone setting. It never leaves your device.</li>
            <li>
              The temperature shown is for Accra only, from{" "}
              <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="link">
                Open-Meteo
              </a>{" "}
              (weather data licensed under CC BY 4.0). None of your details are sent to them.
            </li>
            <li>If you use a VPN, the globe will show wherever the VPN says you are. That&apos;s fine.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">remembering how you read</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              If you pick &quot;i&apos;m hiring&quot; or &quot;just looking around&quot;, your browser keeps that choice (in local
              storage, not a cookie) so the page opens the same way next time. It never leaves your device, and clearing
              your browser data removes it.
            </li>
            <li>
              Your theme choice (dark or light) is remembered the same way.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">hosting logs</h2>
          <p className="mt-2">
            Like any website, Vercel keeps short-lived server logs (for example, IP addresses and pages requested) to keep the
            site running and secure. That&apos;s covered by{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="link">
              Vercel&apos;s privacy policy
            </a>
            . I don&apos;t use those logs to identify visitors.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">why this is allowed</h2>
          <p className="mt-2">
            Showing you a friendly, personalised greeting is a legitimate interest that has very little impact on you, because
            nothing is kept. If you&apos;re in the EU or UK that&apos;s the lawful basis under the GDPR. In Ghana, this site
            follows the principles of the Data Protection Act, 2012 (Act 843).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">emailing me</h2>
          <p className="mt-2">
            If you email me, I&apos;ll have your name, email address and whatever you write. I only use it to reply, and
            I&apos;ll delete it if you ask.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">questions or requests</h2>
          <p className="mt-2">
            Write to{" "}
            <a href={`mailto:${person.email}`} className="link">
              {person.email}
            </a>
            . You can ask what I hold about you (almost certainly nothing) or ask me to delete it.
          </p>
        </section>
      </div>
    </main>
  )
}
