"use client";

import Link from "next/link";
import { usePersona } from "@/lib/identity/context";
import { useLang } from "@/lib/language/context";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/utils/cn";
import type { Work } from "@/types/work";

interface WorkCardProps {
  work: Work;
}

/**
 * Work card — thumbnail + metadata.
 * Clean and scannable. HR should grasp the work in seconds.
 */
const CAT: Record<string, { zh: string; en: string }> = {
  photography: { zh: "摄影", en: "Photo" },
  film: { zh: "影视", en: "Film" },
  ai: { zh: "AI", en: "AI" },
  "new-media": { zh: "新媒体", en: "New Media" },
};

export function WorkCard({ work }: WorkCardProps) {
  const persona = usePersona();
  const { lang } = useLang();
  const t = (zh: string, en: string) => lang === "en" ? en : zh;

  return (
    <Link
      href={`/${persona.id}/works/${work.slug}`}
      className={cn(
        "group block rounded-lg overflow-hidden",
        "border border-neutral-200 dark:border-neutral-800",
        "bg-white dark:bg-neutral-900",
        "transition-all duration-200",
        "hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700"
      )}
    >
      {/* Thumbnail */}
      <div className="aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        {work.thumbnail ? (
          <img
            src={work.thumbnail}
            alt={work.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-600">
            <Typography variant="caption">{work.titleEn}</Typography>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Badge color={persona.accentColor}>
            {t(CAT[work.category]?.zh ?? work.category, CAT[work.category]?.en ?? work.category)}
          </Badge>
          <Typography variant="caption">{work.year}</Typography>
        </div>
        <Typography variant="h4" className="group-hover:opacity-70 transition-opacity">
          {work.title}
        </Typography>
        <Typography variant="body-sm" className="text-neutral-500 line-clamp-2">
          {work.titleEn}
        </Typography>
      </div>
    </Link>
  );
}
