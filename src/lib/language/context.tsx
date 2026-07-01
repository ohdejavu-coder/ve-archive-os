"use client";

import { createContext, useContext, type ReactNode } from "react";

type Lang = "zh" | "en";

interface LangState {
  lang: Lang;
  t: (zh: string, en: string) => string;
}

const LangContext = createContext<LangState>({
  lang: "zh",
  t: (zh: string) => zh,
});

/**
 * Provides current language to children.
 * The lang value comes from the SERVER (searchParams).
 * No toggle function — switching is done via URL with <a href="?lang=en">.
 */
export function LanguageProvider({
  children,
  lang,
}: {
  children: ReactNode;
  lang: Lang;
}) {
  const t = (zh: string, en: string) => (lang === "en" ? en : zh);

  return (
    <LangContext.Provider value={{ lang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangState {
  return useContext(LangContext);
}
