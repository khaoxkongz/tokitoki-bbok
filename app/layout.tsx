import { Geist, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"

import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

import "./globals.css"

const cordiaSans = localFont({
  src: "./cordia.ttc",
  variable: "--font-cordia-sans",
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
