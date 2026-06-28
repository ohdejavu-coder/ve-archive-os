import { loadSiteConfig } from "@/lib/content/loader";
import { Typography } from "@/components/ui/Typography";
import { SettingsEditorForm } from "@/components/ccr/SettingsEditorForm";

export default function CCRSettingsPage() {
  const site = loadSiteConfig();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Typography variant="h2" className="mb-1">网站设置</Typography>
        <Typography variant="body" className="text-neutral-500">
          编辑下方表单 → 导出 JSON → 粘贴到 content/site.json
        </Typography>
      </div>
      <SettingsEditorForm site={site} />
    </div>
  );
}
