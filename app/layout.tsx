import type React from "react"
import type { Metadata } from "next"
import "./sehatlink.css"
import { LanguageProvider } from "@/contexts/language-context"

export const metadata: Metadata = {
  title: "SehatLink - Rural Health Platform",
  description: "AI-powered healthcare platform for rural communities",
  generator: "SehatLink",
  manifest: "/manifest.json",
  themeColor: "#2c5aa0",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SehatLink",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "SehatLink",
    title: "SehatLink - Rural Health Platform",
    description: "AI-powered healthcare platform for rural communities",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#2c5aa0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SehatLink" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2c5aa0" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
