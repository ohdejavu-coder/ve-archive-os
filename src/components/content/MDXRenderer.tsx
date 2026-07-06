import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils/cn";

interface MDXRendererProps {
  content: string;
  className?: string;
}

export function MDXRenderer({ content, className }: MDXRendererProps) {
  if (!content) return null;

  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        "prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-neutral-900 dark:prose-headings:text-neutral-100",
        "prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-4",
        "prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-6 prose-h2:mb-3",
        "prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-4 prose-h3:mb-2",
        "prose-p:leading-relaxed prose-p:my-2 prose-p:text-neutral-700 dark:prose-p:text-neutral-300",
        "prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-a:transition-all",
        "prose-strong:text-neutral-900 dark:prose-strong:text-neutral-100 prose-strong:font-bold",
        "prose-li:leading-relaxed prose-li:marker:text-neutral-400 prose-li:my-1",
        "prose-ul:list-disc prose-ul:pl-5 prose-ul:my-2",
        "prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-2",
        "prose-blockquote:border-l-accent prose-blockquote:bg-neutral-50 dark:prose-blockquote:bg-neutral-900/50",
        "prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded text-sm",
        "prose-img:rounded-lg prose-img:shadow-md",
        "prose-table:text-sm prose-th:font-semibold",
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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
