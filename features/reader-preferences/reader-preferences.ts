export const READER_PREFERENCES_STORAGE_KEY = "novelia:reader-preferences"

export const READER_PREFERENCES_EVENT = "novelia:reader-preferences-change"

export const READER_FONTS = [
  {
    id: "arundina-serif",
    label: "Arundina Serif",
  },
  {
    id: "arundina-sans",
    label: "Arundina Sans",
  },
  {
    id: "cordia",
    label: "Cordia New",
  },
  {
    id: "arundina-mono",
    label: "Arundina Mono",
  },
  {
    id: "geist",
    label: "Geist",
  },
] as const

export type ReaderFontId = (typeof READER_FONTS)[number]["id"]

export type ReaderTextAlign = "left" | "justify"

export interface ReaderPreferences {
  font: ReaderFontId
  fontSize: number
  lineHeight: number
  contentWidth: number
  paragraphSpacing: number
  letterSpacing: number
  textAlign: ReaderTextAlign
}

export const DEFAULT_READER_PREFERENCES: ReaderPreferences = {
  font: "arundina-serif",
  fontSize: 28,
  lineHeight: 1.55,
  contentWidth: 75,
  paragraphSpacing: 1.25,
  letterSpacing: 0,
  textAlign: "left",
}

const readerFontIds = new Set<string>(READER_FONTS.map((font) => font.id))

export function isReaderFontId(value: unknown): value is ReaderFontId {
  return typeof value === "string" && readerFontIds.has(value)
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum)
}

export function normalizeReaderPreferences(value: unknown): ReaderPreferences {
  if (!value || typeof value !== "object") {
    return DEFAULT_READER_PREFERENCES
  }

  const preferences = value as Partial<ReaderPreferences>

  return {
    font: isReaderFontId(preferences.font)
      ? preferences.font
      : DEFAULT_READER_PREFERENCES.font,

    fontSize:
      typeof preferences.fontSize === "number"
        ? clamp(preferences.fontSize, 18, 42)
        : DEFAULT_READER_PREFERENCES.fontSize,

    lineHeight:
      typeof preferences.lineHeight === "number"
        ? clamp(preferences.lineHeight, 1.2, 2.2)
        : DEFAULT_READER_PREFERENCES.lineHeight,

    contentWidth:
      typeof preferences.contentWidth === "number"
        ? clamp(preferences.contentWidth, 45, 100)
        : DEFAULT_READER_PREFERENCES.contentWidth,

    paragraphSpacing:
      typeof preferences.paragraphSpacing === "number"
        ? clamp(preferences.paragraphSpacing, 0.5, 2.5)
        : DEFAULT_READER_PREFERENCES.paragraphSpacing,

    letterSpacing:
      typeof preferences.letterSpacing === "number"
        ? clamp(preferences.letterSpacing, -0.03, 0.12)
        : DEFAULT_READER_PREFERENCES.letterSpacing,

    textAlign: preferences.textAlign === "justify" ? "justify" : "left",
  }
}

export function readReaderPreferences(): ReaderPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_READER_PREFERENCES
  }

  try {
    const savedValue = window.localStorage.getItem(
      READER_PREFERENCES_STORAGE_KEY
    )

    if (!savedValue) {
      return DEFAULT_READER_PREFERENCES
    }

    return normalizeReaderPreferences(JSON.parse(savedValue))
  } catch {
    return DEFAULT_READER_PREFERENCES
  }
}

export function applyReaderPreferences(
  preferences: ReaderPreferences,
  options: {
    persist?: boolean
  } = {}
): void {
  const normalized = normalizeReaderPreferences(preferences)

  const root = document.documentElement

  root.dataset.readerFont = normalized.font
  root.dataset.readerAlign = normalized.textAlign

  root.style.setProperty("--reader-font-size", `${normalized.fontSize}px`)

  root.style.setProperty("--reader-line-height", String(normalized.lineHeight))

  root.style.setProperty(
    "--reader-content-width",
    `${normalized.contentWidth}ch`
  )

  root.style.setProperty(
    "--reader-paragraph-spacing",
    `${normalized.paragraphSpacing}em`
  )

  root.style.setProperty(
    "--reader-letter-spacing",
    `${normalized.letterSpacing}em`
  )

  if (options.persist !== false) {
    try {
      window.localStorage.setItem(
        READER_PREFERENCES_STORAGE_KEY,
        JSON.stringify(normalized)
      )
    } catch {
      // ยังเปลี่ยนค่าใน session ปัจจุบันได้
    }
  }

  window.dispatchEvent(
    new CustomEvent<ReaderPreferences>(READER_PREFERENCES_EVENT, {
      detail: normalized,
    })
  )
}
