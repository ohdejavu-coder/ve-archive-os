import { resolveIdentity } from "@/lib/identity/resolver";
import { IdentityProvider } from "@/lib/identity/context";
import { loadMDX } from "@/lib/content/loader";
import { ContactPageClient } from "./ContactPageClient";
import { createMetadata } from "@/lib/utils/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona } = await params;
  const identity = resolveIdentity(persona);
  return createMetadata({
    title: `联系 — ${identity.persona.name}`,
    description: `与${identity.persona.name}取得联系`,
    path: `/${identity.persona.id}/contact`,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona: personaId } = await params;
  const identity = resolveIdentity(personaId);
  const { content } = loadMDX("pages/contact.mdx");

  return (
    <IdentityProvider identity={identity}>
      <ContactPageClient fileContent={content} />
    </IdentityProvider>
  );
}
