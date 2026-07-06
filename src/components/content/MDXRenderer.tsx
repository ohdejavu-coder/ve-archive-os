import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils/cn";

/**
 * Preprocess: single \n between content lines → "  \n" (GFM hard break).
 * Double \n\n → paragraph break (left alone).
 * No content on blank lines between blocks → preserved as-is.
 */
function preprocess(md: string): string {
  if (!md) return "";
  const lines = md.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const cur = lines[i];
    const nxt = lines[i + 1];
    // If current line has content AND next line has content AND next line is not empty:
    // add GFM hard break (two trailing spaces) to current line
    if (cur.length > 0 && nxt !== undefined && nxt.length > 0) {
      // Don't add hard break if current line already ends with two spaces
      if (!cur.endsWith("  ")) {
        lines[i] = cur + "  ";
      }
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
        // prose-lg = 18px base font for everything inside
        "prose prose-lg prose-neutral dark:prose-invert max-w-none",
        // Safety net: render raw newlines as line breaks
        "whitespace-pre-line",
        // Headings
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-h1:text-3xl md:prose-h1:text-4xl",
        "prose-h2:text-2xl md:prose-h2:text-3xl",
        "prose-h3:text-xl md:prose-h3:text-2xl",
        // Paragraph spacing
        "[&_p]:mb-5 [&_p]:leading-relaxed",
        // Bold
        "[&_strong]:font-bold [&_strong]:text-inherit",
        // Links
        "[&_a]:text-accent [&_a]:no-underline hover:[&_a]:underline",
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
