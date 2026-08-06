"use client"

import * as React from "react"

import type { ChapterMeta, ChapterPickerItem } from "@/features/novel/types"
import { cn } from "@/lib/utils"

import { ReaderBottomControls } from "./reader-bottom-controls"
import { ReaderToolbar } from "./reader-toolbar"

interface ScrollFadeState {
  top: boolean
  bottom: boolean
}

interface ReaderInteractionsProps {
  chapters: ChapterPickerItem[]
  currentChapter: ChapterMeta
  previousChapter: ChapterMeta | null
  nextChapter: ChapterMeta | null
  children: React.ReactNode
}

function useScrollFade(): ScrollFadeState {
  const [scrollFade, setScrollFade] = React.useState<ScrollFadeState>({
    top: false,
    bottom: false,
  })

  React.useEffect(() => {
    const updateScrollFade = () => {
      const scrollTop = window.scrollY
      const maxScrollTop = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0
      )
      const nextScrollFade = {
        top: scrollTop > 1,
        bottom: scrollTop < maxScrollTop - 1,
      }

      setScrollFade((currentScrollFade) =>
        currentScrollFade.top === nextScrollFade.top &&
        currentScrollFade.bottom === nextScrollFade.bottom
          ? currentScrollFade
          : nextScrollFade
      )
    }

    updateScrollFade()
    window.addEventListener("scroll", updateScrollFade, { passive: true })
    window.addEventListener("resize", updateScrollFade)

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateScrollFade)

    resizeObserver?.observe(document.documentElement)

    return () => {
      window.removeEventListener("scroll", updateScrollFade)
      window.removeEventListener("resize", updateScrollFade)
      resizeObserver?.disconnect()
    }
  }, [])

  return scrollFade
}

export function ReaderInteractions({
  chapters,
  currentChapter,
  previousChapter,
  nextChapter,
  children,
}: Readonly<ReaderInteractionsProps>) {
  const [controlsVisible, setControlsVisible] = React.useState(false)
  const scrollFade = useScrollFade()

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setControlsVisible(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleReaderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target

    if (
      target instanceof Element &&
      target.closest(
        "a, button, input, textarea, select, summary, [role='button']"
      )
    ) {
      return
    }

    const selection = window.getSelection()

    if (selection && !selection.isCollapsed) {
      return
    }

    setControlsVisible((isVisible) => !isVisible)
  }

  return (
    <React.Fragment>
      <ReaderToolbar
        visible={controlsVisible}
        currentChapter={currentChapter}
      />

      <ReaderBottomControls
        visible={controlsVisible}
        chapters={chapters}
        currentChapter={currentChapter}
        previousChapter={previousChapter}
        nextChapter={nextChapter}
      />

      <div onClick={handleReaderClick} className="select-none">
        {children}
      </div>

      <div
        className={cn(
          "pointer-events-none fixed top-0 right-0 left-0 z-10 h-[25vh] bg-linear-to-b from-[oklch(0.2964_0.0036_106.61)] transition-opacity",
          scrollFade.top ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "pointer-events-none fixed right-0 bottom-0 left-0 z-10 h-[25vh] bg-linear-to-t from-[oklch(0.2964_0.0036_106.61)] transition-opacity",
          scrollFade.bottom ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />
    </React.Fragment>
  )
}
