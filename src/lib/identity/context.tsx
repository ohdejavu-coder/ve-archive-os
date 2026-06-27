"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { IdentityState } from "./types";
import type { Persona } from "@/types/persona";

const IdentityContext = createContext<IdentityState | null>(null);

/**
 * Provides identity context to all child components.
 * This is a Client Component — wrap server-rendered content.
 */
export function IdentityProvider({
  identity,
  children,
}: {
  identity: IdentityState;
  children: ReactNode;
}) {
  const value = useMemo(() => identity, [identity]);
  return (
    <IdentityContext.Provider value={value}>
      {children}
    </IdentityContext.Provider>
  );
}

/**
 * Hook: access the current identity state.
 * Must be used within IdentityProvider.
 */
export function useIdentity(): IdentityState {
  const ctx = useContext(IdentityContext);
  if (!ctx) {
    throw new Error("useIdentity() must be used within <IdentityProvider>");
  }
  return ctx;
}

/**
 * Convenience hook: just the current persona.
 */
export function usePersona(): Persona {
  return useIdentity().persona;
}

/**
 * Convenience hook: accent color for current persona.
 */
export function useAccentColor(): string {
  return useIdentity().persona.accentColor;
}
