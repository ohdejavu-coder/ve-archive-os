import { notFound } from "next/navigation";
import { resolveIdentity } from "@/lib/identity/resolver";
import { PersonaShell } from "@/components/layout/PersonaShell";
import { createMetadata } from "@/lib/utils/metadata";

const VALID_PERSONAS = ["default", "photographer", "ai", "director", "freelance"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona: personaId } = await params;
  if (!VALID_PERSONAS.includes(personaId)) {
    return createMetadata({ title: "404", description: "", path: "" });
  }
  const identity = resolveIdentity(personaId);
  return createMetadata({
    title: `${identity.persona.name} — VE Archive`,
    description: identity.persona.description,
    path: `/${identity.persona.id}`,
  });
}

/**
 * Persona layout.
 * Language is handled by the client-side LanguageProvider reading from the URL.
 * The PersonaShell reads `window.location.search` for `?lang=en` param.
 */
export default async function PersonaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ persona: string }>;
}) {
  const { persona: personaId } = await params;

  if (!VALID_PERSONAS.includes(personaId)) {
    notFound();
  }

  const identity = resolveIdentity(personaId);

  return (
    <PersonaShell identity={identity}>
      {children}
    </PersonaShell>
  );
}
