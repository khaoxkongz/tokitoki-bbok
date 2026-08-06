import { HouseIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[oklch(0.2964_0.0036_106.61)] p-4 text-center">
      <div>
        <h1 className="text-2xl font-bold">ไม่พบตอนที่ต้องการ</h1>
        <p className="mt-2 text-muted-foreground">
          ตอนนี้อาจไม่มีอยู่ หรือชื่อไฟล์และ URL ไม่ตรงกัน
        </p>
        <Button
          type="button"
          size="lg"
          className="mt-6"
          nativeButton={false}
          render={<Link href="/novels" />}
        >
          <HouseIcon />
          <span>กลับไปหน้ารวมตอน</span>
        </Button>
      </div>
    </main>
  )
}
