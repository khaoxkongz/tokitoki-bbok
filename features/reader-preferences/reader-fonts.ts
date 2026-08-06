export const READER_FONT_STORAGE_KEY = "novelia:reader-font"

export const READER_FONT_EVENT = "novelia:reader-font-change"

export const DEFAULT_READER_FONT = "arundina-serif" as const

export const READER_FONTS = [
  {
    id: "arundina-serif",
    label: "Arundina Serif",
    description: "ตัวอักษรมีเชิง เหมาะกับการอ่านนิยาย",
  },
  {
    id: "arundina-sans",
    label: "Arundina Sans",
    description: "อ่านง่าย รูปทรงเรียบสะอาด",
  },
  {
    id: "cordia",
    label: "Cordia New",
    description: "ตัวอักษรไทยแบบดั้งเดิม",
  },
  {
    id: "arundina-mono",
    label: "Arundina Mono",
    description: "ระยะตัวอักษรเท่ากัน",
  },
  {
    id: "geist",
    label: "Geist",
    description: "ฟอนต์หลักของเว็บไซต์",
  },
] as const

export type ReaderFontId = (typeof READER_FONTS)[number]["id"]

const readerFontIds = new Set<string>(READER_FONTS.map((font) => font.id))

export function isReaderFontId(value: unknown): value is ReaderFontId {
  return typeof value === "string" && readerFontIds.has(value)
}
