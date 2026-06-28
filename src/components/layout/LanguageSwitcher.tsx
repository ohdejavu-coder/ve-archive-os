"use client";

import { useLang } from "@/lib/language/context";

export function LanguageSwitcher() {
  const { lang, toggle } = useLang();

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
    >
      <span className={lang === "zh" ? "text-[var(--red)]" : "text-neutral-400"}>
        中文
      </span>
      <span className="text-neutral-300 dark:text-neutral-600">|</span>
      <span className={lang === "en" ? "text-[var(--red)]" : "text-neutral-400"}>
        EN
      </span>
    </button>
  );
}
