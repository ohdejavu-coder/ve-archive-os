"use client";

import { type ReactNode } from "react";
import { LanguageProvider } from "@/lib/language/context";
import { IdentityProvider } from "@/lib/identity/context";
import { OverrideProvider } from "@/lib/content/OverrideContext";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import type { IdentityState } from "@/lib/identity/types";

export function PersonaShell({
  children,
  identity,
  lang,
  contentOverrides = {},
}: {
  children: ReactNode;
  identity: IdentityState;
  lang: "zh" | "en";
  contentOverrides?: Record<string, string>;
}) {
  // Merge cookie overrides into persona for Hero/resume components
  const mergedPersona = {
    ...identity.persona,
    heroHeadline: contentOverrides.heroHeadline ?? identity.persona.heroHeadline,
    heroHeadlineEn: contentOverrides.heroHeadlineEn ?? identity.persona.heroHeadlineEn,
    heroSubtitle: contentOverrides.heroSubtitle ?? identity.persona.heroSubtitle,
    heroSubtitleEn: contentOverrides.heroSubtitleEn ?? identity.persona.heroSubtitleEn,
    personalStatement: contentOverrides.personalStatement ?? identity.persona.personalStatement,
    personalStatementEn: contentOverrides.personalStatementEn ?? identity.persona.personalStatementEn,
    profilePhoto: contentOverrides.profilePhoto ?? identity.persona.profilePhoto,
  };
  const mergedIdentity = { ...identity, persona: mergedPersona };

  const { persona } = mergedIdentity;
  const { allPersonas: all } = identity;
  // Filter personas based on visibility cookie
  const visible = contentOverrides.personas_visible
    ? new Set(contentOverrides.personas_visible.split(","))
    : new Set(["default", "photographer", "ai", "director", "freelance"]);
  const allPersonas = all.filter((p) => visible.has(p.id));
  const t = (zh: string, en: string) => (lang === "en" ? en : zh);

  const navItems = persona.navigation.length > 0
    ? persona.navigation
    : [
        { label: "作品", labelEn: "Works", href: "/works" },
        { label: "简历", labelEn: "Resume", href: "/resume" },
        { label: "关于", labelEn: "About", href: "/about" },
        { label: "联系", labelEn: "Contact", href: "/contact" },
      ];

  const langSuffix = lang === "en" ? "?lang=en" : "";

  return (
    <LanguageProvider lang={lang}>
      <IdentityProvider identity={mergedIdentity}>
        <OverrideProvider overrides={contentOverrides}>
        <header className="border-b border-neutral-200 dark:border-neutral-800 border-solid">
          <Container>
            <div className="flex items-center justify-between h-14">
              <Link
                href={`/${persona.id}${langSuffix}`}
                className="flex items-center gap-2 text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 hover:opacity-60 transition-opacity uppercase"
              >
                VE Archive <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--red)" }} />
              </Link>
              <nav className="flex items-center gap-1">
                <Link href={`/${persona.id}${langSuffix}`} className="px-3 py-1.5 rounded-md text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors">
                  {t("主页", "Home")}
                </Link>
                {navItems.map((item) => (
                  <Link key={item.href} href={`/${persona.id}${item.href}${langSuffix}`} className="px-3 py-1.5 rounded-md text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors">
                    {t(item.label, item.labelEn)}
                  </Link>
                ))}
                <Link href="/tools/resume-builder" className="px-3 py-1.5 rounded-md text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors">
                  {t("工具", "Tools")}
                </Link>
              </nav>
              <div className="flex items-center gap-3">
                <details className="relative">
                  <summary className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium hover:bg-neutral-100 text-neutral-600 cursor-pointer" style={{ listStyle: "none" }}>
                    <span>{t(persona.name, persona.nameEn)}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </summary>
                  <div className="absolute right-0 mt-1 w-40 py-1 rounded-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg z-50">
                    {allPersonas.map((p) => (
                      <Link key={p.id} href={`/${p.id}${langSuffix}`} className={`flex items-center justify-between px-3 py-2 text-sm hover:bg-neutral-50 ${p.id === persona.id ? "bg-neutral-50" : ""}`}>
                        <span>{t(p.name, p.nameEn)}</span>
                        {p.id === persona.id && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--red)" }} />}
                      </Link>
                    ))}
                  </div>
                </details>
                <div className="w-px h-4 bg-neutral-200" />
                <div className="flex items-center gap-1 px-2 py-1.5 rounded-sm text-xs font-medium uppercase text-neutral-500">
                  <a href="?lang=zh" className={lang === "zh" ? "text-[var(--red)]" : "text-neutral-400 hover:text-neutral-600"}>中文</a>
                  <span className="text-neutral-300">|</span>
                  <a href="?lang=en" className={lang === "en" ? "text-[var(--red)]" : "text-neutral-400 hover:text-neutral-600"}>EN</a>
                </div>
              </div>
            </div>
          </Container>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="mt-auto py-8 border-t border-neutral-200 dark:border-neutral-800">
          <Container>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
              <span>&copy; 2026 VE Archive. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <a href="mailto:ohdejavu@163.com" className="hover:text-[var(--red)] transition-colors">Email</a>
                <a href="https://github.com/ohdejavu-coder" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--red)] transition-colors">GitHub</a>
              </div>
            </div>
          </Container>
        </footer>
        <ScrollToTop />
        </OverrideProvider>
      </IdentityProvider>
    </LanguageProvider>
  );
}
