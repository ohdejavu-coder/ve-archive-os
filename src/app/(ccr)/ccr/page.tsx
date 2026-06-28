import { loadSiteConfig, loadPersonas, loadJSON } from "@/lib/content/loader";
import { listFiles } from "@/lib/content/loader";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { Divider } from "@/components/ui/Divider";
import { Button } from "@/components/ui/Button";
import { FolderOpen, UserCircle, FileText, Globe, ArrowRight } from "lucide-react";
import type { Resume } from "@/types/content";

/**
 * CCR Dashboard v2 — quick overview + action shortcuts.
 *
 * Per Project Goal Section 9:
 *   "用户每天进入后台，不是在维护网站，而是在管理自己的职业品牌。"
 */
export default function CCRDashboard() {
  const site = loadSiteConfig();
  const personas = loadPersonas();
  const worksFiles = listFiles("works", ".mdx");

  let resumeStatus = "未配置";
  try {
    const resume = loadJSON<Resume>("resume/main.json");
    if (resume.basics?.name) {
      resumeStatus = `${resume.basics.name} · ${resume.experience.length} 段经历 · ${resume.skills.length} 项技能`;
    }
  } catch {
    resumeStatus = "文件缺失 — 需创建";
  }

  const stats = [
    { label: "身份配置", value: personas.length, unit: "个身份", icon: UserCircle },
    { label: "作品条目", value: worksFiles.length, unit: "个作品", icon: FolderOpen },
    { label: "简历状态", value: resumeStatus, unit: "", icon: FileText },
    { label: "默认首页", value: `/${site.defaultPersona}`, unit: "", icon: Globe },
  ];

  const quickActions = [
    { label: "编辑简历", desc: "更新工作经历、技能、教育背景", href: "/ccr/resume", color: "#8b7355" },
    { label: "管理作品", desc: "查看、编辑或添加新作品", href: "/ccr/works", color: "#6b8fa3" },
    { label: "调整身份", desc: "修改每个身份的展示内容和配置", href: "/ccr/persona", color: "#a05252" },
    { label: "网站设置", desc: "修改标题、导航、社交链接", href: "/ccr/settings", color: "#5a7a6a" },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Typography variant="h2" className="mb-1">仪表盘</Typography>
        <Typography variant="body" className="text-neutral-500">
          创作者控制中心。在这里管理你的个人品牌操作系统。
        </Typography>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} padded>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-neutral-400" />
                  <Typography variant="caption">{stat.label}</Typography>
                </div>
                <Typography variant="h3" className="text-2xl">
                  {stat.value}
                </Typography>
                {stat.unit && <Typography variant="caption">{stat.unit}</Typography>}
              </div>
            </Card>
          );
        })}
      </div>

      <Divider />

      {/* Quick actions */}
      <div>
        <Typography variant="h4" className="mb-4">快捷操作</Typography>
        <div className="grid gap-3 sm:grid-cols-2">
          {quickActions.map((action) => (
            <a key={action.href} href={action.href} className="block">
              <Card padded hover>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-full min-h-[40px] rounded-full shrink-0" style={{ backgroundColor: action.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Typography variant="body" className="font-medium">{action.label}</Typography>
                      <ArrowRight size={14} className="text-neutral-300 shrink-0" />
                    </div>
                    <Typography variant="caption">{action.desc}</Typography>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
