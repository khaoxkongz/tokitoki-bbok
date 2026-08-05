import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">ยินดีต้อนรับสู่ Tokitoki-bbok</h1>
        <p className="text-muted-foreground">
          อ่านนิยายและเรื่องสั้นทั้งหมดในระบบ App Router
        </p>
        <div>
          <Link href="/novels">
            <Button size="lg" className="mt-4">ไปที่รายการนิยายทั้งหมด</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
