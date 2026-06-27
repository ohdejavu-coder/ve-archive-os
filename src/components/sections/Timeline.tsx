import { Typography } from "@/components/ui/Typography";
import type { ResumeExperience, ResumeEducation } from "@/types/content";

/**
 * Timeline component for resume experience and education.
 * Clean vertical timeline — scannable by HR.
 */
interface TimelineProps {
  items: (ResumeExperience | ResumeEducation)[];
  type: "experience" | "education";
}

export function Timeline({ items, type }: TimelineProps) {
  if (items.length === 0) {
    return (
      <Typography variant="body" className="text-neutral-400">
        暂无记录
      </Typography>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800" />

      <div className="space-y-8">
        {items.map((item, i) => {
          const isExperience = "role" in item;
          return (
            <div key={i} className="relative pl-6">
              {/* Dot */}
              <div className="absolute left-0 top-1.5 -translate-x-1/2 w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600 ring-2 ring-white dark:ring-neutral-950" />

              {/* Date */}
              <Typography variant="caption" className="mb-1">
                {item.startDate} — {item.endDate ?? "至今"}
              </Typography>

              {/* Title */}
              <Typography variant="h4">
                {isExperience
                  ? (item as ResumeExperience).role
                  : (item as ResumeEducation).degree}
              </Typography>

              {/* Institution / Company */}
              <Typography variant="body-sm" className="text-neutral-500 mt-0.5">
                {isExperience
                  ? (item as ResumeExperience).company
                  : (item as ResumeEducation).institution}
                {isExperience
                  ? ""
                  : ` · ${(item as ResumeEducation).field}`}
              </Typography>

              {/* Description */}
              {"description" in item && item.description && (
                <Typography variant="body-sm" className="mt-2 text-neutral-600 dark:text-neutral-400">
                  {item.description}
                </Typography>
              )}

              {/* Highlights */}
              {isExperience &&
                (item as ResumeExperience).highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {(item as ResumeExperience).highlights.map((h, j) => (
                      <li key={j}>
                        <Typography variant="body-sm" className="text-neutral-500">
                          · {h}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
