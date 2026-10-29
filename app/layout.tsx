import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "@fontsource-variable/caveat"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { VisitorProvider } from "@/lib/visitor"

const title = "Benedict Frimpong Boateng | AI engineer and software developer"
const description =
  "AI engineer, prompt engineer and software developer in Accra, Ghana. I build with Claude, test things properly and ship fast. Open to full time and freelance work."

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary", title, description },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#f4f3ef" },
  ],
}

const visitorScript = `try{var f=new URLSearchParams(location.search).get("for");var s=localStorage.getItem("bfb-visitor");if((f&&/^[a-z0-9][a-z0-9-]{0,31}$/i.test(f.trim()))||s==="recruiter"||s==="explorer")document.documentElement.setAttribute("data-visitor","")}catch(e){}`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: visitorScript }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
          >
            skip to content
          </a>
          <VisitorProvider>
          <Navbar />
          <div id="main">{children}</div>
          <Footer />
          </VisitorProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
