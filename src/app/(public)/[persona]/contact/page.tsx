import { resolveIdentity } from "@/lib/identity/resolver";
import { IdentityProvider } from "@/lib/identity/context";
import { loadMDX } from "@/lib/content/loader";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { MDXRenderer } from "@/components/content/MDXRenderer";
import { ContactForm } from "@/components/sections/ContactForm";
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

/**
 * Contact page — MDX content + contact form.
 * Goal: partner decides to connect within 3 minutes.
 */
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
      <section className="py-16">
        <Container size="narrow">
          <div className="grid gap-12 md:grid-cols-5">
            {/* Left: MDX content (introduction) */}
            <div className="md:col-span-2">
              <MDXRenderer content={content} />
            </div>

            {/* Right: Contact form */}
            <div className="md:col-span-3">
              <Card padded>
                <Typography variant="h3" className="mb-6">
                  发送消息
                </Typography>
                <ContactForm />
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </IdentityProvider>
  );
}
