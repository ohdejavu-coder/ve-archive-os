import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-auto py-8 border-t border-neutral-200 dark:border-neutral-800">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <span>&copy; 2026 VE Archive. All rights reserved.</span>

          {/* Persona quick links */}
          <div className="flex items-center gap-3">
            <Link href="/photographer" className="hover:text-[var(--red)] transition-colors">摄影</Link>
            <Link href="/ai" className="hover:text-[var(--red)] transition-colors">AI</Link>
            <Link href="/director" className="hover:text-[var(--red)] transition-colors">导演</Link>
            <Link href="/freelance" className="hover:text-[var(--red)] transition-colors">商业</Link>
          </div>

          <div className="flex items-center gap-4">
            <a href="mailto:hello@vearchive.com" className="hover:text-[var(--red)] transition-colors">Email</a>
            <a href="https://github.com/ohdejavu-coder" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--red)] transition-colors">GitHub</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
