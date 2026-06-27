"use client";

import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { usePersona } from "@/lib/identity/context";

/**
 * Call-to-action section.
 * Placed at the bottom of pages to drive connection.
 * Goal: partner decides to contact within 3 minutes (per Success Metrics).
 */
export function CTA() {
  const persona = usePersona();

  return (
    <section className="py-16 md:py-20 bg-neutral-50 dark:bg-neutral-900/50">
      <Container size="narrow">
        <div className="text-center space-y-4">
          <Typography variant="h3">
            开始合作
          </Typography>
          <Typography variant="body" className="text-neutral-500 max-w-md mx-auto">
            如果你对我的作品和能力感兴趣，欢迎随时联系我。
          </Typography>
          <div className="pt-2">
            <Button href={`/${persona.id}/contact`} variant="primary" size="lg">
              联系我
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
