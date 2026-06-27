import { Typography } from "@/components/ui/Typography";

/**
 * Renders MDX content with custom component mapping.
 *
 * In Phase 1, we render the raw MDX body as simple HTML-like text.
 * For production, integrate with next-mdx-remote or @next/mdx.
 *
 * Per Principle 01: content over animation. This is a text renderer.
 */
interface MDXRendererProps {
  content: string;
}

export function MDXRenderer({ content }: MDXRendererProps) {
  if (!content) {
    return null;
  }

  // Simple Markdown → JSX rendering for Phase 1 MVP.
  // Handles: headings, paragraphs, lists, bold, italic, links.
  const html = renderSimpleMarkdown(content);

  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-none
        prose-headings:font-semibold prose-headings:tracking-tight
        prose-h1:text-2xl prose-h1:mt-8 prose-h1:mb-4
        prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
        prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
        prose-p:leading-relaxed prose-p:mb-4
        prose-li:leading-relaxed
        prose-a:text-accent hover:prose-a:opacity-70
        prose-img:rounded-lg
        prose-strong:font-semibold
        prose-ul:list-disc prose-ul:pl-5
        prose-ol:list-decimal prose-ol:pl-5
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Minimal Markdown → HTML renderer.
 * Sufficient for our content schema (headings, paragraphs, lists, bold, italic).
 * No external dependency — per Principle 06 (long-term maintenance).
 */
function renderSimpleMarkdown(md: string): string {
  let html = md;

  // Headings (must process before bold/italic)
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold + Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Horizontal rules
  html = html.replace(/^---$/gm, "<hr />");

  // Unordered lists
  html = html.replace(/^(\s*)[-*]\s+(.+)$/gm, (_, indent, item) => {
    return `<li>${item}</li>`;
  });

  // Ordered lists
  html = html.replace(/^(\s*)\d+\.\s+(.+)$/gm, (_, indent, item) => {
    return `<li>${item}</li>`;
  });

  // Wrap consecutive <li> in <ul> (simple approach)
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, (match) => {
    return `<ul>${match}</ul>`;
  });

  // Paragraphs: wrap remaining text lines
  const blocks = html.split(/\n\n+/);
  html = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      // Skip already wrapped blocks
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<hr") ||
        trimmed.startsWith("<img")
      ) {
        return trimmed;
      }
      // Inline line breaks → <br />
      const withBreaks = trimmed.replace(/\n/g, "<br />");
      return `<p>${withBreaks}</p>`;
    })
    .join("\n");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  return html;
}
