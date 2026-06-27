import { loadSiteConfig, loadPersonas } from "@/lib/content/loader";
import { listFiles } from "@/lib/content/loader";
import { loadJSON } from "@/lib/content/loader";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { Divider } from "@/components/ui/Divider";
import { FolderOpen, UserCircle, FileText, Globe } from "lucide-react";
import type { Resume } from "@/types/content";

/**
 * CCR Dashboard — overview of all content in the system.
 *
 * Shows:
 * - Active personas count
 * - Total works count
 * - Resume status
 * - Site config summary
 * - Quick links to edit content
 *
 * Per Project Goal: the user comes here to manage their brand, not "maintain a website."
 */
export default function CCRDashboard() {
  const site = loadSiteConfig();
  const personas = loadPersonas();
  const worksFiles = listFiles("works", ".mdx");

  let resumeStatus = "未配置";
  try {
    const resume = loadJSON<Resume>("resume/main.json");
    if (resume.basics?.name) {
      resumeStatus = `${resume.basics.name} · ${resume.experience.length} 段经历`;
    }
  } catch {
    resumeStatus = "文件缺失";
  }

  const stats = [
    {
      label: "身份配置",
      value: personas.length,
      unit: "个",
      icon: UserCircle,
      href: "/ccr/persona",
    },
    {
      label: "作品条目",
      value: worksFiles.length,
      unit: "个",
      icon: FolderOpen,
      href: "/ccr/works",
    },
    {
      label: "简历状态",
      value: resumeStatus,
      unit: "",
      icon: FileText,
      href: "/ccr/resume",
    },
    {
      label: "默认身份",
      value: site.defaultPersona,
      unit: "",
      icon: Globe,
      href: "/ccr/settings",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Typography variant="h2" className="mb-1">
          仪表盘
        </Typography>
        <Typography variant="body" className="text-neutral-500">
          欢迎来到创作者控制中心。在这里管理你的个人品牌操作系统。
        </Typography>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} padded hover>
              <a
                href={stat.href}
                className="block -m-6 p-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className="text-neutral-400" />
                  <Typography variant="caption">{stat.label}</Typography>
                </div>
                <Typography variant="h3" className="mb-0">
                  {stat.value}
                </Typography>
                {stat.unit && (
                  <Typography variant="caption">{stat.unit}</Typography>
                )}
              </a>
            </Card>
          );
        })}
      </div>

      <Divider />

      {/* Content editing guide */}
      <Card padded>
        <Typography variant="h4" className="mb-3">
          如何编辑内容
        </Typography>
        <Typography variant="body" className="text-neutral-600 dark:text-neutral-400 mb-4">
          在 CodeSandbox 环境中，你可以直接编辑项目文件来修改网站内容。
        </Typography>
        <div className="space-y-3">
          <EditInstruction
            title="修改个人介绍"
            path="content/pages/about.mdx"
            description="直接编辑 Markdown 文件修改关于页面内容。"
          />
          <EditInstruction
            title="添加/编辑作品"
            path="content/works/*.mdx"
            description="在 works 目录下新增或修改 MDX 文件。修改 frontmatter 中的 personas 字段来控制作品在哪些身份下展示。"
          />
          <EditInstruction
            title="调整身份配置"
            path="content/personas/*.json"
            description="修改 JSON 文件来调整每个身份的展示内容、强调技能和导航。"
          />
          <EditInstruction
            title="更新简历"
            path="content/resume/main.json"
            description="编辑 JSON 文件来更新工作经历、技能和教育背景。"
          />
        </div>
      </Card>
    </div>
  );
}

function EditInstruction({
  title,
  path,
  description,
}: {
  title: string;
  path: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <code className="shrink-0 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-xs font-mono text-neutral-600 dark:text-neutral-400">
        {path}
      </code>
      <div>
        <span className="font-medium">{title}</span>
        <span className="text-neutral-400 mx-1">—</span>
        <span className="text-neutral-500">{description}</span>
      </div>
    </div>
  );
}
