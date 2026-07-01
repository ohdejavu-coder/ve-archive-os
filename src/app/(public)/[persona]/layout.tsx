import { notFound } from "next/navigation";
import { cookies } from "next/headers";
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

export default async function PersonaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ persona: string }>;
}) {
  const { persona: personaId } = await params;
  if (!VALID_PERSONAS.includes(personaId)) notFound();

  const identity = resolveIdentity(personaId);

  let lang: "zh" | "en" = "zh";
  try {
    const c = await cookies();
    if (c.get("ve-lang")?.value === "en") lang = "en";
  } catch {
    // cookies() may fail in some edge cases — default to zh
  }

  return (
    <PersonaShell identity={identity} lang={lang}>
      {children}
    </PersonaShell>
  );
}
