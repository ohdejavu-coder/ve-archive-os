import { loadPersonas } from "@/lib/content/loader";
import { Typography } from "@/components/ui/Typography";
import { PersonaEditorForm } from "@/components/ccr/PersonaEditorForm";

export default function CCRPersonaPage() {
  const personas = loadPersonas();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Typography variant="h2" className="mb-1">身份配置</Typography>
        <Typography variant="body" className="text-neutral-500">
          编辑每个身份 → 导出 JSON → 粘贴到对应的 content/personas/&#123;id&#125;.json
        </Typography>
      </div>

      {personas.map((persona, i) => (
        <PersonaEditorForm key={persona.id} persona={persona} index={i} />
      ))}
    </div>
  );
}
