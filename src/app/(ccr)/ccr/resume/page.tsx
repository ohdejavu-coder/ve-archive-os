import { loadJSON } from "@/lib/content/loader";
import { Typography } from "@/components/ui/Typography";
import { ResumeEditorForm } from "@/components/ccr/ResumeEditorForm";
import type { Resume } from "@/types/content";

/**
 * Interactive resume editor.
 * Loads resume JSON → renders editable form → exports JSON for file replacement.
 */
export default function CCRResumePage() {
  let resume: Resume;
  try {
    resume = loadJSON<Resume>("resume/main.json");
  } catch {
    return (
      <div className="space-y-6 max-w-4xl">
        <Typography variant="h2">简历编辑</Typography>
        <div className="p-12 text-center rounded-lg border border-neutral-200 dark:border-neutral-800">
          <Typography variant="body" className="text-neutral-400">
            简历文件不存在。请创建 content/resume/main.json。
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Typography variant="h2" className="mb-1">简历编辑</Typography>
        <Typography variant="body" className="text-neutral-500">
          编辑下方表单 → 点击「导出 JSON」→ 复制 → 粘贴到 content/resume/main.json
        </Typography>
      </div>
      <ResumeEditorForm resume={resume} />
    </div>
  );
}
