import { Metadata } from "next"

import { getAllNovels } from "@/lib/novels"
import { PageClient } from "./page.client"

export const metadata: Metadata = {
  title: "รายการนิยายทั้งหมด | Novels List",
  description: "รายชื่อตอนนิยายทั้งหมด",
}

export default function Page() {
  const novels = getAllNovels({ sort: "desc" })

  return (
    <main className="relative z-10 mx-auto mb-5 w-full max-w-6xl rounded-xl bg-[oklch(0.2964_0.0036_106.61)] px-3 pt-0 md:mb-7 md:w-[95%] lg:px-0 lg:pt-8">
      <PageClient novels={novels} />
    </main>
  )
}
