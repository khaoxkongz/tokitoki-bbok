import "server-only"

import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"
import * as React from "react"

import { sortChapters } from "./chapter-sort"
import type { ChapterMeta, ChapterSortOrder } from "./types"

const contentDirectory = path.join(process.cwd(), "content/novels")

function toOptionalText(value: unknown): string | undefined {
  if (typeof value === "string") {
    const text = value.trim()
    return text || undefined
  }

  if (typeof value === "number") {
    return String(value)
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  return undefined
}

function readChapter(filename: string): ChapterMeta {
  const slug = filename.replace(/\.mdx$/, "")
  const filePath = path.join(contentDirectory, filename)
  const fileContent = fs.readFileSync(filePath, "utf8")
  const { data } = matter(fileContent)

  return {
    slug,
    title: toOptionalText(data.title) ?? `ตอนที่ ${slug}`,
    episode: toOptionalText(data.episode) ?? slug,
    description: toOptionalText(data.description),
    published: toOptionalText(data.published),
  }
}

const readAllChapters = React.cache((): ChapterMeta[] => {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  return fs
    .readdirSync(contentDirectory)
    .filter((filename) => filename.endsWith(".mdx"))
    .map(readChapter)
})

export function getAllChapters({
  sort = "asc",
}: {
  sort?: ChapterSortOrder
} = {}): ChapterMeta[] {
  return sortChapters(readAllChapters(), sort)
}

export function getChapterBySlug(
  chapterSlug: string,
  chapters: readonly ChapterMeta[] = readAllChapters()
): ChapterMeta | null {
  return chapters.find((chapter) => chapter.slug === chapterSlug) ?? null
}
