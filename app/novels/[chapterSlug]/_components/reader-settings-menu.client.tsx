"use client"

import * as React from "react"
import {
  AlignJustifyIcon,
  AlignLeftIcon,
  CheckIcon,
  RotateCcwIcon,
  Settings2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  applyReaderPreferences,
  DEFAULT_READER_PREFERENCES,
  readReaderPreferences,
  READER_FONTS,
  READER_PREFERENCES_EVENT,
  type ReaderFontId,
  type ReaderPreferences,
  type ReaderTextAlign,
} from "@/features/reader-preferences/reader-preferences"

import { ReaderPreferenceSlider } from "./reader-preference-slider"

export function ReaderSettingsMenu() {
  const [preferences, setPreferences] = React.useState<ReaderPreferences>(
    DEFAULT_READER_PREFERENCES
  )

  /*
   * โหลดค่าที่ผู้ใช้เคยเลือกจาก localStorage
   * หลัง Client Component mount แล้ว
   */
  React.useEffect(() => {
    const savedPreferences = readReaderPreferences()

    setPreferences(savedPreferences)

    applyReaderPreferences(savedPreferences, {
      persist: false,
    })

    const handlePreferencesChange = (event: Event) => {
      const customEvent = event as CustomEvent<ReaderPreferences>

      if (customEvent.detail) {
        setPreferences(customEvent.detail)
      }
    }

    window.addEventListener(READER_PREFERENCES_EVENT, handlePreferencesChange)

    return () => {
      window.removeEventListener(
        READER_PREFERENCES_EVENT,
        handlePreferencesChange
      )
    }
  }, [])

  /*
   * ใช้ฟังก์ชันนี้กับ slider, font selector
   * และ text alignment ทุกตัว
   */
  const updatePreferences = (update: Partial<ReaderPreferences>) => {
    setPreferences((currentPreferences) => {
      const nextPreferences: ReaderPreferences = {
        ...currentPreferences,
        ...update,
      }

      /*
       * เปลี่ยน CSS variables และบันทึก localStorage
       */
      applyReaderPreferences(nextPreferences)

      return nextPreferences
    })
  }

  /*
   * คืนค่าทุกอย่างกลับเป็นค่าเริ่มต้น
   */
  const resetPreferences = () => {
    applyReaderPreferences(DEFAULT_READER_PREFERENCES)

    setPreferences({
      ...DEFAULT_READER_PREFERENCES,
    })
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            size="icon-lg"
            variant="secondary"
            aria-label="ตั้งค่าการอ่าน"
          />
        }
      >
        <Settings2Icon />
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        className="w-[min(22rem,calc(100vw-2rem))] p-0"
      >
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <p className="font-semibold">ตั้งค่าการอ่าน</p>

            <p className="text-sm text-muted-foreground">
              ปรับรูปแบบตัวอักษรและพื้นที่อ่าน
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={resetPreferences}
          >
            <RotateCcwIcon />
            <span>คืนค่า</span>
          </Button>
        </div>

        <div className="max-h-[min(70vh,42rem)] space-y-6 overflow-y-auto p-4">
          <FontSelector
            value={preferences.font}
            onValueChange={(font) => {
              updatePreferences({ font })
            }}
          />

          <div className="space-y-5 border-t pt-5">
            <ReaderPreferenceSlider
              label="ขนาดตัวอักษร"
              value={preferences.fontSize}
              min={18}
              max={42}
              step={1}
              suffix="px"
              onValueChange={(fontSize) => {
                updatePreferences({ fontSize })
              }}
            />

            <ReaderPreferenceSlider
              label="ระยะห่างระหว่างบรรทัด"
              value={preferences.lineHeight}
              min={1.2}
              max={2.2}
              step={0.05}
              onValueChange={(lineHeight) => {
                updatePreferences({ lineHeight })
              }}
            />

            <ReaderPreferenceSlider
              label="ความกว้างพื้นที่อ่าน"
              value={preferences.contentWidth}
              min={45}
              max={100}
              step={5}
              suffix="ch"
              onValueChange={(contentWidth) => {
                updatePreferences({ contentWidth })
              }}
            />

            <ReaderPreferenceSlider
              label="ระยะห่างระหว่างย่อหน้า"
              value={preferences.paragraphSpacing}
              min={0.5}
              max={2.5}
              step={0.05}
              suffix="em"
              onValueChange={(paragraphSpacing) => {
                updatePreferences({
                  paragraphSpacing,
                })
              }}
            />

            <ReaderPreferenceSlider
              label="ระยะห่างตัวอักษร"
              value={preferences.letterSpacing}
              min={-0.03}
              max={0.12}
              step={0.01}
              suffix="em"
              onValueChange={(letterSpacing) => {
                updatePreferences({
                  letterSpacing,
                })
              }}
            />
          </div>

          <TextAlignmentSelector
            value={preferences.textAlign}
            onValueChange={(textAlign) => {
              updatePreferences({ textAlign })
            }}
          />

          <ReaderPreview preferences={preferences} />
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface FontSelectorProps {
  value: ReaderFontId
  onValueChange: (font: ReaderFontId) => void
}

function FontSelector({ value, onValueChange }: FontSelectorProps) {
  return (
    <section>
      <p className="mb-2 text-sm font-medium">รูปแบบตัวอักษร</p>

      <div className="grid gap-1" role="radiogroup" aria-label="เลือกฟอนต์">
        {READER_FONTS.map((font) => {
          const isSelected = font.id === value

          return (
            <button
              key={font.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => {
                onValueChange(font.id)
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="min-w-0 flex-1">
                <span
                  className="block text-base font-medium"
                  style={{
                    fontFamily: getFontPreviewFamily(font.id),
                  }}
                >
                  {font.label}
                </span>

                <span
                  className="mt-0.5 block truncate text-muted-foreground"
                  style={{
                    fontFamily: getFontPreviewFamily(font.id),
                  }}
                >
                  การเดินทางครั้งใหม่กำลังเริ่มต้น
                </span>
              </span>

              <span className="flex size-5 shrink-0 items-center justify-center">
                {isSelected ? <CheckIcon className="size-4" /> : null}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

interface TextAlignmentSelectorProps {
  value: ReaderTextAlign
  onValueChange: (textAlign: ReaderTextAlign) => void
}

function TextAlignmentSelector({
  value,
  onValueChange,
}: TextAlignmentSelectorProps) {
  return (
    <section className="border-t pt-5">
      <p className="mb-2 text-sm font-medium">การจัดแนวข้อความ</p>

      <div
        className="grid grid-cols-2 gap-2"
        role="radiogroup"
        aria-label="การจัดแนวข้อความ"
      >
        <Button
          type="button"
          variant={value === "left" ? "default" : "outline"}
          role="radio"
          aria-checked={value === "left"}
          onClick={() => {
            onValueChange("left")
          }}
        >
          <AlignLeftIcon />
          <span>ชิดซ้าย</span>
        </Button>

        <Button
          type="button"
          variant={value === "justify" ? "default" : "outline"}
          role="radio"
          aria-checked={value === "justify"}
          onClick={() => {
            onValueChange("justify")
          }}
        >
          <AlignJustifyIcon />
          <span>เต็มบรรทัด</span>
        </Button>
      </div>
    </section>
  )
}

interface ReaderPreviewProps {
  preferences: ReaderPreferences
}

function ReaderPreview({ preferences }: ReaderPreviewProps) {
  return (
    <section className="border-t pt-5">
      <p className="mb-2 text-sm font-medium">ตัวอย่าง</p>

      <div
        className="rounded-lg border bg-muted/40 p-4"
        style={{
          fontFamily: getFontPreviewFamily(preferences.font),
          fontSize: `${Math.min(preferences.fontSize, 30)}px`,
          lineHeight: preferences.lineHeight,
          letterSpacing: `${preferences.letterSpacing}em`,
          textAlign: preferences.textAlign,
        }}
      >
        เมื่อประตูของเขาวงกตเปิดออก การเดินทางที่ไม่มีใครคาดคิดก็เริ่มต้นขึ้น
      </div>
    </section>
  )
}

function getFontPreviewFamily(font: ReaderFontId): string {
  switch (font) {
    case "arundina-serif":
      return [
        "var(--font-arundina-serif-local)",
        "var(--font-arundina-sans-local)",
        "serif",
      ].join(", ")

    case "arundina-sans":
      return ["var(--font-arundina-sans-local)", "sans-serif"].join(", ")

    case "arundina-mono":
      return ["var(--font-arundina-mono-local)", "monospace"].join(", ")

    case "cordia":
      return [
        "var(--font-cordia-local)",
        "var(--font-arundina-sans-local)",
        "sans-serif",
      ].join(", ")

    case "geist":
      return [
        "var(--font-geist-sans)",
        "var(--font-arundina-sans-local)",
        "sans-serif",
      ].join(", ")
  }
}
