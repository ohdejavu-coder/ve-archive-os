import { loadWorks } from "@/lib/content/works";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default function CCRWorksPage() {
  const works = loadWorks();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Typography variant="h2" className="mb-1">作品管理</Typography>
        <Typography variant="body" className="text-neutral-500">
          共 {works.length} 个作品。点击作品标题在 CodeSandbox 文件树中打开 .mdx 文件直接编辑。
        </Typography>
      </div>

      {works.length === 0 ? (
        <Card padded>
          <Typography variant="body" className="text-neutral-400 text-center py-8">
            暂无作品。在 content/works/ 下创建 .mdx 文件来添加作品。
          </Typography>
        </Card>
      ) : (
        <div className="space-y-3">
          {works.map((work) => (
            <Card key={work.slug} padded hover>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Typography variant="h4">{work.title}</Typography>
                      <Typography variant="caption">{work.titleEn}</Typography>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Badge>{work.category}</Badge>
                      {work.featured && <Badge color="#c8a87c">精选</Badge>}
                      {work.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/default/works/${work.slug}`}
                      target="_blank"
                      className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      预览 →
                    </Link>
                  </div>
                </div>

                {/* File path + edit hint */}
                <div className="flex items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <code className="text-xs font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                    content/works/{work.slug}.mdx
                  </code>
                  <span className="text-xs text-neutral-400">
                    在左侧文件树中找到此文件，直接编辑 frontmatter 和正文内容。
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add new work guide */}
      <Card padded>
        <Typography variant="h4" className="mb-3">添加新作品</Typography>
        <div className="space-y-2 text-sm text-neutral-500">
          <p>1. 在 <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">content/works/</code> 目录下新建一个 <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">.mdx</code> 文件</p>
          <p>2. 参考已有作品（如 <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">example-01.mdx</code>）的格式填写 frontmatter</p>
          <p>3. 确保 <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">personas</code> 字段包含你希望展示该作品的身份</p>
          <p>4. 将图片放入 <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">public/media/works/&#123;your-slug&#125;/</code></p>
        </div>
      </Card>
    </div>
  );
}
