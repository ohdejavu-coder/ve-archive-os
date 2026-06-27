import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { loadSiteConfig } from "@/lib/content/loader";

/**
 * Minimal footer. Shows tagline and copyright.
 * Content comes from site.json — editable without code changes.
 */
export function Footer() {
  const site = loadSiteConfig();

  return (
    <footer className="mt-auto py-8">
      <Container>
        <Divider className="mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
          <p>{site.footer}</p>
          <div className="flex items-center gap-4">
            {site.social.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.url.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
