import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"

import { ThemeProvider } from "@tokodaim/ui"

import { env } from "@/env"
import TRPCReactProvider from "@/lib/trpc/react"

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
    env.APP_ENV === "production"
      ? env.NEXT_PUBLIC_SITE_URL
      : "http://localhost:3000",
  ),
  title: "Dashboard",
  description: "Tokodaim Dashboard",
  openGraph: {
    title: "Dashboard",
    description: "Tokodaim Dashboard",
    url: env.NEXT_PUBLIC_SITE_URL,
    siteName: env.NEXT_PUBLIC_SITE_TITLE,
  },
  twitter: {
    card: "summary_large_image",
    site: env.NEXT_PUBLIC_X_USERNAME,
    creator: env.NEXT_PUBLIC_X_USERNAME,
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
