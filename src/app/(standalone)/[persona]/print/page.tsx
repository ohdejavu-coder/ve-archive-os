import { resolveIdentity } from "@/lib/identity/resolver";
import { loadJSON } from "@/lib/content/loader";
import type { Resume } from "@/types/content";
import { PrintResumeClient } from "./PrintResumeClient";

export default async function PrintPage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona: personaId } = await params;
  const identity = resolveIdentity(personaId);
  const fileResume = loadJSON<Resume>("resume/main.json");

  return <PrintResumeClient identity={identity} fileResume={fileResume} />;
}
