import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-auto py-8 border-t border-neutral-200 dark:border-neutral-800">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <span>&copy; 2026 VE Archive. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="mailto:hello@vearchive.com" className="hover:text-[var(--red)] transition-colors">
              Email
            </a>
            <a href="https://github.com/ohdejavu-coder" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--red)] transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
