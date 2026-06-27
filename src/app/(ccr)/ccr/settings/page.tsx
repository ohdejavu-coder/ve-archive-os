import { loadSiteConfig } from "@/lib/content/loader";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";

/**
 * CCR Settings — displays current site configuration.
 * Edit by modifying content/site.json.
 */
export default function CCRSettingsPage() {
  const site = loadSiteConfig();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Typography variant="h2" className="mb-1">
          网站设置
        </Typography>
        <Typography variant="body" className="text-neutral-500">
          编辑 content/site.json 来修改网站全局设置。
        </Typography>
      </div>

      <Card padded>
        <Typography variant="h4" className="mb-4">
          全局配置
        </Typography>
        <div className="grid gap-3 text-sm">
          <Field label="网站标题" value={site.title} />
          <Field label="标语" value={site.tagline} />
          <Field label="默认身份" value={site.defaultPersona} />
          <Field label="页脚文本" value={site.footer} />
        </div>
      </Card>

      <Card padded>
        <Typography variant="h4" className="mb-4">
          导航 (全局默认)
        </Typography>
        <div className="space-y-2">
          {site.navigation.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="text-neutral-400">{item.labelEn}</span>
              <code className="text-xs text-neutral-400">{item.href}</code>
            </div>
          ))}
        </div>
      </Card>

      <Card padded>
        <Typography variant="h4" className="mb-4">
          社交链接
        </Typography>
        <div className="space-y-2">
          {site.social.map((link, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="font-medium">{link.label}</span>
              <code className="text-xs text-neutral-400">{link.url}</code>
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
