import { HouseIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { novelInfo } from "@/features/novel/config"
import type { ChapterMeta } from "@/features/novel/types"

interface NovelFooterCardProps {
  currentChapter: ChapterMeta
  isLatestChapter: boolean
}

export function NovelFooterCard({
  currentChapter,
  isLatestChapter,
}: NovelFooterCardProps) {
  return (
    <aside className="mt-6 rounded-xl border border-[oklch(0.9816_0.0026_106.45/10%)] bg-[oklch(0.499_0.0031_106.51/25%)] p-4 sm:p-5">
      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:text-left">
        <Link href="/novels" className="shrink-0">
          <img
            src={novelInfo.coverImage}
            alt={`ปกนิยาย ${novelInfo.title}`}
            className="aspect-[2/3] w-20 rounded-lg object-cover object-top shadow-2xl"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col items-center md:items-start">
          <p className="mb-1 text-sm font-medium text-[#913FE2]">
            {isLatestChapter ? "คุณอ่านถึงตอนล่าสุดแล้ว" : "อ่านตอนนี้จบแล้ว"}
          </p>
          <Link href="/novels" className="block">
            <p className="text-base leading-snug font-bold text-white transition-colors hover:text-[#913FE2]">
              {novelInfo.title}
            </p>
          </Link>
          <p className="mt-0.5 mb-4 text-xs text-white/40">
            ตอนที่ {currentChapter.episode}: {currentChapter.title}
          </p>

          <Button
            type="button"
            size="lg"
            variant="outline"
            className="px-8 py-3"
            nativeButton={false}
            render={<Link href="/novels" />}
          >
            <HouseIcon />
            <span>กลับไปหน้ารวมตอน</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}
