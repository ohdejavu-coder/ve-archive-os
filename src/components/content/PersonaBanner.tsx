"use client";

import { usePersona } from "@/lib/identity/context";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/utils/cn";

/**
 * Subtle banner showing current persona context.
 * Appears on pages where persona context is relevant (works, resume).
 * Per Principle 05: professional, restrained.
 */
export function PersonaBanner() {
  const persona = usePersona();

  if (persona.id === "default") return null;

  return (
    <div
      className="border-b border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/30"
      style={{
        borderLeft: `3px solid ${persona.accentColor}`,
      }}
    >
      <div className={cn("py-3 px-4 flex items-center gap-2 text-sm")}>
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: persona.accentColor }}
        />
        <span className="text-neutral-500">
          当前展示身份：
        </span>
        <span className="font-medium">{persona.name}</span>
        <span className="text-neutral-400">·</span>
        <span className="text-neutral-400 text-xs">{persona.nameEn}</span>
      </div>
    </div>
  );
}
