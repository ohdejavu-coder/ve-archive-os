import { resolveIdentity } from "@/lib/identity/resolver";
import { loadWorksByPersona } from "@/lib/content/works";
import { Hero } from "@/components/sections/Hero";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { CTA } from "@/components/sections/CTA";
import { IdentityProvider } from "@/lib/identity/context";

/**
 * Persona home/landing page.
 * Shows: Hero → Featured Works → CTA
 *
 * Works are loaded server-side and passed as props.
 * The page must answer "Who are you?" within seconds.
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
      <Hero />
      <WorkGrid works={works} />
      <CTA />
    </IdentityProvider>
  );
}
