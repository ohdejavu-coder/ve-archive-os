"use client";

import { type ReactNode, useState, useEffect } from "react";
import { LanguageProvider } from "@/lib/language/context";
import { IdentityProvider } from "@/lib/identity/context";
import { CursorScript } from "./CursorScript";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import type { IdentityState } from "@/lib/identity/types";

/**
 * Persona page shell.
 *
 * Language is determined by the URL query param `?lang=en`.
 * Read client-side from window.location — no server searchParams dependency.
 *
 * All core interactivity uses native HTML:
 * - Language: <a href="?lang=xx"> links (full page reload)
 * - Persona dropdown: <details>/<summary> (zero JS)
 * - Navigation: plain <a> links
 */
export function PersonaShell({
  children,
  identity,
}: {
  children: ReactNode;
  identity: IdentityState;
}) {
  const [lang, setLang] = useState<"zh" | "en">("zh");

  // Read lang from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang");
    if (langParam === "en") setLang("en");
  }, []);

  const { persona, allPersonas } = identity;
  const t = (zh: string, en: string) => (lang === "en" ? en : zh);

  const navItems = persona.navigation.length > 0
    ? persona.navigation
    : [
        { label: "作品", labelEn: "Works", href: "/works" },
        { label: "简历", labelEn: "Resume", href: "/resume" },
        { label: "关于", labelEn: "About", href: "/about" },
        { label: "联系", labelEn: "Contact", href: "/contact" },
      ];

  return (
    <LanguageProvider lang={lang}>
      <IdentityProvider identity={identity}>
        <CursorScript />

        {/* ---- Header ---- */}
        <header className="border-b border-neutral-200 dark:border-neutral-800 bg-[var(--bg)]">
          <Container>
            <div className="flex items-center justify-between h-14">
              {/* Left: brand */}
              <Link
                href={`/${persona.id}${lang === "en" ? "?lang=en" : ""}`}
                className="flex items-center gap-2 text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 hover:opacity-60 transition-opacity uppercase"
              >
                VE Archive
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)]" />
              </Link>

              {/* Center: nav */}
              <nav className="flex items-center gap-1">
                <Link
                  href={`/${persona.id}${lang === "en" ? "?lang=en" : ""}`}
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  {t("主页", "Home")}
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={`/${persona.id}${item.href}${lang === "en" ? "?lang=en" : ""}`}
                    className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  >
                    {t(item.label, item.labelEn)}
                  </Link>
                ))}
              </nav>

              {/* Right: persona dropdown + language */}
              <div className="flex items-center gap-3">
                {/* Persona: HTML <details> — zero JS */}
                <details className="relative">
                  <summary className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span>{t(persona.name, persona.nameEn)}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </summary>
                  <div className="absolute right-0 mt-1 w-40 py-1 rounded-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg z-50">
                    {allPersonas.map((p) => (
                      <Link
                        key={p.id}
                        href={`/${p.id}${lang === "en" ? "?lang=en" : ""}`}
                        className={`flex items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                          p.id === persona.id ? "bg-neutral-50 dark:bg-neutral-800/50" : ""
                        }`}
                      >
                        <span>{t(p.name, p.nameEn)}</span>
                        {p.id === persona.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)]" />
                        )}
                      </Link>
                    ))}
                  </div>
                </details>

                <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" />

                {/* Language: simple <a> links — no JS, full page reload */}
                <div className="flex items-center gap-1 px-2 py-1.5 rounded-sm text-xs font-medium tracking-wide uppercase text-neutral-500">
                  <a
                    href="?lang=zh"
                    className={lang === "zh" ? "text-[var(--red)]" : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"}
                  >
                    中文
                  </a>
                  <span className="text-neutral-300 dark:text-neutral-600">|</span>
                  <a
                    href="?lang=en"
                    className={lang === "en" ? "text-[var(--red)]" : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"}
                  >
                    EN
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </header>

        {/* ---- Content ---- */}
        <main className="flex-1">{children}</main>

        {/* ---- Footer ---- */}
        <footer className="mt-auto py-8 border-t border-neutral-200 dark:border-neutral-800">
          <Container>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
              <span>&copy; 2026 VE Archive. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <a href="mailto:hello@vearchive.com" className="hover:text-[var(--red)] transition-colors">Email</a>
                <a href="https://github.com/ohdejavu-coder" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--red)] transition-colors">GitHub</a>
              </div>
            </div>
          </Container>
        </footer>
      </IdentityProvider>
    </LanguageProvider>
  );
}
