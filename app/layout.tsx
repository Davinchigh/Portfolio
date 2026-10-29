import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Glee Garden | Gardening in your home, made joyful",
  description: "Landscape design, lawn care and planting for homes in Accra. A concept brand and website by Benedict Frimpong Boateng.",
  icons: { icon: "/icon.svg" },
  openGraph: { title: "Glee Garden", description: "Gardening in your home, made joyful.", images: ["/img/hero.webp"] },
}
export const viewport: Viewport = { themeColor: "#F7F2E8" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GH">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-cream">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
