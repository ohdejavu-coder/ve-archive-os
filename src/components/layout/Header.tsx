import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Navigation } from "./Navigation";
import { PersonaSwitcher } from "./PersonaSwitcher";

/**
 * Site header. Clean and restrained — per Principle 05.
 * Fixed height, no sticky behavior by default (avoids visual noise).
 */
export function Header() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Left: Site title */}
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 hover:opacity-70 transition-opacity"
          >
            VE Archive
          </Link>

          {/* Center: Navigation */}
          <Navigation />

          {/* Right: Persona switcher */}
          <PersonaSwitcher />
        </div>
      </Container>
    </header>
  );
}
