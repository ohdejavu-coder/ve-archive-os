"use client";

import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { usePersona } from "@/lib/identity/context";

/**
 * Hero section — the first thing HR/partners see.
 * Must communicate identity within seconds (per Success Metrics).
 * Content from persona config — no hardcoded text.
 */
export function Hero() {
  const persona = usePersona();

  const headline = persona.heroHeadline ?? "用影像讲述值得被看见的故事";
  const subtitle = persona.heroSubtitle ?? "";

  return (
    <section className="py-24 md:py-32 lg:py-40">
      <Container size="narrow">
        <div className="space-y-6 text-center">
          <Typography variant="h1" cinematic>
            {headline}
          </Typography>
          {subtitle && (
            <Typography variant="body" className="text-neutral-500 max-w-lg mx-auto">
              {subtitle}
            </Typography>
          )}
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button href={`/${persona.id}/works`} variant="primary">
              查看作品
            </Button>
            <Button href={`/${persona.id}/contact`} variant="secondary">
              联系我
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
