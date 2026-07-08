import type { Metadata } from "next";
import { cookies } from "next/headers";
import { resolveIdentity } from "@/lib/identity/resolver";
import { LanguageProvider } from "@/lib/language/context";
import { IdentityProvider } from "@/lib/identity/context";
import { OverrideProvider } from "@/lib/content/OverrideContext";
import { loadSiteConfig } from "@/lib/content/loader";

export const metadata: Metadata = {
  title: "Print Resume — VE Archive",
  robots: "noindex, nofollow",
};

const VALID_PERSONAS = ["default", "photographer", "ai", "director", "freelance"];

/**
 * Standalone print layout — NO PersonaShell (no header, nav, footer).
 * Only provides LanguageProvider, IdentityProvider, OverrideProvider.
 * The root layout (src/app/layout.tsx) provides <html> / <body> and fonts.
 */
export default async function PrintLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ persona: string }>;
}) {
  const { persona: personaId } = await params;

  const validPersona = VALID_PERSONAS.includes(personaId) ? personaId : "default";
  const identity = resolveIdentity(validPersona);

  let lang: "zh" | "en" = "zh";
  let contentOverrides: Record<string, string> = {};

  try {
    const c = await cookies();
    if (c.get("ve-lang")?.value === "en") lang = "en";
    const raw = c.get("ve-json")?.value;
    if (raw) {
      contentOverrides = JSON.parse(decodeURIComponent(raw)) as Record<string, string>;
    }
    const siteConfig = loadSiteConfig();
    if (siteConfig.siteUrl) {
      contentOverrides.siteUrl = siteConfig.siteUrl;
    }
  } catch {
    // cookies() may fail
  }

  return (
    <LanguageProvider lang={lang}>
      <IdentityProvider identity={identity}>
        <OverrideProvider overrides={contentOverrides}>
          {children}
        </OverrideProvider>
      </IdentityProvider>
    </LanguageProvider>
  );
}
