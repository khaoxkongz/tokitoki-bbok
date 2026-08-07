import { Geist, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"

import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import {
  DEFAULT_READER_PREFERENCES,
  READER_FONTS,
  READER_PREFERENCES_STORAGE_KEY,
} from "@/features/reader-preferences/reader-preferences"

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
const defaultReaderPreferences = DEFAULT_READER_PREFERENCES

/*
 * ใส่ค่า preferences ลง html ก่อน React hydrate
 * เพื่อไม่ให้กระพริบกลับค่า default และให้ CSS variables ใช้งานได้ทันที
 */
const readerPreferencesBootstrapScript = `
(() => {
  const storageKey = ${JSON.stringify(READER_PREFERENCES_STORAGE_KEY)};
  const defaults = ${JSON.stringify(defaultReaderPreferences)};
  const allowedFonts = new Set(${JSON.stringify(allowedReaderFonts)});
  const root = document.documentElement;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const normalize = (value) => {
    if (!value || typeof value !== "object") {
      return defaults;
    }

    return {
      font:
        typeof value.font === "string" && allowedFonts.has(value.font)
          ? value.font
          : defaults.font,
      fontSize:
        typeof value.fontSize === "number"
          ? clamp(value.fontSize, 18, 42)
          : defaults.fontSize,
      lineHeight:
        typeof value.lineHeight === "number"
          ? clamp(value.lineHeight, 1.2, 2.2)
          : defaults.lineHeight,
      contentWidth:
        typeof value.contentWidth === "number"
          ? clamp(value.contentWidth, 45, 100)
          : defaults.contentWidth,
      paragraphSpacing:
        typeof value.paragraphSpacing === "number"
          ? clamp(value.paragraphSpacing, 0.5, 2.5)
          : defaults.paragraphSpacing,
      letterSpacing:
        typeof value.letterSpacing === "number"
          ? clamp(value.letterSpacing, -0.03, 0.12)
          : defaults.letterSpacing,
      textAlign: value.textAlign === "justify" ? "justify" : "left",
    };
  };

  const apply = (preferences) => {
    root.dataset.readerFont = preferences.font;
    root.dataset.readerAlign = preferences.textAlign;
    root.style.setProperty("--reader-font-size", preferences.fontSize + "px");
    root.style.setProperty("--reader-line-height", String(preferences.lineHeight));
    root.style.setProperty("--reader-content-width", preferences.contentWidth + "ch");
    root.style.setProperty(
      "--reader-paragraph-spacing",
      preferences.paragraphSpacing + "em"
    );
    root.style.setProperty(
      "--reader-letter-spacing",
      preferences.letterSpacing + "em"
    );
  };

  try {
    const savedValue = window.localStorage.getItem(storageKey);
    apply(savedValue ? normalize(JSON.parse(savedValue)) : defaults);
  } catch {
    apply(defaults);
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
      data-reader-font={DEFAULT_READER_PREFERENCES.font}
      data-reader-align={DEFAULT_READER_PREFERENCES.textAlign}
      className={cn(fontVariables, "antialiased", "font-sans")}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: readerPreferencesBootstrapScript,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col bg-[oklch(0.2964_0.0036_106.61)]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
