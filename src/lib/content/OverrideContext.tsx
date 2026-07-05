"use client";

import { createContext, useContext, type ReactNode } from "react";

const OverrideContext = createContext<Record<string, string>>({});

/**
 * Provides cookie-based content overrides to all children.
 * Used by PersonaShell to pass ve-json cookie values down.
 */
export function OverrideProvider({
  children,
  overrides = {},
}: {
  children: ReactNode;
  overrides?: Record<string, string>;
}) {
  return (
    <OverrideContext.Provider value={overrides}>
      {children}
    </OverrideContext.Provider>
  );
}

export function useOverrides(): Record<string, string> {
  return useContext(OverrideContext);
}
