"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePersona } from "@/lib/identity/context";
import { cn } from "@/lib/utils/cn";
import type { PersonaNavigationItem } from "@/types/persona";

/**
 * Main navigation. Items come from persona config or site default.
 */
export function Navigation() {
  const persona = usePersona();
  const pathname = usePathname();

  const items: PersonaNavigationItem[] =
    persona.navigation.length > 0
      ? persona.navigation
      : [
          { label: "作品", labelEn: "Works", href: "/works" },
          { label: "简历", labelEn: "Resume", href: "/resume" },
          { label: "关于", labelEn: "About", href: "/about" },
          { label: "联系", labelEn: "Contact", href: "/contact" },
        ];

  return (
    <nav className="flex items-center gap-1" aria-label="主导航">
      {items.map((item) => {
        const fullHref = `/${persona.id}${item.href}`;
        const isActive = pathname === fullHref;

        return (
          <Link
            key={item.href}
            href={fullHref}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium",
              "transition-colors duration-200",
              isActive
                ? "text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
