import fs from "node:fs"
import path from "node:path"

export interface NovelMeta {
  slug: string
  title: string
  description?: string
  episode?: number | string
  published?: string
}

const contentDir = path.join(process.cwd(), "content/novels")

function parseFrontmatter(fileContent: string): {
  data: Record<string, string>
  content: string
} {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
  const match = fileContent.match(frontmatterRegex)

  const data: Record<string, string> = {}
  let content = fileContent

  if (match) {
    content = fileContent.slice(match[0].length)
    const lines = match[1].split("\n")
    for (const line of lines) {
      const colonIndex = line.indexOf(":")
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim()
        const value = line
          .slice(colonIndex + 1)
          .trim()
          .replace(/^["']|["']$/g, "")
        if (key) {
          data[key] = value
        }
      }
    }
  }

  return { data, content }
}

export function getAllNovels({ sort }: { sort: "asc" | "desc" }): NovelMeta[] {
  if (!fs.existsSync(contentDir)) {
    return []
  }

  const files = fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))

  const novels = files.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, "")
    const filePath = path.join(contentDir, filename)
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data } = parseFrontmatter(fileContent)

    return {
      slug,
      title: data.title || `ตอนที่ ${slug}`,
      description: data.description,
      episode: data.episode || slug,
      published: data.published,
    }
  })

  return novels.sort((a, b) => {
    const numA = parseInt(String(a.slug), 10)
    const numB = parseInt(String(b.slug), 10)
    if (!isNaN(numA) && !isNaN(numB)) {
      return sort === "asc" ? numA - numB : numB - numA
    }
    return sort === "asc"
      ? a.slug.localeCompare(b.slug)
      : b.slug.localeCompare(a.slug)
  })
}
