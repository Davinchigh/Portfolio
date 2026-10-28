import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import ScrollToTop from "@/components/scroll-to-top"
import CursorEffect from "@/components/cursor-effect"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Benedict Frimpong Boateng | SAP Consultant & Instructional Designer",
  description: "SAP S/4HANA Cloud consultant, e-learning developer and Statistics with Computer Science student based in Accra, Ghana. Open to work.",
  openGraph: { title: "Benedict Frimpong Boateng | SAP Consultant & Instructional Designer", description: "SAP S/4HANA Cloud consultant, e-learning developer and Statistics with Computer Science student based in Accra, Ghana. Open to work." },
  twitter: { card: "summary", title: "Benedict Frimpong Boateng | SAP Consultant & Instructional Designer", description: "SAP S/4HANA Cloud consultant, e-learning developer and Statistics with Computer Science student based in Accra, Ghana. Open to work." },
  generator: "v0.app",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className={`${inter.className} antialiased`}><ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange><ScrollToTop /><CursorEffect /><Navbar />{children}<Footer /></ThemeProvider></body></html>
}
