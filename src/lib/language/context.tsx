"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

type Lang = "zh" | "en";

interface LangState {
  lang: Lang;
  toggle: () => void;
  t: (zh: string, en: string) => string;
}

const LangContext = createContext<LangState>({
  lang: "zh",
  toggle: () => {},
  t: (zh: string) => zh,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ve-lang");
      if (saved === "en") setLang("en");
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next = prev === "zh" ? "en" : "zh";
      try { localStorage.setItem("ve-lang", next); } catch {}
      return next;
    });
  }, []);

  const t = useCallback(
    (zh: string, en: string) => (lang === "en" ? en : zh),
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangState {
  return useContext(LangContext);
}
