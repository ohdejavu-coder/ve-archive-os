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
      <section className="py-20 md:py-28">
        <Container>
          {/* Title — left-aligned with red line, Swiss style */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[var(--red)]" />
              <span className="text-xs tracking-[0.3em] uppercase text-neutral-400 font-medium">
                Works
              </span>
            </div>
            <Typography variant="h1" cinematic>
              作品
            </Typography>
            <Typography variant="body" className="text-neutral-500 mt-4 max-w-md">
              以下是以「{identity.persona.name}」身份展示的作品。点击分类筛选，或直接浏览全部。
            </Typography>
          </div>

          <WorkGrid works={works} />
        </Container>
      </section>
      <CTA />
    </IdentityProvider>
  );
}
