"use client";

import { useState, useMemo } from "react";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Grid } from "@/components/ui/Grid";
import { WorkCard } from "./WorkCard";
import { CategoryFilter } from "./CategoryFilter";
import { useLang } from "@/lib/language/context";
import type { Work, WorkCategory } from "@/types/work";

interface WorkGridProps { works: Work[] }

export function WorkGrid({ works }: WorkGridProps) {
  const [activeCategory, setActiveCategory] = useState<WorkCategory | "all">("all");
  const { lang } = useLang();
  const t = (zh: string, en: string) => lang === "en" ? en : zh;

  const counts = useMemo(() => {
    const c: Record<WorkCategory | "all", number> = { all: works.length } as Record<WorkCategory | "all", number>;
    for (const w of works) c[w.category] = (c[w.category] ?? 0) + 1;
    return c;
  }, [works]);

  const filtered = useMemo(() =>
    activeCategory === "all" ? works : works.filter((w) => w.category === activeCategory),
    [works, activeCategory]
  );

  if (works.length === 0) {
    return (
      <section className="py-16">
        <Container size="narrow">
          <div className="text-center py-16">
            <Typography variant="h3" className="text-neutral-300">{t("暂无作品", "No works yet")}</Typography>
            <Typography variant="body" className="text-neutral-400 mt-2">{t("作品内容将在未来添加", "Works will be added in the future.")}</Typography>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16">
      <Container>
        <div className="mb-10">
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} counts={counts} />
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Typography variant="h4" className="text-neutral-300">{t("该分类下暂无作品", "No works in this category")}</Typography>
          </div>
        ) : (
          <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
            {filtered.map((w) => <WorkCard key={w.slug} work={w} />)}
          </Grid>
        )}
      </Container>
    </section>
  );
}
