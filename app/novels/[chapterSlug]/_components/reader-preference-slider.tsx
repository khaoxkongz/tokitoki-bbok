"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

interface ReaderPreferenceSliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  disabled?: boolean
  onValueChange: (value: number) => void
}

function getDecimalPlaces(value: number): number {
  const valueString = String(value)
  const decimalIndex = valueString.indexOf(".")

  return decimalIndex === -1 ? 0 : valueString.length - decimalIndex - 1
}

function roundToStep(value: number, step: number): number {
  const decimalPlaces = getDecimalPlaces(step)

  return Number(value.toFixed(decimalPlaces))
}

export function ReaderPreferenceSlider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  disabled = false,
  onValueChange,
}: ReaderPreferenceSliderProps) {
  const inputId = React.useId()

  const updateValue = (nextValue: number) => {
    const clampedValue = Math.min(Math.max(nextValue, min), max)

    onValueChange(roundToStep(clampedValue, step))
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </label>

        <output
          htmlFor={inputId}
          className="min-w-16 rounded-md bg-muted px-2 py-1 text-center text-sm tabular-nums"
        >
          {value}
          {suffix}
        </output>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={disabled || value <= min}
          aria-label={`ลด${label}`}
          onClick={() => updateValue(value - step)}
        >
          <span aria-hidden="true">−</span>
        </Button>

        <input
          id={inputId}
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-label={label}
          onChange={(event) => updateValue(event.currentTarget.valueAsNumber)}
          className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary disabled:cursor-not-allowed disabled:opacity-50"
        />

        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={disabled || value >= max}
          aria-label={`เพิ่ม${label}`}
          onClick={() => updateValue(value + step)}
        >
          <span aria-hidden="true">+</span>
        </Button>
      </div>

      <div
        className="flex justify-between text-xs text-muted-foreground"
        aria-hidden="true"
      >
        <span>
          {min}
          {suffix}
        </span>

        <span>
          {max}
          {suffix}
        </span>
      </div>
    </div>
  )
}
