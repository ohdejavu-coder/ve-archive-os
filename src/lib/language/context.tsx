"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Lang = "zh" | "en";

interface LangState {
  lang: Lang;
  toggle: () => void;
  /** Pick CN or EN field */
  t: (zh: string, en: string) => string;
}

const LangContext = createContext<LangState | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("ve-lang");
    if (saved === "en") setLang("en");
  }, []);

  function toggle() {
    setLang((prev) => {
      const next = prev === "zh" ? "en" : "zh";
      localStorage.setItem("ve-lang", next);
      return next;
    });
  }

  function t(zh: string, en: string) {
    return lang === "en" ? en : zh;
  }

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangState {
  const ctx = useContext(LangContext);
  if (!ctx) {
    // SSR fallback: return default Chinese
    return { lang: "zh", toggle: () => {}, t: (zh: string) => zh };
  }
  return ctx;
}
