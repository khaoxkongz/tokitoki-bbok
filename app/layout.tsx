import { Geist, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"

import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

import "./globals.css"

export const cordiaSans = localFont({
  src: [
    {
      path: "./fonts/00-CordiaNew.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/01-CordiaNew-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/02-CordiaNew-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/03-CordiaNew-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-cordia-local",
  display: "swap",
})

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        cordiaSans.variable,
        fontSans.variable,
        fontMono.variable,
        "antialiased",
        "font-sans"
      )}
    >
      <body className="flex min-h-dvh flex-col bg-[oklch(0.2964_0.0036_106.61)]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
