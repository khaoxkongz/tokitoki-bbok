import { novelInfo } from "@/features/novel/config"

export function NovelSummary() {
  return (
    <article className="rounded-lg bg-[oklch(0.499_0.0031_106.51/25%)] px-3 py-4 lg:p-8">
      <h1 className="[font-family:var(--font-line-seed-sans-th-local)] text-xl leading-tight font-semibold lg:text-[32px]">
        {novelInfo.title}
      </h1>
      <p className="relative mt-3 [font-family:var(--font-arundina-sans-local)] text-2xl text-pretty">
        {novelInfo.description}
      </p>
    </article>
  )
}
