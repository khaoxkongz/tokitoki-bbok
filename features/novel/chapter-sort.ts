import type { ChapterMeta, ChapterSortOrder } from "./types"

const naturalCollator = new Intl.Collator("th", {
  numeric: true,
  sensitivity: "base",
})

export function compareChapters(
  first: ChapterMeta,
  second: ChapterMeta,
  sortOrder: ChapterSortOrder = "asc"
): number {
  const episodeComparison = naturalCollator.compare(
    first.episode,
    second.episode
  )
  const slugComparison = naturalCollator.compare(first.slug, second.slug)
  const comparison = episodeComparison || slugComparison

  return sortOrder === "asc" ? comparison : -comparison
}

export function sortChapters(
  chapters: readonly ChapterMeta[],
  sortOrder: ChapterSortOrder = "asc"
): ChapterMeta[] {
  return [...chapters].sort((first, second) =>
    compareChapters(first, second, sortOrder)
  )
}
