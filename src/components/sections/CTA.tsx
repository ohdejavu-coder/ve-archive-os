"use client";

import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { usePersona } from "@/lib/identity/context";

export function CTA() {
  const persona = usePersona();

  return (
    <section className="py-24 bg-[var(--paper)] dark:bg-neutral-900/50">
      <Container size="narrow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-0.5 bg-[var(--red)]" />
              <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-400">
                Collaborate
              </span>
            </div>
            <Typography variant="h2">开始合作</Typography>
            <Typography variant="body" className="text-neutral-500">
              对我的作品和能力感兴趣？随时联系我。
            </Typography>
          </div>
          <a
            href={`/${persona.id}/contact`}
            className="inline-flex items-center px-8 py-3.5 rounded-sm text-sm font-semibold tracking-wide bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity uppercase"
          >
            联系我
          </a>
        </div>
      </Container>
    </section>
  );
}
