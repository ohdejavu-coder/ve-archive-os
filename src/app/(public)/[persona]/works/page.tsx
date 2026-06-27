import { resolveIdentity } from "@/lib/identity/resolver";
import { loadWorksByPersona } from "@/lib/content/works";
import { IdentityProvider } from "@/lib/identity/context";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { CTA } from "@/components/sections/CTA";
import { createMetadata } from "@/lib/utils/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona } = await params;
  const identity = resolveIdentity(persona);

  return createMetadata({
    title: `作品集 — ${identity.persona.name}`,
    description: `${identity.persona.name}的作品展示`,
    path: `/${identity.persona.id}/works`,
  });
}

/**
 * Works grid page — all works for the current persona.
 * Data loaded server-side, passed as props to client components.
 */
export default async function WorksPage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona: personaId } = await params;
  const identity = resolveIdentity(personaId);
  const works = loadWorksByPersona(identity.persona.id);

  return (
    <IdentityProvider identity={identity}>
      <section className="py-16">
        <Container size="narrow">
          <div className="mb-12">
            <Typography variant="h1">作品</Typography>
            <Typography variant="body" className="text-neutral-500 mt-2">
              以下是以「{identity.persona.name}」身份展示的作品。
            </Typography>
          </div>
        </Container>
        <WorkGrid works={works} />
        <CTA />
      </section>
    </IdentityProvider>
  );
}
