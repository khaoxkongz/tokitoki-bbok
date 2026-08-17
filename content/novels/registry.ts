import type { ComponentType } from "react"

interface ChapterModule {
  default: ComponentType
}

const chapterModules = import.meta.glob("./*.md")

export async function getChapterComponent(slug: string) {
  const loadModule = chapterModules[`./${slug}.md`]

  if (!loadModule) {
    return null
  }

  const chapterModule = (await loadModule()) as unknown as ChapterModule

  return chapterModule.default
}
