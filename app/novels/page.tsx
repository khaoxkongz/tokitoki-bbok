import type { Metadata } from "next"

import { getAllChapters } from "@/features/novel/chapter-repository.server"
import { novelInfo } from "@/features/novel/config"

import { ChapterBrowser } from "./_components/chapter-browser.client"
import { CoverPreview } from "./_components/cover-preview.client"
import { NovelSummary } from "./_components/novel-summary"

export const metadata: Metadata = {
  title: `รายการตอน | ${novelInfo.title}`,
  description: `รายชื่อตอนทั้งหมดของ ${novelInfo.title}`,
}

export default function Page() {
  const chapters = getAllChapters({ sort: "desc" })

  return (
    <main className="relative z-10 mx-auto mb-5 w-full max-w-6xl rounded-xl bg-[oklch(0.2964_0.0036_106.61)] px-3 pt-0 md:mb-7 md:w-[95%] lg:px-0 lg:pt-8">
      <div className="lg:flex lg:gap-9">
        <CoverPreview />

        <div className="mt-3 w-full lg:mt-0">
          <NovelSummary />
          <ChapterBrowser chapters={chapters} />
        </div>
      </div>
    </main>
  )
}
