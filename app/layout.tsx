import { Geist, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"

import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import {
  DEFAULT_READER_FONT,
  READER_FONT_STORAGE_KEY,
  READER_FONTS,
} from "@/features/reader-preferences/reader-fonts"

import "./globals.css"

const arundinaSans = localFont({
  src: [
    {
      path: "./fonts/Arundina.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Arundinab.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Arundinao.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/Arundinabo.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-arundina-sans-local",
  display: "swap",
})

const arundinaMono = localFont({
  src: [
    {
      path: "./fonts/Arundinamono.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Arundinamobd.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Arundinamoit.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/Arundinamobi.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-arundina-mono-local",
  display: "swap",
})

const arundinaSerif = localFont({
  src: [
    {
      path: "./fonts/ArunSer.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/ArunSerB.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-arundina-serif-local",
  display: "swap",
})

const cordiaSans = localFont({
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

const allowedReaderFonts = READER_FONTS.map((font) => font.id)

const readerFontBootstrapScript = `
(() => {
  const storageKey = ${JSON.stringify(READER_FONT_STORAGE_KEY)};
  const fallbackFont = ${JSON.stringify(DEFAULT_READER_FONT)};
  const allowedFonts = new Set(
    ${JSON.stringify(allowedReaderFonts)}
  );

  try {
    const savedFont = window.localStorage.getItem(storageKey);

    document.documentElement.dataset.readerFont =
      savedFont && allowedFonts.has(savedFont)
        ? savedFont
        : fallbackFont;
  } catch {
    document.documentElement.dataset.readerFont =
      fallbackFont;
  }
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const fontVariables = [
    arundinaSans.variable,
    arundinaMono.variable,
    arundinaSerif.variable,
    cordiaSans.variable,
    fontSans.variable,
    fontMono.variable,
  ].join(" ")

  return (
    <html
      lang="th"
      suppressHydrationWarning
      data-reader-font={DEFAULT_READER_FONT}
      className={cn(fontVariables, "antialiased", "font-sans")}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: readerFontBootstrapScript,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col bg-[oklch(0.2964_0.0036_106.61)]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
