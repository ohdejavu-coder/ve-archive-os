import { loadWorks } from "@/lib/content/works";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";

/**
 * CCR Works Manager — lists all works with metadata.
 * In Phase 1: read-only preview. Edit by modifying files directly.
 */
export default function CCRWorksPage() {
  const works = loadWorks();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Typography variant="h2" className="mb-1">
          作品管理
        </Typography>
        <Typography variant="body" className="text-neutral-500">
          共 {works.length} 个作品。点击编辑需要在 CodeSandbox 中打开对应文件。
        </Typography>
      </div>

      {works.length === 0 ? (
        <Card padded>
          <Typography variant="body" className="text-neutral-400 text-center py-8">
            暂无作品。在 content/works/ 目录下创建 .mdx 文件来添加作品。
          </Typography>
        </Card>
      ) : (
        <div className="space-y-3">
          {works.map((work) => (
            <Card key={work.slug} padded hover>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Typography variant="h4">{work.title}</Typography>
                    <Typography variant="caption">{work.titleEn}</Typography>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge>{work.category}</Badge>
                    {work.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                    {work.featured && <Badge color="#c8a87c">精选</Badge>}
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-neutral-400">
                    <span>年份: {work.year}</span>
                    {work.client && <span>客户: {work.client}</span>}
                    <span>展示身份: {work.personas.join(", ")}</span>
                  </div>
                </div>
                <code className="shrink-0 text-xs font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                  content/works/{work.slug}.mdx
                </code>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
