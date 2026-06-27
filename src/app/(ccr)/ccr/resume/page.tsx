import { loadJSON } from "@/lib/content/loader";
import { loadPersonas } from "@/lib/content/loader";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { Divider } from "@/components/ui/Divider";
import type { Resume } from "@/types/content";

/**
 * CCR Resume Editor — displays resume data with edit instructions.
 * In Phase 1: read-only preview. Edit by modifying content/resume/main.json.
 */
export default function CCRResumePage() {
  let resume: Resume;
  try {
    resume = loadJSON<Resume>("resume/main.json");
  } catch {
    return (
      <div className="space-y-6 max-w-4xl">
        <Typography variant="h2">简历编辑</Typography>
        <Card padded>
          <Typography variant="body" className="text-neutral-400 text-center py-8">
            简历文件不存在。请创建 content/resume/main.json。
          </Typography>
        </Card>
      </div>
    );
  }

  const personas = loadPersonas();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Typography variant="h2" className="mb-1">
          简历编辑
        </Typography>
        <Typography variant="body" className="text-neutral-500">
          编辑 content/resume/main.json 来更新简历内容。
        </Typography>
      </div>

      {/* Basics */}
      <Card padded>
        <Typography variant="h4" className="mb-4">
          基本信息
        </Typography>
        <div className="grid gap-3 text-sm">
          <Field label="姓名" value={`${resume.basics.name} (${resume.basics.nameEn})`} />
          <Field label="职位" value={`${resume.basics.title} (${resume.basics.titleEn})`} />
          <Field label="地点" value={resume.basics.location} />
          <Field label="邮箱" value={resume.basics.email} />
          <Field label="简介" value={resume.summary} />
        </div>
      </Card>

      {/* Experience */}
      <Card padded>
        <Typography variant="h4" className="mb-4">
          工作经历 ({resume.experience.length})
        </Typography>
        {resume.experience.map((exp, i) => (
          <div key={i} className="mb-3 last:mb-0">
            <Typography variant="body" className="font-medium">
              {exp.role} @ {exp.company}
            </Typography>
            <Typography variant="caption">
              {exp.startDate} — {exp.endDate ?? "至今"}
            </Typography>
          </div>
        ))}
      </Card>

      {/* Skills */}
      <Card padded>
        <Typography variant="h4" className="mb-4">
          技能 ({resume.skills.length})
        </Typography>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 text-sm bg-neutral-100 dark:bg-neutral-800 rounded-md"
            >
              {skill.name} ({skill.level}/5)
            </span>
          ))}
        </div>
      </Card>

      <Divider />

      {/* Persona mappings */}
      <Card padded>
        <Typography variant="h4" className="mb-3">
          身份 → 简历模块映射
        </Typography>
        <div className="space-y-2">
          {personas.map((p) => (
            <div key={p.id} className="flex items-center gap-3 text-sm">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: p.accentColor }}
              />
              <span className="font-medium min-w-16">{p.name}</span>
              <code className="text-xs text-neutral-400">
                {p.resumeSections.join(" · ")}
              </code>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-neutral-400 mr-2">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
