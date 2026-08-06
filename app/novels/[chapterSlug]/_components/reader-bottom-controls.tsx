import { ChevronDownIcon, MenuIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ChapterMeta, ChapterPickerItem } from "@/features/novel/types"
import { cn } from "@/lib/utils"

import { ChapterLinkButton } from "./chapter-link-button"

interface ReaderBottomControlsProps {
  visible: boolean
  chapters: ChapterPickerItem[]
  currentChapter: ChapterMeta
  previousChapter: ChapterMeta | null
  nextChapter: ChapterMeta | null
}

export function ReaderBottomControls({
  visible,
  chapters,
  currentChapter,
  previousChapter,
  nextChapter,
}: ReaderBottomControlsProps) {
  return (
    <nav
      className={cn(
        "fixed right-0 bottom-0 left-0 z-50 border-t border-zinc-800/50 bg-zinc-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm transition-[transform,opacity,visibility] ease-(--motion-ease-out) motion-reduce:transform-none motion-reduce:transition-[opacity,visibility] motion-reduce:duration-(--motion-duration-reduced)",
        visible
          ? "visible translate-y-0 opacity-100 duration-(--motion-duration-control-enter)"
          : "invisible translate-y-full opacity-0 duration-(--motion-duration-control-exit)"
      )}
      aria-label="เมนูนำทางระหว่างตอน"
      aria-hidden={!visible}
    >
      <div className="mx-auto flex w-full max-w-[1285px] items-center justify-between gap-2 px-3 pt-4 pb-6 md:w-[95%] md:px-0">
        <ChapterLinkButton chapter={previousChapter} direction="previous" />

        <div className="relative max-w-xs flex-1">
          <Popover>
            <PopoverTrigger
              render={<Button variant="outline" className="w-full" />}
            >
              <MenuIcon />
              <span>ตอนที่ {currentChapter.episode}</span>
              <ChevronDownIcon />
            </PopoverTrigger>
            <PopoverContent side="top" className="w-xs p-0">
              <ScrollArea className="h-64">
                <div className="flex flex-col items-start">
                  {chapters.map((chapter) => {
                    const isCurrent = chapter.slug === currentChapter.slug

                    return (
                      <Button
                        type="button"
                        variant={isCurrent ? "default" : "ghost"}
                        size="lg"
                        key={chapter.slug}
                        className="w-full justify-start rounded-none"
                        nativeButton={false}
                        render={<Link href={`/novels/${chapter.slug}`} />}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        <span>ตอนที่ {chapter.episode}</span>
                        <span className="truncate text-zinc-500">
                          {" - "}
                          {chapter.title}
                        </span>
                      </Button>
                    )
                  })}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>

        <ChapterLinkButton chapter={nextChapter} direction="next" />
      </div>
    </nav>
  )
}
