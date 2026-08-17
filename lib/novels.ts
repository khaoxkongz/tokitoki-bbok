import "server-only"

import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

import {
  sortNovels,
  type NovelMeta,
  type NovelSortOrder,
} from "./novels.shared"

export type { NovelMeta, NovelSortOrder } from "./novels.shared"

const contentDirectory = path.join(process.cwd(), "content/novels")

interface NovelNavigation {
  current: NovelMeta
  previous: NovelMeta | null
  next: NovelMeta | null
}

function getOptionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined
}

function readNovel(filename: string): NovelMeta {
  const slug = filename.replace(/\.md?$/, "")
  const filePath = path.join(contentDirectory, filename)
  const fileContent = fs.readFileSync(filePath, "utf8")

  const { data } = matter(fileContent)

  return {
    slug,
    title: getOptionalString(data.title) ?? `ตอนที่ ${slug}`,
    description: getOptionalString(data.description),
    episode: String(data.episode ?? slug),
    published: getOptionalString(data.published),
  }
}

export function getAllNovels({
  sort = "asc",
}: {
  sort?: NovelSortOrder
} = {}): NovelMeta[] {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  const novels = fs
    .readdirSync(contentDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .map(readNovel)

  return sortNovels(novels, sort)
}

export function getNovelBySlug(
  slug: string,
  novels: readonly NovelMeta[] = getAllNovels()
): NovelMeta | null {
  return novels.find((novel) => novel.slug === slug) ?? null
}

export function getNovelNavigation(
  slug: string,
  novels: readonly NovelMeta[] = getAllNovels({ sort: "asc" })
): NovelNavigation | null {
  const orderedNovels = sortNovels(novels, "asc")
  const currentIndex = orderedNovels.findIndex((novel) => novel.slug === slug)

  if (currentIndex === -1) {
    return null
  }

  return {
    current: orderedNovels[currentIndex],
    previous: orderedNovels[currentIndex - 1] ?? null,
    next: orderedNovels[currentIndex + 1] ?? null,
  }
}
