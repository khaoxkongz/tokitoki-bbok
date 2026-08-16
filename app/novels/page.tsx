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
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="relative">
          {/* Background Banner (Desktop only) */}
          <div className="absolute inset-0 -z-1 hidden overflow-hidden lg:block">
            <img
              src="/surviving-the-game-as-a-barbarian.42375c.webp"
              alt="Surviving The Game as a Barbarian"
              className="pointer-events-none h-full w-full origin-top scale-110 object-cover object-top opacity-30 blur-[8px] select-none"
            />
            {/* Fades into the page background (oklch(0.2964_0.0036_106.61)), matching the novel banner. */}
            <div className="absolute inset-0 bg-linear-to-b from-[oklch(0.2964_0.0036_106.61)]/60 via-[oklch(0.2964_0.0036_106.61)]/80 to-[oklch(0.2964_0.0036_106.61)]"></div>
          </div>
          {/* Mobile Cover Section with full overlay */}
          <div className="relative flex h-[300px] items-center justify-center pt-4 lg:hidden">
            {/* Background blur overlay for mobile - extends below */}
            <div className="absolute inset-x-0 top-0 -z-10 h-[500px] overflow-hidden">
              <img
                src="/surviving-the-game-as-a-barbarian.42375c.webp"
                alt=""
                aria-hidden={true}
                className="pointer-events-none h-full w-full scale-105 object-cover blur-[4px] select-none"
              />
              <div className="absolute inset-0 bg-[oklch(0.2964_0.0036_106.61)]/50"></div>
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent via-40% to-[oklch(0.2964_0.0036_106.61)]"></div>
            </div>
            {/* Centered cover */}
            <div className="relative aspect-[2/3] w-[180px] cursor-pointer overflow-hidden rounded-lg shadow-2xl">
              <img
                src="/surviving-the-game-as-a-barbarian.099c67.jpg"
                alt="Surviving The Game as a Barbarian"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          {/* Content */}
          <div className="relative z-10 mx-auto mb-5 w-full max-w-6xl rounded-xl px-3 pt-0 md:mb-7 md:w-[95%] lg:px-0 lg:pt-8">
            <div className="lg:flex lg:gap-9">
              <CoverPreview />

              <div className="mt-3 w-full lg:mt-0">
                <NovelSummary />
                <ChapterBrowser chapters={chapters} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
