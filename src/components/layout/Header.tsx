import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Navigation } from "./Navigation";
import { PersonaDropdown } from "./PersonaDropdown";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 bg-[var(--bg)]">
      <Container>
        <div className="flex items-center justify-between h-14">
          {/* Left: brand */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 hover:opacity-60 transition-opacity uppercase"
          >
            VE Archive
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)]" />
          </Link>

          {/* Center: nav */}
          <Navigation />

          {/* Right: persona + language */}
          <div className="flex items-center gap-3">
            <PersonaDropdown />
            <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" />
            <LanguageSwitcher />
          </div>
        </div>
      </Container>
    </header>
  );
}
