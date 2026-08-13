import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ScrollProgress } from "@/components/ui/scroll-progress"
import { getChapterNavigation } from "@/features/novel/chapter-navigation"
import { getAllChapters } from "@/features/novel/chapter-repository.server"
import { novelInfo } from "@/features/novel/config"
import type { ChapterPickerItem } from "@/features/novel/types"

import { ChapterNavigation } from "./_components/chapter-navigation"
import { NovelFooterCard } from "./_components/novel-footer-card"
import { ReaderInteractions } from "./_components/reader-interactions.client"
import { ReadingArticle } from "./_components/reading-article"
import { getChapterComponent } from "@/content/novels/registry"

interface PageProps {
  params: Promise<{ chapterSlug: string }>
}

export function generateStaticParams() {
  return getAllChapters({ sort: "asc" }).map((chapter) => ({
    chapterSlug: chapter.slug,
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { chapterSlug } = await params
  const chapters = getAllChapters({ sort: "asc" })
  const navigation = getChapterNavigation(chapterSlug, chapters)

  if (!navigation) {
    return {
      title: `ไม่พบตอน | ${novelInfo.title}`,
    }
  }

  const chapter = navigation.current
  const chapterTitle = `ตอนที่ ${chapter.episode}: ${chapter.title}`
  const description =
    chapter.description ?? `อ่าน${chapterTitle} จากเรื่อง ${novelInfo.title}`

  return {
    title: `${chapterTitle} | ${novelInfo.title}`,
    description,
    openGraph: {
      title: `${chapterTitle} | ${novelInfo.title}`,
      description,
      type: "article",
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { chapterSlug } = await params
  const chapters = getAllChapters({ sort: "asc" })
  const navigation = getChapterNavigation(chapterSlug, chapters)

  if (!navigation) {
    notFound()
  }

  const Post = await getChapterComponent(chapterSlug)

  if (!Post) {
    notFound()
  }

  const chapterPickerItems: ChapterPickerItem[] = chapters.map(
    ({ slug, episode, title }) => ({
      slug,
      episode,
      title,
    })
  )

  return (
    <div className="min-h-screen bg-[oklch(0.2964_0.0036_106.61)] p-4">
      <ReaderInteractions
        chapters={chapterPickerItems}
        currentChapter={navigation.current}
        previousChapter={navigation.previous}
        nextChapter={navigation.next}
      >
        <ReadingArticle>
          <Post />
        </ReadingArticle>
      </ReaderInteractions>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 md:w-[95%] md:px-0">
        <ChapterNavigation
          previousChapter={navigation.previous}
          nextChapter={navigation.next}
        />
        <NovelFooterCard
          currentChapter={navigation.current}
          isLatestChapter={navigation.next === null}
        />
      </div>

      <ScrollProgress />
    </div>
  )
}
