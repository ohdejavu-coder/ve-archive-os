import { cn } from "@/lib/utils/cn";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  /** Columns at different breakpoints. Default: 1 / 2 / 3 */
  cols?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: "sm" | "md" | "lg";
  as?: React.ElementType;
}

// Tailwind v4 requires complete class names for tree-shaking — no dynamic construction.
// We map valid column counts to their classes.
const colMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const smColMap: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

const mdColMap: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

const lgColMap: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

const xlColMap: Record<number, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
};

const gapStyles = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

export function Grid({
  children,
  className,
  cols = { base: 1, md: 2, lg: 3 },
  gap = "md",
  as = "div",
}: GridProps) {
  const Component = as;

  const colClasses = [
    cols.base && colMap[cols.base],
    cols.sm && smColMap[cols.sm],
    cols.md && mdColMap[cols.md],
    cols.lg && lgColMap[cols.lg],
    cols.xl && xlColMap[cols.xl],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={cn("grid", colClasses, gapStyles[gap], className)}>
      {children}
    </Component>
  );
}
