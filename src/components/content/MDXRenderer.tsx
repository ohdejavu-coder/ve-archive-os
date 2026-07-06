import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils/cn";

/**
 * Preprocess:
 * - Single \n between content lines → "  \n" (GFM hard break = tight line break)
 * - Double \n\n → paragraph break (left alone)
 */
function preprocess(md: string): string {
  if (!md) return "";
  const lines = md.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const cur = lines[i];
    const nxt = lines[i + 1];
    if (cur.length > 0 && nxt !== undefined && nxt.length > 0) {
      if (!cur.endsWith("  ")) lines[i] = cur + "  ";
    }
  }
  return lines.join("\n");
}

interface MDXRendererProps {
  content: string;
  className?: string;
}

export function MDXRenderer({ content, className }: MDXRendererProps) {
  if (!content) return null;

  const processed = preprocess(content);

  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        // 16px base, normal paragraph spacing, tight within paragraphs
        "prose-p:leading-relaxed prose-p:mb-3 prose-p:mt-0",
        // Bold inherits color + weight
        "prose-strong:font-bold prose-strong:text-neutral-900 dark:prose-strong:text-neutral-100",
        // Headings
        "prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-neutral-900 dark:prose-headings:text-neutral-100",
        "prose-h1:text-3xl md:prose-h1:text-4xl",
        "prose-h2:text-2xl md:prose-h2:text-3xl",
        "prose-h3:text-xl md:prose-h3:text-2xl",
        "prose-li:leading-relaxed",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            const isExternal = href?.startsWith("http") || href?.startsWith("mailto");
            return (
              <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} {...props}>
                {children}
              </a>
            );
          },
          img: ({ src, alt, ...props }) => (
            <img src={src} alt={alt ?? ""} loading="lazy" className="rounded-lg shadow-md" {...props} />
          ),
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
