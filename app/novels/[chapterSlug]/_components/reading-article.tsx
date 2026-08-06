interface ReadingArticleProps {
  children: React.ReactNode
}

export function ReadingArticle({ children }: ReadingArticleProps) {
  return (
    <article className="typeset typeset-docs mx-auto max-w-[75ch] rounded-xl border border-[oklch(0.9816_0.0026_106.45/10%)] bg-[oklch(0.499_0.0031_106.51/25%)] p-[clamp(1rem,3vw,1.75rem)] text-pretty break-normal whitespace-normal text-[oklch(0.9816_0.0026_106.45)] transition-[border-color] hover:border-[oklch(0.9816_0.0026_106.45/25%)]">
      {children}
    </article>
  )
}
