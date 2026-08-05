import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { getAllNovels } from "@/lib/novels"
import { ChevronLeftIcon, ChevronRightIcon, HouseIcon } from "lucide-react"
import { PageClient } from "./page.client"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const novels = getAllNovels()

  return novels.map((novel) => ({
    slug: novel.slug,
  }))
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params

  const novels = getAllNovels()

  let Post: React.ComponentType | null = null
  try {
    const mod = await import(`@/content/novels/${slug}.mdx`)
    Post = mod.default
  } catch {
    notFound()
  }

  if (!Post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[oklch(0.2964_0.0036_106.61)] p-4">
      <PageClient novels={novels} slug={slug}>
        <Post />
      </PageClient>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 md:w-[95%] md:px-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex max-w-[140px] flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-xl bg-[#222222] py-3.5 text-base font-medium text-[#555555] sm:max-w-[160px]">
            <ChevronLeftIcon />
            <span className="leading-none">ตอนก่อนหน้า</span>
          </div>
          <div className="flex max-w-[140px] flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-xl bg-[#222222] py-3.5 text-base font-medium text-[#555555] sm:max-w-[160px]">
            <span className="leading-none">ตอนถัดไป</span>
            <ChevronRightIcon />
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-[oklch(0.9816_0.0026_106.45/10%)] bg-[oklch(0.499_0.0031_106.51/25%)] p-4 sm:p-5">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:text-left">
            <Link href="/" className="flex-shrink-0">
              <img
                src="/Webnovel_First_Cover.webp"
                alt=""
                className="aspect-[2/3] w-20 rounded-lg object-cover object-top shadow-2xl"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col items-center md:items-start">
              <p className="mb-1 text-sm font-medium text-[#913FE2]">
                {"You're all caught up!"}
              </p>
              <Link href="/" className="block">
                <p className="text-base leading-snug font-bold text-white transition-colors hover:text-[#913FE2]">
                  เอาชีวิตรอดในเกมฉบับคนเถื่อน
                </p>
              </Link>
              <p className="mt-0.5 mb-4 text-xs text-white/40">ตอนที่ {slug}</p>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="px-8 py-3"
                  nativeButton={false}
                  render={<Link href="/novels" />}
                >
                  <HouseIcon />
                  <span>กลับไปหน้าหลัก</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollProgress />
    </div>
  )
}
