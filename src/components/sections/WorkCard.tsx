"use client";

import Link from "next/link";
import { usePersona } from "@/lib/identity/context";
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
export function WorkCard({ work }: WorkCardProps) {
  const persona = usePersona();

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
            {work.category === "photography" && "摄影"}
            {work.category === "film" && "影视"}
            {work.category === "ai" && "AI"}
            {work.category === "new-media" && "新媒体"}
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
