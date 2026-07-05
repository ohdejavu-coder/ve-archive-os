"use client";

import { usePersona } from "@/lib/identity/context";
import { useLang } from "@/lib/language/context";
import type { WorkCategory } from "@/types/work";

interface CategoryFilterProps {
  active: WorkCategory | "all";
  onChange: (category: WorkCategory | "all") => void;
  counts: Record<WorkCategory | "all", number>;
}

const L: Record<WorkCategory | "all", { zh: string; en: string }> = {
  all: { zh: "全部", en: "All" },
  photography: { zh: "摄影", en: "Photo" },
  film: { zh: "影视", en: "Film" },
  ai: { zh: "AI", en: "AI" },
  "new-media": { zh: "新媒体", en: "New Media" },
};

export function CategoryFilter({ active, onChange, counts }: CategoryFilterProps) {
  const persona = usePersona();
  const { lang } = useLang();
  const t = (zh: string, en: string) => lang === "en" ? en : zh;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {Object.entries(L).map(([id, lbl]) => {
        const catId = id as WorkCategory | "all";
        if (catId !== "all" && (counts[catId] ?? 0) === 0) return null;
        const isActive = active === catId;
        return (
          <button
            key={id}
            onClick={() => onChange(catId)}
            className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
            style={isActive ? { backgroundColor: persona.accentColor, color: "#fff" } : {}}
          >
            {t(lbl.zh, lbl.en)}
            {(counts[catId] ?? 0) > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-medium"
                style={isActive ? { backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" } : {}}>
                {counts[catId]}
              </span>
            )}
            {!isActive && <span className="text-neutral-600 dark:text-neutral-400" />}
          </button>
        );
      })}
    </div>
  );
}
