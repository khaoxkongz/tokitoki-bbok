import type { ChapterMeta } from "./types"

function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase("th")
}

export function matchesChapterQuery(
  chapter: ChapterMeta,
  rawQuery: string
): boolean {
  const query = normalizeSearchText(rawQuery)

  if (!query) {
    return true
  }

  const searchableValues = [
    chapter.episode,
    `ตอนที่ ${chapter.episode}`,
    chapter.slug,
    chapter.title,
    chapter.description ?? "",
    chapter.published ?? "",
  ]

  return searchableValues.some((value) =>
    normalizeSearchText(value).includes(query)
  )
}
