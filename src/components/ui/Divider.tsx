import { cn } from "@/lib/utils/cn";

interface DividerProps {
  className?: string;
  /** Adds a label in the center of the divider */
  label?: string;
}

export function Divider({ className, label }: DividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
        <span className="text-xs text-neutral-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
      </div>
    );
  }

  return (
    <hr
      className={cn(
        "border-neutral-200 dark:border-neutral-800",
        className
      )}
    />
  );
}
