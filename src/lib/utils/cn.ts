import { clsx, type ClassValue } from "clsx";

/**
 * Merges class names using clsx.
 * Use for conditional Tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
