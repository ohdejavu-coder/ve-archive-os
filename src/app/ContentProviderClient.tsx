"use client";

import { type ReactNode } from "react";
import { LanguageProvider } from "@/lib/language/context";
import { CursorScript } from "@/components/layout/CursorScript";

export function ContentProviderClient({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      {children}
      <CursorScript />
    </LanguageProvider>
  );
}
