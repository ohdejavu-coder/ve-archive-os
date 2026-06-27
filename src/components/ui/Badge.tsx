import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  /** Accent color override */
  color?: string;
}

export function Badge({ children, className, color }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
        "border border-neutral-200 dark:border-neutral-700",
        className
      )}
      style={color ? { borderColor: color, color, backgroundColor: `${color}15` } : undefined}
    >
      {children}
    </span>
  );
}
