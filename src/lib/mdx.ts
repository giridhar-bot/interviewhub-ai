// ══════════════════════════════════════════════════════════════
// InterviewHub AI — MDX Engine
// Server-side MDX compilation with syntax highlighting & plugins
// ══════════════════════════════════════════════════════════════

// ─── Compile MDX ────────────────────────────

export async function compileMdxContent(source: string) {
  // Keep ESM-only dependencies loadable by both Next.js and the content-validation CLI.
  const [
    { compileMDX },
    { default: rehypeHighlight },
    { default: rehypeSlug },
    { default: rehypeAutolinkHeadings },
    { default: remarkGfm },
  ] = await Promise.all([
    import("next-mdx-remote/rsc"),
    import("rehype-highlight"),
    import("rehype-slug"),
    import("rehype-autolink-headings"),
    import("remark-gfm"),
  ]);
  const { content, frontmatter } = await compileMDX<{
    title?: string;
    description?: string;
    tags?: string[];
    difficulty?: string;
    readTime?: number;
  }>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" as const }],
          rehypeHighlight,
        ],
      },
    },
  });

  return { content, frontmatter };
}

// ─── Extract TOC from markdown ──────────────

export function extractTableOfContents(
  markdown: string
): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: { id: string; text: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    toc.push({ id, text, level });
  }

  return toc;
}

// ─── Strip markdown for excerpt ─────────────

export function stripMarkdown(markdown: string, maxLength = 200): string {
  const text = markdown
    .replace(/^---[\s\S]*?---/m, "") // frontmatter
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/`[^`]+`/g, "") // inline code
    .replace(/!\[.*?\]\(.*?\)/g, "") // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1") // links
    .replace(/#{1,6}\s+/g, "") // headings
    .replace(/[*_~]+/g, "") // emphasis
    .replace(/>\s+/g, "") // blockquotes
    .replace(/\n{2,}/g, "\n")
    .trim();

  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

// ─── Estimate read time ─────────────────────

export function estimateReadTime(markdown: string): number {
  const wordsPerMinute = 200;
  const words = markdown.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
