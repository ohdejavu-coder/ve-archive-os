import { resolveIdentity } from "@/lib/identity/resolver";
import { IdentityProvider } from "@/lib/identity/context";
import { loadMDX } from "@/lib/content/loader";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { MDXRenderer } from "@/components/content/MDXRenderer";
import { PortraitPhoto } from "@/components/content/PortraitPhoto";
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
 * About page — cinematic two-column layout.
 *
 * Left (wide): MDX content — the story
 * Right (narrow): Profile photo + key facts
 *
 * All text from content/pages/about.mdx — editable by user.
 * Per Principle 03: no hardcoded text, no prompt generation.
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona: personaId } = await params;
  const identity = resolveIdentity(personaId);
  const { persona } = identity;
  const { content } = loadMDX("pages/about.mdx");

  const photoPath = persona.profilePhoto ?? "/media/profile/avatar.jpg";
  const statement = persona.personalStatement ?? "";

  return (
    <IdentityProvider identity={identity}>
      <section className="py-16 md:py-24">
        <Container>
          {/* Page header */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-8 h-px"
                style={{ backgroundColor: persona.accentColor }}
              />
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-medium">
                About
              </span>
            </div>
            <Typography variant="h1" cinematic>
              关于
            </Typography>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: MDX content */}
            <div className="lg:col-span-8">
              <MDXRenderer content={content} />
            </div>

            {/* Right: Profile sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Photo */}
                <PortraitPhoto
                  src={photoPath}
                  alt={persona.name}
                  accentColor={persona.accentColor}
                />

                {/* Statement */}
                {statement && (
                  <div
                    className="p-5 rounded-lg border"
                    style={{ borderColor: `${persona.accentColor}30` }}
                  >
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                      &ldquo;{statement}&rdquo;
                    </p>
                  </div>
                )}

                {/* Identity label */}
                <div className="text-center">
                  <span className="text-sm text-neutral-400">
                    当前身份：{persona.name} / {persona.nameEn}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <CTA />
    </IdentityProvider>
  );
}
