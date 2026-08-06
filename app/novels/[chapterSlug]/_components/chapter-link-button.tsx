import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import type { ChapterMeta } from "@/features/novel/types"

interface ChapterLinkButtonProps {
  chapter: ChapterMeta | null
  direction: "previous" | "next"
  className?: string
}

export function ChapterLinkButton({
  chapter,
  direction,
  className,
}: ChapterLinkButtonProps) {
  const isPrevious = direction === "previous"
  const label = isPrevious ? "ตอนก่อนหน้า" : "ตอนถัดไป"

  if (!chapter) {
    return (
      <Button type="button" size="lg" disabled className={className}>
        {isPrevious ? <ChevronLeftIcon /> : null}
        <span>{label}</span>
        {!isPrevious ? <ChevronRightIcon /> : null}
      </Button>
    )
  }

  return (
    <Button
      type="button"
      size="lg"
      nativeButton={false}
      render={<Link prefetch={true} href={`/novels/${chapter.slug}`} />}
      className={className}
      aria-label={`${label}: ตอนที่ ${chapter.episode} ${chapter.title}`}
    >
      {isPrevious ? <ChevronLeftIcon /> : null}
      <span>{label}</span>
      {!isPrevious ? <ChevronRightIcon /> : null}
    </Button>
  )
}
