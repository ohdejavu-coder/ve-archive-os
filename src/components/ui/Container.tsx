import { cn } from "@/lib/utils/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Default: "page". Use "full" for full-width, "narrow" for reading. */
  size?: "page" | "full" | "narrow";
  as?: React.ElementType;
}

const sizeStyles = {
  page: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
  full: "w-full px-4 sm:px-6 lg:px-8",
  narrow: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8",
};

export function Container({
  children,
  className,
  size = "page",
  as = "div",
}: ContainerProps) {
  const Component = as;
  return (
    <Component className={cn(sizeStyles[size], className)}>
      {children}
    </Component>
  );
}
