"use client";

import { type ReactNode } from "react";
import { LanguageProvider } from "@/lib/language/context";
import { CursorScript } from "@/components/layout/CursorScript";
import Link from "next/link";

export function CCRShell({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider lang="zh">
      <CursorScript />
      <div className="min-h-screen bg-[var(--bg)]">
        <header className="h-12 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-6">
          <Link href="/" className="text-sm font-semibold tracking-tight uppercase hover:opacity-60">
            VE Archive
          </Link>
          <span className="ml-auto text-xs text-neutral-400">编辑模式</span>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </LanguageProvider>
  );
}
