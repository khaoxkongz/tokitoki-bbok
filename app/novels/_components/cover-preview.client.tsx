"use client"

import * as React from "react"
import { ExpandIcon } from "lucide-react"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { novelInfo } from "@/features/novel/config"

export function CoverPreview() {
  const [isOpen, setIsOpen] = React.useState(false)
  const coverAlt = `ปกนิยาย ${novelInfo.title}`

  return (
    <React.Fragment>
      <div className="relative flex w-full flex-col gap-3 lg:max-w-[400px]">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative hidden aspect-[2/3] w-full cursor-pointer overflow-hidden rounded-lg text-left lg:block"
          aria-label="ขยายภาพปกนิยาย"
        >
          <img
            src={novelInfo.coverImage}
            alt={coverAlt}
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="flex size-[60px] items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:scale-125">
              <ExpandIcon className="size-7" />
            </span>
          </span>
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="grid min-h-[calc(100%-2rem)] place-items-center sm:max-w-[calc(100%-2rem)]">
          <img
            src={novelInfo.coverImage}
            alt={coverAlt}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
