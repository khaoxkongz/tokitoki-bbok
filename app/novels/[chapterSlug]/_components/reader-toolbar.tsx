import { CircleAlertIcon, HouseIcon, MessageCircleMoreIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { novelInfo } from "@/features/novel/config"
import type { ChapterMeta } from "@/features/novel/types"
import { cn } from "@/lib/utils"
import { ReaderSettingsMenu } from "./reader-settings-menu.client"

interface ReaderToolbarProps {
  visible: boolean
  currentChapter: ChapterMeta
}

export function ReaderToolbar({ visible, currentChapter }: ReaderToolbarProps) {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 border-b border-zinc-800/50 bg-zinc-900/95 pt-[env(safe-area-inset-top)] backdrop-blur-sm transition-[transform,opacity,visibility] ease-(--motion-ease-out) motion-reduce:transform-none motion-reduce:transition-[opacity,visibility] motion-reduce:duration-(--motion-duration-reduced)",
        visible
          ? "visible translate-y-0 opacity-100 duration-(--motion-duration-control-enter)"
          : "invisible -translate-y-full opacity-0 duration-(--motion-duration-control-exit)"
      )}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3 py-4 md:w-[95%] md:px-0">
        <div className="mr-3 flex shrink-0 items-center justify-start">
          <Button
            type="button"
            nativeButton={false}
            size="icon-lg"
            variant="secondary"
            render={<Link href="/novels" />}
            aria-label="กลับไปหน้ารวมตอน"
          >
            <HouseIcon className="h-6 w-6 text-zinc-300" />
          </Button>
        </div>

        <Link
          href="/novels"
          className="-m-1 flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg p-1 transition-[background-color,transform] duration-(--motion-duration-press) ease-(--motion-ease-out) hover:bg-zinc-800/50 active:scale-[0.97] motion-reduce:transform-none"
        >
          <div className="w-10 min-w-10 shrink-0">
            <img
              src={novelInfo.coverImage}
              alt=""
              className="w-full rounded-lg object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="truncate [font-family:var(--font-line-seed-sans-th-local)] text-sm text-zinc-400">
              {novelInfo.title}
            </div>
            <div className="truncate font-semibold text-zinc-400">
              <span className="[font-family:var(--font-line-seed-sans-th-local)] text-zinc-100">
                ตอน {currentChapter.episode}
              </span>
              <span className="[font-family:var(--font-arundina-sans-local)] text-2xl font-normal">
                {" - "}
                {currentChapter.title}
              </span>
            </div>
          </div>
        </Link>

        <div className="ml-3 flex shrink-0 items-center justify-end gap-2">
          <ReaderSettingsMenu />
          <Button
            type="button"
            size="icon-lg"
            variant="secondary"
            className="transition-colors hover:bg-amber-600/20 hover:text-amber-400"
            aria-label="รายงานปัญหา"
          >
            <CircleAlertIcon />
          </Button>
          <Button
            type="button"
            size="icon-lg"
            variant="secondary"
            aria-label="ดูความคิดเห็น"
          >
            <MessageCircleMoreIcon />
          </Button>
        </div>
      </div>
    </header>
  )
}
