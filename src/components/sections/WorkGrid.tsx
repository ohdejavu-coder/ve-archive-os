"use client";

import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Grid } from "@/components/ui/Grid";
import { WorkCard } from "./WorkCard";
import type { Work } from "@/types/work";

interface WorkGridProps {
  works: Work[];
}

/**
 * Work grid — client component that renders work cards.
 * Data is loaded server-side and passed as props.
 */
export function WorkGrid({ works }: WorkGridProps) {
  if (works.length === 0) {
    return (
      <section className="py-16">
        <Container size="narrow">
          <div className="text-center py-16">
            <Typography variant="h3" className="text-neutral-300">
              暂无作品
            </Typography>
            <Typography variant="body" className="text-neutral-400 mt-2">
              作品内容将在未来添加
            </Typography>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16">
      <Container>
        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
          {works.map((work) => (
            <WorkCard key={work.slug} work={work} />
          ))}
        </Grid>
      </Container>
    </section>
  );
}
