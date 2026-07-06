import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils/cn";

interface MDXRendererProps {
  content: string;
  className?: string;
}

/**
 * Preprocesses content:
 * - Single \n → "  \n" (GFM hard line break — renders as <br />)
 * - Double \n\n preserved for paragraph breaks
 */
function preprocess(md: string): string {
  if (!md) return "";
  let out = "";
  let i = 0;
  while (i < md.length) {
    if (md[i] === "\n") {
      // Count consecutive newlines
      let count = 0;
      while (i + count < md.length && md[i + count] === "\n") count++;
      if (count === 1) {
        // Single newline → GFM hard break: two spaces + newline
        out += "  \n";
      } else {
        // 2+ newlines = paragraph break
        out += "\n\n";
        // Skip remaining newlines > 2
        i += count;
        continue;
      }
      i += count;
    } else {
      out += md[i];
      i++;
    }
  }
  return out;
}

/**
 * Markdown renderer.
 *
 * Uses react-markdown + GFM (GitHub Flavored Markdown).
 * Single newlines are converted to <br /> before parsing (no plugin needed).
 * Double newlines → paragraph break.
 * **bold** → <strong>
 * *italic* → <em>
 */
export function MDXRenderer({ content, className }: MDXRendererProps) {
  if (!content) return null;

  const processed = preprocess(content);

  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        "prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-neutral-900 dark:prose-headings:text-neutral-100",
        "prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:mt-10 prose-h1:mb-6 prose-h1:leading-tight",
        "prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:leading-tight",
        "prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3",
        "prose-h4:text-lg md:prose-h4:text-xl prose-h4:mt-4 prose-h4:mb-2",
        "prose-p:leading-relaxed prose-p:mb-5 prose-p:text-neutral-700 dark:prose-p:text-neutral-300",
        "prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-a:transition-all",
        "prose-strong:text-neutral-900 dark:prose-strong:text-neutral-100 prose-strong:font-bold prose-strong:text-[1.02em]",
        "prose-li:leading-relaxed prose-li:marker:text-neutral-400",
        "prose-ul:list-disc prose-ul:pl-5",
        "prose-ol:list-decimal prose-ol:pl-5",
        "prose-blockquote:border-l-accent prose-blockquote:bg-neutral-50 dark:prose-blockquote:bg-neutral-900/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-md prose-blockquote:not-italic",
        "prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:bg-neutral-50 dark:prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:border-neutral-800 prose-pre:rounded-lg",
        "prose-img:rounded-lg prose-img:shadow-md",
        "prose-table:text-sm prose-th:font-semibold prose-th:text-left prose-td:py-2",
        "prose-hr:border-neutral-200 dark:prose-hr:border-neutral-800",
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
          pre: ({ children, ...props }) => (
            <pre className="relative overflow-x-auto p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm" {...props}>
              {children}
            </pre>
          ),
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
