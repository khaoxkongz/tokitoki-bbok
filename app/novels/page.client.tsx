"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NovelMeta } from "@/lib/novels"
import {
  ArrowDownWideNarrowIcon,
  ArrowUpWideNarrowIcon,
  ExpandIcon,
  SearchIcon,
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Link from "next/link"

interface PageClientProps {
  novels: NovelMeta[]
}

export function PageClient({ novels }: PageClientProps) {
  const [open, setOpen] = React.useState(false)
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc")

  return (
    <React.Fragment>
      <div className="lg:flex lg:gap-9">
        {/* Left Column */}
        <div className="relative flex w-full flex-col gap-3 lg:max-w-[400px]">
          {/* Cover Image (Desktop only) */}
          <div className="group relative hidden aspect-[2/3] w-full cursor-pointer overflow-hidden rounded-lg lg:block">
            <div className="absolute top-0 left-0 z-0 h-full w-full rounded-xl">
              <img
                src="/Webnovel_First_Cover.webp"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute inset-0 z-[1] bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 z-[2] flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div
                  onClick={() => setOpen(true)}
                  className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white/20 transition-transform duration-200 hover:scale-125"
                >
                  <ExpandIcon className="size-7" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="mt-3 w-full lg:mt-0">
          {/* Main Info Card */}
          <article className="rounded-lg bg-[oklch(0.499_0.0031_106.51/25%)] px-3 py-4 lg:p-8">
            <span className="text-xl leading-tight font-semibold lg:text-[32px]">
              เอาชีวิตรอดในเกมฉบับคนเถื่อน
            </span>

            {/* Alternative Titles & Popularity */}

            {/* Description */}
            <div className="relative mt-3">
              อีฮันซู เขาคือชายหนุ่มผู้เล่นเกม [ดันเจียน แอนด์ สโตน]
              ที่ไม่มีใครเคยเคลียร์ได้มาก่อนเป็นเวลาถึง 9 ปี จนมาถึงบอสตัวสุดท้าย
              แต่เมื่อเขาเข้าไปในห้องบอส เขากลับได้เข้ามาอยู่ในร่างของ “บยอร์น ยานเดล”
              คนเถื่อนแห่งเกม [ดันเจียน แอนด์ สโตน] วิธีเดียวที่คุณจะเอาชีวิตในเกมนี้ได้
              คือคุณต้องเข้าไปยังเขาวงกตและต่อสู้โดยเอาชีวิตของคุณเป็นเดิมพัน ด้วยกลยุทธ์ตลอด 9
              ปีที่ผ่านมาและร่างกายอันกำยำของคนเถื่อน ยังไงซะ ฉันก็จะเอาตัวรอดในเกมนี้ให้ได้!
            </div>
          </article>

          {/* Chapter List */}
          <div className="mt-4">
            <div className="overflow-hidden rounded-lg bg-[oklch(0.499_0.0031_106.51/25%)]">
              <div className="border-b border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-lg font-bold">
                    ทั้งหมด {novels.length} ตอน
                  </span>

                  <Button
                    type="button"
                    size="lg"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                  >
                    {sortOrder === "asc" ? (
                      <ArrowDownWideNarrowIcon />
                    ) : (
                      <ArrowUpWideNarrowIcon />
                    )}
                    <span>
                      {sortOrder === "asc"
                        ? "เรียงจากน้อยไปมาก"
                        : "เรียงจากมากไปน้อย"}
                    </span>
                  </Button>
                </div>
                <InputGroup className="h-9">
                  <InputGroupInput placeholder="Search..." />
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <ScrollArea className="h-[500px]">
                <ul className="grid gap-1">
                  {novels.map((novel) => (
                    <li key={novel.slug}>
                      <Link
                        href={`/novels/${novel.slug}`}
                        className="group flex cursor-pointer items-center justify-between px-4 py-4 transition-colors hover:bg-input"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col items-start">
                              <span className="font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                                ตอนที่ {novel.episode}
                              </span>
                              <span className="block truncate text-sm text-white/50">
                                {novel.title}
                              </span>
                            </div>
                          </div>

                          <div className="ml-3 shrink-0 text-right">
                            <span className="text-sm text-white/40">
                              {novel.published}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="grid min-h-[calc(100%-2rem)] place-items-center sm:max-w-[calc(100%-2rem)]">
          <img
            src="/Webnovel_First_Cover.webp"
            alt=""
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
