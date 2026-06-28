import { resolveIdentity } from "@/lib/identity/resolver";
import { IdentityProvider } from "@/lib/identity/context";
import { loadMDX } from "@/lib/content/loader";
import { AboutPageClient } from "./AboutPageClient";
import { createMetadata } from "@/lib/utils/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona } = await params;
  const identity = resolveIdentity(persona);
  return createMetadata({
    title: `关于 — ${identity.persona.name}`,
    description: `了解更多关于${identity.persona.name}的信息`,
    path: `/${identity.persona.id}/about`,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona: personaId } = await params;
  const identity = resolveIdentity(personaId);
  const { content } = loadMDX("pages/about.mdx");

  return (
    <IdentityProvider identity={identity}>
      <AboutPageClient fileContent={content} />
    </IdentityProvider>
  );
}
