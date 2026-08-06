import { sortChapters } from "./chapter-sort"
import type { ChapterMeta, ChapterNavigation } from "./types"

export function getChapterNavigation(
  chapterSlug: string,
  chapters: readonly ChapterMeta[]
): ChapterNavigation | null {
  const orderedChapters = sortChapters(chapters, "asc")
  const currentIndex = orderedChapters.findIndex(
    (chapter) => chapter.slug === chapterSlug
  )

  if (currentIndex === -1) {
    return null
  }

  return {
    current: orderedChapters[currentIndex],
    previous: orderedChapters[currentIndex - 1] ?? null,
    next: orderedChapters[currentIndex + 1] ?? null,
  }
}
