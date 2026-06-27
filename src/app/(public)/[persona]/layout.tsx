import { notFound } from "next/navigation";
import { resolveIdentity } from "@/lib/identity/resolver";
import { IdentityProvider } from "@/lib/identity/context";
import { isValidPersona } from "@/lib/content/personas";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PersonaBanner } from "@/components/content/PersonaBanner";
import { createMetadata } from "@/lib/utils/metadata";

/**
 * Persona-scoped layout.
 * Wraps all pages under /[persona] with:
 * - Identity context (current persona)
 * - Header + Footer
 * - Persona banner (subtle context indicator)
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona: personaId } = await params;
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

  // Trigger 404 for invalid persona IDs
  if (!isValidPersona(personaId)) {
    notFound();
  }

  const identity = resolveIdentity(personaId);

  return (
    <IdentityProvider identity={identity}>
      <Header />
      <PersonaBanner />
      <main className="flex-1">{children}</main>
      <Footer />
    </IdentityProvider>
  );
}
