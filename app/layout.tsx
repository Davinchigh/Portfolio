import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Banner, Footer, Header } from "@/components/chrome"

const description =
  "An unofficial, fan-made guide to Jean Nelson Aka Hall at the University of Ghana, Legon. History, hall life, rooms and memories, made by a former resident."

export const metadata: Metadata = {
  title: { default: "Jean Nelson Aka Hall | An unofficial guide", template: "%s | Jean Nelson Aka Hall (unofficial)" },
  description,
  openGraph: { title: "Jean Nelson Aka Hall: an unofficial guide", description, type: "website" },
  icons: { icon: "/icon.svg" },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { themeColor: "#14112B" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GH">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-lamp focus:px-4 focus:py-2 focus:font-bold focus:text-night"
        >
          Skip to content
        </a>
        <Banner />
        <Header />
        <main id="main" className="on-paper">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
