export type NovelSortOrder = "asc" | "desc"

export interface NovelMeta {
  slug: string
  title: string
  description?: string
  episode: string
  published?: string
}

const naturalCollator = new Intl.Collator("th", {
  numeric: true,
  sensitivity: "base",
})

export function compareNovels(
  first: NovelMeta,
  second: NovelMeta,
  sortOrder: NovelSortOrder = "asc"
): number {
  const episodeComparison = naturalCollator.compare(
    first.episode,
    second.episode
  )
  const slugComparison = naturalCollator.compare(first.slug, second.slug)
  const comparison = episodeComparison || slugComparison

  return sortOrder === "asc" ? comparison : -comparison
}

export function sortNovels(
  novels: readonly NovelMeta[],
  sortOrder: NovelSortOrder = "asc"
): NovelMeta[] {
  return [...novels].sort((first, second) =>
    compareNovels(first, second, sortOrder)
  )
}

export function matchesNovelQuery(novel: NovelMeta, rawQuery: string): boolean {
  const query = rawQuery.trim().toLocaleLowerCase("th")

  if (!query) {
    return true
  }

  return [novel.episode, novel.slug, novel.title, novel.description ?? ""].some(
    (value) => value.toLocaleLowerCase("th").includes(query)
  )
}
