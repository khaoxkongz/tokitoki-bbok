export type ChapterSortOrder = "asc" | "desc"

export interface NovelInfo {
  title: string
  description: string
  coverImage: string
}

export interface ChapterMeta {
  slug: string
  title: string
  episode: string
  description?: string
  published?: string
}

export interface ChapterNavigation {
  current: ChapterMeta
  previous: ChapterMeta | null
  next: ChapterMeta | null
}

export type ChapterPickerItem = Pick<ChapterMeta, "slug" | "episode" | "title">
