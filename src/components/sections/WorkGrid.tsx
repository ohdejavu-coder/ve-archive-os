"use client";

import { useState, useMemo } from "react";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Grid } from "@/components/ui/Grid";
import { WorkCard } from "./WorkCard";
import { CategoryFilter } from "./CategoryFilter";
import type { Work, WorkCategory } from "@/types/work";

interface WorkGridProps {
  works: Work[];
}

/**
 * Work grid with category filtering.
 * Shows filter bar at top, work cards below.
 */
export function WorkGrid({ works }: WorkGridProps) {
  const [activeCategory, setActiveCategory] = useState<WorkCategory | "all">("all");

  // Compute counts
  const counts = useMemo(() => {
    const count: Record<WorkCategory | "all", number> = { all: works.length } as Record<WorkCategory | "all", number>;
    for (const w of works) {
      count[w.category] = (count[w.category] ?? 0) + 1;
    }
    return count;
  }, [works]);

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? works
        : works.filter((w) => w.category === activeCategory),
    [works, activeCategory]
  );

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
        {/* Filter bar */}
        <div className="mb-10">
          <CategoryFilter
            active={activeCategory}
            onChange={setActiveCategory}
            counts={counts}
          />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Typography variant="h4" className="text-neutral-300">
              该分类下暂无作品
            </Typography>
          </div>
        ) : (
          <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
            {filtered.map((work) => (
              <WorkCard key={work.slug} work={work} />
            ))}
          </Grid>
        )}
      </Container>
    </section>
  );
}
