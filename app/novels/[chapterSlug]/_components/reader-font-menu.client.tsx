"use client"

import * as React from "react"
import { CheckIcon, TypeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DEFAULT_READER_FONT,
  isReaderFontId,
  READER_FONT_EVENT,
  READER_FONT_STORAGE_KEY,
  READER_FONTS,
  type ReaderFontId,
} from "@/features/reader-preferences/reader-fonts"

function getCurrentReaderFont(): ReaderFontId {
  if (typeof document === "undefined") {
    return DEFAULT_READER_FONT
  }

  const currentFont = document.documentElement.dataset.readerFont

  return isReaderFontId(currentFont) ? currentFont : DEFAULT_READER_FONT
}

function applyReaderFont(font: ReaderFontId) {
  document.documentElement.dataset.readerFont = font

  try {
    window.localStorage.setItem(READER_FONT_STORAGE_KEY, font)
  } catch {
    /*
     * localStorage อาจใช้ไม่ได้ใน private mode
     * หรือถูก browser policy ปิดไว้
     * แต่การเปลี่ยนฟอนต์ใน session ปัจจุบันยังทำงานได้
     */
  }

  window.dispatchEvent(
    new CustomEvent<ReaderFontId>(READER_FONT_EVENT, {
      detail: font,
    })
  )
}

export function ReaderFontMenu() {
  const [selectedFont, setSelectedFont] =
    React.useState<ReaderFontId>(DEFAULT_READER_FONT)

  React.useEffect(() => {
    setSelectedFont(getCurrentReaderFont())

    const handleFontChange = (event: Event) => {
      const customEvent = event as CustomEvent<ReaderFontId>

      if (isReaderFontId(customEvent.detail)) {
        setSelectedFont(customEvent.detail)
      }
    }

    window.addEventListener(READER_FONT_EVENT, handleFontChange)

    return () => {
      window.removeEventListener(READER_FONT_EVENT, handleFontChange)
    }
  }, [])

  const currentFont =
    READER_FONTS.find((font) => font.id === selectedFont) ?? READER_FONTS[0]

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            size="icon-lg"
            variant="secondary"
            aria-label={`เปลี่ยนฟอนต์ ปัจจุบันใช้ ${currentFont.label}`}
          />
        }
      >
        <TypeIcon />
      </PopoverTrigger>

      <PopoverContent side="bottom" align="end" className="w-72 p-2">
        <div className="px-2 py-1.5">
          <p className="font-medium">ฟอนต์สำหรับอ่านนิยาย</p>
          <p className="text-sm text-muted-foreground">
            ระบบจะจำฟอนต์ที่เลือกไว้บนอุปกรณ์นี้
          </p>
        </div>

        <div
          className="mt-1 grid gap-1"
          role="radiogroup"
          aria-label="เลือกฟอนต์สำหรับอ่านนิยาย"
        >
          {READER_FONTS.map((font) => {
            const isSelected = font.id === selectedFont

            return (
              <button
                key={font.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => {
                  applyReaderFont(font.id)
                  setSelectedFont(font.id)
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <span className="min-w-0 flex-1">
                  <span
                    className="block font-medium"
                    style={{
                      fontFamily: getFontPreviewFamily(font.id),
                    }}
                  >
                    {font.label}
                  </span>

                  <span className="block text-sm text-muted-foreground">
                    {font.description}
                  </span>

                  <span
                    className="mt-1 block truncate text-base"
                    style={{
                      fontFamily: getFontPreviewFamily(font.id),
                    }}
                  >
                    เมื่อการเดินทางครั้งใหม่เริ่มต้น
                  </span>
                </span>

                <span className="flex size-5 shrink-0 items-center justify-center">
                  {isSelected ? <CheckIcon className="size-4" /> : null}
                </span>
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function getFontPreviewFamily(font: ReaderFontId): string {
  switch (font) {
    case "arundina-serif":
      return "var(--font-arundina-serif-local), serif"

    case "arundina-sans":
      return "var(--font-arundina-sans-local), sans-serif"

    case "arundina-mono":
      return "var(--font-arundina-mono-local), monospace"

    case "cordia":
      return "var(--font-cordia-local), sans-serif"

    case "geist":
      return "var(--font-geist-sans), var(--font-arundina-sans-local), sans-serif"
  }
}
