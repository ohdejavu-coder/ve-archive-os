"use client";

import { cn } from "@/lib/utils/cn";
import { usePersona } from "@/lib/identity/context";
import type { WorkCategory } from "@/types/work";

interface CategoryFilterProps {
  active: WorkCategory | "all";
  onChange: (category: WorkCategory | "all") => void;
  counts: Record<WorkCategory | "all", number>;
}

const categories: { id: WorkCategory | "all"; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "photography", label: "摄影" },
  { id: "film", label: "影视" },
  { id: "ai", label: "AI" },
  { id: "new-media", label: "新媒体" },
];

/**
 * Category filter bar for works grid.
 * Horizontal pills with count badges.
 * Animated active state — smooth indicator slide.
 */
export function CategoryFilter({ active, onChange, counts }: CategoryFilterProps) {
  const persona = usePersona();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((cat) => {
        const isActive = active === cat.id;
        const count = counts[cat.id] ?? 0;
        if (cat.id !== "all" && count === 0) return null;

        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={cn(
              "relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              isActive
                ? "text-white"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            )}
            style={
              isActive
                ? { backgroundColor: persona.accentColor }
                : undefined
            }
          >
            {cat.label}
            {count > 0 && (
              <span
                className={cn(
                  "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-medium",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
