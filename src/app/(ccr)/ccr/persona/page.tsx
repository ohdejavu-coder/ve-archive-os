import { loadPersonas } from "@/lib/content/loader";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";

/**
 * CCR Persona Manager — lists all personas with their config.
 * In Phase 1: read-only preview. Edit by modifying JSON files.
 */
export default function CCRPersonaPage() {
  const personas = loadPersonas();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Typography variant="h2" className="mb-1">
          身份配置
        </Typography>
        <Typography variant="body" className="text-neutral-500">
          共 {personas.length} 个身份。编辑 content/personas/*.json 来调整配置。
        </Typography>
      </div>

      <div className="space-y-4">
        {personas.map((persona) => (
          <Card key={persona.id} padded hover>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: persona.accentColor }}
                  />
                  <Typography variant="h4">{persona.name}</Typography>
                  <Typography variant="caption">{persona.nameEn}</Typography>
                </div>
                <Typography variant="body-sm" className="text-neutral-500 mb-3">
                  {persona.description}
                </Typography>

                <div className="grid gap-2 text-sm">
                  <div>
                    <span className="text-neutral-400">强调技能：</span>
                    <span>{persona.emphasizedSkills.join(" · ")}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">精选作品：</span>
                    <span>{persona.featuredWorkIds.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">简历模块：</span>
                    <span>{persona.resumeSections.join(" · ")}</span>
                  </div>
                </div>
              </div>

              <code className="shrink-0 text-xs font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                content/personas/{persona.id}.json
              </code>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
