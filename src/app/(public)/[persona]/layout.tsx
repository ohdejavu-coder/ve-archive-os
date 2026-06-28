import { notFound } from "next/navigation";
import { resolveIdentity } from "@/lib/identity/resolver";
import { IdentityProvider } from "@/lib/identity/context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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

  if (!VALID_PERSONAS.includes(personaId)) {
    notFound();
  }

  const identity = resolveIdentity(personaId);

  return (
    <IdentityProvider identity={identity}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </IdentityProvider>
  );
}
