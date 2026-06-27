import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Adds hover effect */
  hover?: boolean;
  /** Adds padding */
  padded?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  hover = false,
  padded = true,
  onClick,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg",
        padded && "p-6",
        hover &&
          "transition-all duration-200 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
