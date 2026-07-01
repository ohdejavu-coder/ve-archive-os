import { resolveIdentity } from "@/lib/identity/resolver";
import { loadJSON } from "@/lib/content/loader";
import { createMetadata } from "@/lib/utils/metadata";
import { ResumeClient } from "./ResumeClient";
import type { Resume } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona } = await params;
  const identity = resolveIdentity(persona);
  return createMetadata({
    title: `简历 — ${identity.persona.name}`,
    description: `${identity.persona.name}的工作经历与技能`,
    path: `/${identity.persona.id}/resume`,
  });
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona: personaId } = await params;
  const identity = resolveIdentity(personaId);
  const fileResume = loadJSON<Resume>("resume/main.json");

  return <ResumeClient identity={identity} fileResume={fileResume} />;
}
