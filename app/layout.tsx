import type { Metadata, Viewport } from "next"
import "./globals.css"
import { BagProvider } from "@/components/bag"
import { Footer, Header, WhatsAppFab } from "@/components/chrome"
import { Concierge } from "@/components/concierge"
import { Curtain, INTRO_SCRIPT } from "@/components/curtain"
import { Motion } from "@/components/motion"
import { shop } from "@/lib/store"

const description = "Men's and women's clothing, bags and shoes, handcrafted in Accra. Order on WhatsApp with delivery across Ghana and worldwide."

export const metadata: Metadata = {
  metadataBase: new URL(`https://${shop.domain}`),
  title: { default: `${shop.name} | Men's and women's fashion in Accra`, template: `%s | ${shop.name}` },
  description,
  openGraph: { title: shop.name, description, type: "website", images: ["/brand/og.jpg"] },
  icons: { icon: "/brand/icon.svg" },
}

export const viewport: Viewport = { themeColor: "#0D0C0B" }

const store = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: shop.name,
  telephone: shop.phoneDisplay,
  url: `https://${shop.domain}`,
  address: { "@type": "PostalAddress", addressLocality: "Accra", addressCountry: "GH" },
  sameAs: [`https://instagram.com/${shop.instagram}`],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GH" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-onyx">
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(store) }} />
        <BagProvider>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">{children}</main>
          <Footer />
          <WhatsAppFab />
          <Concierge />
          <Motion />
          <Curtain />
        </BagProvider>
      </body>
    </html>
  )
}
