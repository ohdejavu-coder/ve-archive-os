import { cn } from "@/lib/utils/cn";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "body-sm"
  | "caption"
  | "label";

interface TypographyProps {
  variant?: TypographyVariant;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
  /** If true, use serif font for cinematic headings */
  cinematic?: boolean;
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight",
  h2: "text-3xl md:text-4xl font-semibold leading-tight tracking-tight",
  h3: "text-2xl md:text-3xl font-semibold leading-snug",
  h4: "text-xl md:text-2xl font-medium leading-snug",
  body: "text-base leading-relaxed",
  "body-sm": "text-sm leading-relaxed",
  caption: "text-xs text-neutral-500 leading-normal",
  label: "text-sm font-medium uppercase tracking-wider text-neutral-500",
};

const defaultElements: Record<TypographyVariant, string> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  "body-sm": "p",
  caption: "span",
  label: "span",
};

export function Typography({
  variant = "body",
  as,
  className,
  children,
  cinematic = false,
}: TypographyProps) {
  const Component = as ?? defaultElements[variant];

  return (
    <Component
      className={cn(
        variantStyles[variant],
        cinematic && "font-serif tracking-wide",
        className
      )}
    >
      {children}
    </Component>
  );
}
