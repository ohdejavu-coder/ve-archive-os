import { resolveIdentity } from "@/lib/identity/resolver";
import { IdentityProvider } from "@/lib/identity/context";
import { loadMDX } from "@/lib/content/loader";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { MDXRenderer } from "@/components/content/MDXRenderer";
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
    title: `关于 — ${identity.persona.name}`,
    description: `了解更多关于${identity.persona.name}的信息`,
    path: `/${identity.persona.id}/about`,
  });
}

/**
 * About page — content from content/pages/about.mdx.
 * All text is editable by modifying the MDX file.
 * Per Principle 03: no hardcoded text, no prompt generation.
 */
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
      <section className="py-16">
        <Container size="narrow">
          <div className="prose-content">
            <MDXRenderer content={content} />
          </div>
        </Container>
        <CTA />
      </section>
    </IdentityProvider>
  );
}
