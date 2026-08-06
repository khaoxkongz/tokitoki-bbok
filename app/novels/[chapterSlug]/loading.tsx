export default function ChapterLoading() {
  return (
    <div
      className="min-h-screen bg-[oklch(0.2964_0.0036_106.61)] p-4"
      aria-busy="true"
      aria-label="กำลังโหลดตอนนิยาย"
    >
      <div className="mx-auto max-w-[75ch] animate-pulse rounded-xl border border-white/10 bg-white/5 p-[clamp(1rem,3vw,1.75rem)]">
        <div className="mb-8 h-8 w-2/3 rounded bg-white/10" />

        <div className="space-y-4">
          <div className="h-4 rounded bg-white/10" />
          <div className="h-4 rounded bg-white/10" />
          <div className="h-4 w-5/6 rounded bg-white/10" />

          <div className="h-4 rounded bg-white/10" />
          <div className="h-4 w-4/5 rounded bg-white/10" />

          <div className="h-4 rounded bg-white/10" />
          <div className="h-4 rounded bg-white/10" />
          <div className="h-4 w-3/4 rounded bg-white/10" />
        </div>
      </div>
    </div>
  )
}
