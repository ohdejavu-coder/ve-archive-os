"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePersona } from "@/lib/identity/context";
import { cn } from "@/lib/utils/cn";
import type { PersonaNavigationItem } from "@/types/persona";

/**
 * Main navigation.
 * "主页" is always the first item.
 * Remaining items come from persona config or site defaults.
 */
export function Navigation() {
  const persona = usePersona();
  const pathname = usePathname();

  const personaItems: PersonaNavigationItem[] =
    persona.navigation.length > 0
      ? persona.navigation
      : [
          { label: "作品", labelEn: "Works", href: "/works" },
          { label: "简历", labelEn: "Resume", href: "/resume" },
          { label: "关于", labelEn: "About", href: "/about" },
          { label: "联系", labelEn: "Contact", href: "/contact" },
        ];

  // Always prepend "主页"
  const items: PersonaNavigationItem[] = [
    { label: "主页", labelEn: "Home", href: "" },
    ...personaItems,
  ];

  return (
    <nav className="flex items-center gap-1" aria-label="主导航">
      {items.map((item) => {
        // Home link is the persona root
        const fullHref =
          item.href === ""
            ? `/${persona.id}`
            : `/${persona.id}${item.href}`;
        const isActive = pathname === fullHref;

        return (
          <Link
            key={item.label}
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
