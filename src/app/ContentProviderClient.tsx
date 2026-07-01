"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/lib/language/context";
import { CursorScript } from "@/components/layout/CursorScript";
import type { IdentityState } from "@/lib/identity/types";

/**
 * Client shell — provides language context + cursor + layout.
 * Identity and language come from the server via props.
 * No client-side state for core navigation.
 */
export function ContentProviderClient({
  children,
  lang,
}: {
  children: ReactNode;
  lang: "zh" | "en";
  identity?: IdentityState;
}) {
  return (
    <LanguageProvider initialLang={lang}>
      {children}
    </LanguageProvider>
  );
}
