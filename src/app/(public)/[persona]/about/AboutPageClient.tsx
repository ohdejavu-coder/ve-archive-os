"use client";

import { usePersona } from "@/lib/identity/context";
import { useSiteContent } from "@/lib/content/ContentContext";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { MDXRenderer } from "@/components/content/MDXRenderer";
import { PortraitPhoto } from "@/components/content/PortraitPhoto";
import { CTA } from "@/components/sections/CTA";

export function AboutPageClient({ fileContent }: { fileContent: string }) {
  const persona = usePersona();
  const { pages } = useSiteContent();
  const content = pages.about || fileContent;
  const photoPath = persona.profilePhoto ?? "/media/profile/avatar.jpg";
  const statement = persona.personalStatement ?? "";

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[var(--red)]" />
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-400 font-medium">About</span>
          </div>
          <Typography variant="h1" cinematic>关于</Typography>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          <div className="lg:col-span-8">
            <MDXRenderer content={content} />
          </div>
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              <PortraitPhoto src={photoPath} alt={persona.name} accentColor="#e63946" />
              {statement && (
                <div className="border-l-2 border-[var(--red)] pl-4">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                    &ldquo;{statement}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </Container>
      <CTA />
    </section>
  );
}
