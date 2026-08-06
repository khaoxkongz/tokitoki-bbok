"use client"

import * as React from "react"
import {
  ArrowDownWideNarrowIcon,
  ArrowUpWideNarrowIcon,
  SearchIcon,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { matchesChapterQuery } from "@/features/novel/chapter-search"
import { sortChapters } from "@/features/novel/chapter-sort"
import type { ChapterMeta, ChapterSortOrder } from "@/features/novel/types"

interface ChapterBrowserProps {
  chapters: ChapterMeta[]
}

export function ChapterBrowser({ chapters }: ChapterBrowserProps) {
  const [query, setQuery] = React.useState("")
  const [sortOrder, setSortOrder] = React.useState<ChapterSortOrder>("desc")

  const visibleChapters = React.useMemo(() => {
    const filteredChapters = chapters.filter((chapter) =>
      matchesChapterQuery(chapter, query)
    )

    return sortChapters(filteredChapters, sortOrder)
  }, [chapters, query, sortOrder])

  const toggleSortOrder = () => {
    setSortOrder((currentOrder) => (currentOrder === "asc" ? "desc" : "asc"))
  }

  return (
    <section className="mt-4 overflow-hidden rounded-lg bg-[oklch(0.499_0.0031_106.51/25%)]">
      <div className="border-b border-white/10 p-4">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">รายการตอน</h2>
            <p className="text-sm text-white/50" aria-live="polite">
              {query.trim()
                ? `พบ ${visibleChapters.length} จาก ${chapters.length} ตอน`
                : `ทั้งหมด ${chapters.length} ตอน`}
            </p>
          </div>

          <Button type="button" size="lg" onClick={toggleSortOrder}>
            {sortOrder === "asc" ? (
              <ArrowDownWideNarrowIcon />
            ) : (
              <ArrowUpWideNarrowIcon />
            )}
            <span>
              {sortOrder === "asc" ? "เรียงจากน้อยไปมาก" : "เรียงจากมากไปน้อย"}
            </span>
          </Button>
        </div>

        <InputGroup className="h-9">
          <InputGroupInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหาตอน ชื่อตอน หรือเลขตอน..."
            aria-label="ค้นหาตอนนิยาย"
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <ScrollArea className="h-[500px]">
        {visibleChapters.length > 0 ? (
          <ul className="grid gap-1">
            {visibleChapters.map((chapter) => (
              <li key={chapter.slug}>
                <Link
                  href={`/novels/${chapter.slug}`}
                  className="group flex cursor-pointer items-center justify-between px-4 py-4 transition-colors hover:bg-input focus-visible:bg-input focus-visible:outline-none"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="block font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                        ตอนที่ {chapter.episode}
                      </span>
                      <span className="block truncate text-sm text-white/50">
                        {chapter.title}
                      </span>
                    </div>

                    {chapter.published ? (
                      <time
                        dateTime={chapter.published}
                        className="ml-3 shrink-0 text-sm text-white/40"
                      >
                        {chapter.published}
                      </time>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid h-full min-h-40 place-items-center px-4 text-center text-sm text-white/50">
            ไม่พบตอนที่ตรงกับ “{query.trim()}”
          </div>
        )}
      </ScrollArea>
    </section>
  )
}
