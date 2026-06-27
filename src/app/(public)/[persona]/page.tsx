import { resolveIdentity } from "@/lib/identity/resolver";
import { loadWorksByPersona } from "@/lib/content/works";
import { Hero } from "@/components/sections/Hero";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { CTA } from "@/components/sections/CTA";
import { IdentityProvider } from "@/lib/identity/context";

/**
 * Persona home/landing page.
 * Shows: Hero (with real work thumbnails in FilmStrip) → Works → CTA
 */
export default async function PersonaHomePage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona: personaId } = await params;
  const identity = resolveIdentity(personaId);
  const works = loadWorksByPersona(identity.persona.id);

  return (
    <IdentityProvider identity={identity}>
      <Hero works={works} />
      <WorkGrid works={works} />
      <CTA />
    </IdentityProvider>
  );
}
