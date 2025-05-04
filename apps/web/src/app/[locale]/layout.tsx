import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "@/styles/globals.css"

import { ThemeProvider } from "@tokodaim/ui"

import { TRPCReactProvider } from "@/lib/trpc/react"
import { appEnv, siteTitle, siteUrl, xUsername } from "@/lib/utils/env"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(
    appEnv === "production" ? siteUrl : "http://localhost:3000",
  ),
  title: "Panel",
  description: "Tokodaim Panel",
  openGraph: {
    title: "Panel",
    description: "Tokodaim Panel",
    url: siteUrl,
    siteName: siteTitle,
  },
  twitter: {
    card: "summary_large_image",
    site: xUsername,
    creator: xUsername,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
