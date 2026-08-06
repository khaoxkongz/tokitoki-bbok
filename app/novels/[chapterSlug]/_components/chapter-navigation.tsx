import type { ChapterMeta } from "@/features/novel/types"

import { ChapterLinkButton } from "./chapter-link-button"

interface ChapterNavigationProps {
  previousChapter: ChapterMeta | null
  nextChapter: ChapterMeta | null
}

export function ChapterNavigation({
  previousChapter,
  nextChapter,
}: ChapterNavigationProps) {
  return (
    <nav
      className="flex items-center justify-between gap-4"
      aria-label="นำทางท้ายตอน"
    >
      <ChapterLinkButton
        chapter={previousChapter}
        direction="previous"
        className="max-w-[160px] flex-1"
      />
      <ChapterLinkButton
        chapter={nextChapter}
        direction="next"
        className="max-w-[160px] flex-1"
      />
    </nav>
  )
}
