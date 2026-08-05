"use client"

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  HouseIcon,
  MenuIcon,
  MessageCircleMoreIcon,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NovelMeta } from "@/lib/novels"
import { cn } from "@/lib/utils"
import * as React from "react"

export function PageClient({
  slug,
  novels,
  children,
}: Readonly<{ slug: string; novels: NovelMeta[]; children: React.ReactNode }>) {
  const [areControlsVisible, setAreControlsVisible] = React.useState(false)
  const [scrollFade, setScrollFade] = React.useState({
    top: false,
    bottom: false,
  })

  React.useEffect(() => {
    const updateScrollFade = () => {
      const scrollTop = window.scrollY
      const maxScrollTop = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0
      )
      const nextScrollFade = {
        top: scrollTop > 1,
        bottom: scrollTop < maxScrollTop - 1,
      }

      setScrollFade((currentScrollFade) =>
        currentScrollFade.top === nextScrollFade.top &&
        currentScrollFade.bottom === nextScrollFade.bottom
          ? currentScrollFade
          : nextScrollFade
      )
    }

    updateScrollFade()
    window.addEventListener("scroll", updateScrollFade, { passive: true })
    window.addEventListener("resize", updateScrollFade)

    const resizeObserver = new ResizeObserver(updateScrollFade)
    resizeObserver.observe(document.documentElement)

    return () => {
      window.removeEventListener("scroll", updateScrollFade)
      window.removeEventListener("resize", updateScrollFade)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <React.Fragment>
      <div
        className={cn(
          "fixed top-0 right-0 left-0 z-50 border-b border-zinc-800/50 bg-zinc-900/95 pt-[env(safe-area-inset-top)] backdrop-blur-sm transition-[transform,opacity,visibility] ease-(--motion-ease-out) motion-reduce:transform-none motion-reduce:transition-[opacity,visibility] motion-reduce:duration-(--motion-duration-reduced)",
          areControlsVisible
            ? "visible translate-y-0 opacity-100 duration-(--motion-duration-control-enter)"
            : "invisible -translate-y-full opacity-0 duration-(--motion-duration-control-exit)"
        )}
        aria-hidden={!areControlsVisible}
      >
        <div className="mx-auto flex w-full max-w-[1285px] items-center justify-between px-3 py-4 md:w-[95%] md:px-0">
          <div className="mr-3 flex shrink-0 items-center justify-start">
            <Button
              type="button"
              nativeButton={false}
              size="icon-lg"
              variant="secondary"
              render={<Link href="/" />}
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
                src="/Webnovel_First_Cover.webp"
                alt=""
                className="w-full rounded-lg object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm text-zinc-400">
                เอาชีวิตรอดในเกมฉบับคนเถื่อน
              </div>
              <div className="truncate font-semibold text-zinc-400">
                <span className="text-zinc-100">ตอน {slug}</span>
                <span className="text-sm font-normal">{" - "}</span>
              </div>
            </div>
          </Link>

          <div className="ml-3 flex shrink-0 items-center justify-end gap-2">
            <Button
              type="button"
              size="icon-lg"
              variant="secondary"
              className="transition-colors hover:bg-amber-600/20 hover:text-amber-400"
            >
              <CircleAlertIcon />
            </Button>
            <Button type="button" size="icon-lg" variant="secondary">
              <MessageCircleMoreIcon />
            </Button>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "fixed right-0 bottom-0 left-0 z-50 border-t border-zinc-800/50 bg-zinc-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm transition-[transform,opacity,visibility] ease-(--motion-ease-out) motion-reduce:transform-none motion-reduce:transition-[opacity,visibility] motion-reduce:duration-(--motion-duration-reduced)",
          areControlsVisible
            ? "visible translate-y-0 opacity-100 duration-(--motion-duration-control-enter)"
            : "invisible translate-y-full opacity-0 duration-(--motion-duration-control-exit)"
        )}
        aria-hidden={!areControlsVisible}
      >
        <div className="mx-auto flex w-full max-w-[1285px] items-center justify-between gap-2 px-3 pt-4 pb-6 md:w-[95%] md:px-0">
          <Button type="button" size="lg">
            <ChevronLeftIcon />
            <span>ตอนก่อนหน้า</span>
          </Button>

          <div className="relative max-w-xs flex-1">
            <Popover>
              <PopoverTrigger
                render={<Button variant="outline" className="w-full" />}
              >
                <MenuIcon />
                <span>ตอนที่ {slug}</span>
                <ChevronDownIcon />
              </PopoverTrigger>
              <PopoverContent side="top" className="w-xs p-0">
                <ScrollArea className="h-64">
                  <div className="flex flex-col items-start">
                    {novels.map((novel) => {
                      return (
                        <Button
                          type="button"
                          variant={novel.slug === slug ? "default" : "ghost"}
                          size="lg"
                          key={novel.slug}
                          className="w-full justify-start rounded-none"
                        >
                          <span>ตอนที่ {novel.episode}</span>
                          <span className="text-zinc-500">
                            {" - "}
                            {novel.title}
                          </span>
                        </Button>
                      )
                    })}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>

          <Button type="button" size="lg">
            <span>ตอนถัดไป</span>
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <div
        className=""
        onClick={() => setAreControlsVisible((isVisible) => !isVisible)}
      >
        <article className="typeset typeset-docs mx-auto max-w-[75ch] rounded-xl border border-[oklch(0.9816_0.0026_106.45/10%)] bg-[oklch(0.499_0.0031_106.51/25%)] p-[clamp(1rem,3vw,1.75rem)] text-[oklch(0.9816_0.0026_106.45)] transition-[border-color] hover:border-[oklch(0.9816_0.0026_106.45/25%)]">
          {children}
        </article>
      </div>

      <div
        className={cn(
          "pointer-events-none fixed top-0 right-0 left-0 z-10 h-[25vh] bg-linear-to-b from-[oklch(0.2964_0.0036_106.61)] transition-opacity",
          scrollFade.top ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "pointer-events-none fixed right-0 bottom-0 left-0 z-10 h-[25vh] bg-linear-to-t from-[oklch(0.2964_0.0036_106.61)] transition-opacity",
          scrollFade.bottom ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />
    </React.Fragment>
  )
}
