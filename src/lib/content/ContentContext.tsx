"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { loadOverrides, saveOverrides, type ContentOverrides } from "./overrides";
import type { SiteConfig, Resume, ResumeBasics } from "@/types/content";
import type { Persona } from "@/types/persona";

// ---- Content Context ----
// The single source of truth for ALL user-editable content at runtime.
// Server passes file-defaults as initial value.
// Client overlays localStorage edits on top.
// CCR writes → updates state → site re-renders instantly.

interface ContentState {
  site: SiteConfig;
  personas: Persona[];
  resume: Resume;
  pages: { about: string; contact: string };
  /** Raw overrides hash for the CCR to display/edit */
  overrides: ContentOverrides;
  /** Update a single content field */
  setField: (path: string, value: unknown) => void;
  /** Reset all edits to file defaults */
  resetAll: () => void;
}

const ContentContext = createContext<ContentState | null>(null);

export function ContentProvider({
  children,
  initialSite,
  initialPersonas,
  initialResume,
  initialPages,
}: {
  children: ReactNode;
  initialSite: SiteConfig;
  initialPersonas: Persona[];
  initialResume: Resume;
  initialPages: { about: string; contact: string };
}) {
  const [overrides, setOverrides] = useState<ContentOverrides>({});

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadOverrides();
    if (Object.keys(stored).length > 0) {
      setOverrides(stored);
    }
  }, []);

  const setField = useCallback((path: string, value: unknown) => {
    setOverrides((prev) => {
      const parts = path.split(".");
      const next = { ...prev };
      let current: Record<string, unknown> = next as Record<string, unknown>;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]] || typeof current[parts[i]] !== "object") {
          current[parts[i]] = {} as Record<string, unknown>;
        }
        current = { ...(current[parts[i]] as Record<string, unknown>) } as Record<string, unknown>;
      }
      current[parts[parts.length - 1]] = value;
      // Save immediately
      saveOverrides(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setOverrides({});
    saveOverrides({});
    if (typeof window !== "undefined") localStorage.removeItem("ve-archive-overrides");
  }, []);

  // Merge overrides into site config
  const site = merge(initialSite, overrides.site) as unknown as SiteConfig;
  const resume = merge(initialResume, overrides.resume) as unknown as Resume;
  const personas = mergePersonas(initialPersonas, overrides.personas);
  const pages = {
    about: (overrides.pages?.about as string) ?? initialPages.about,
    contact: (overrides.pages?.contact as string) ?? initialPages.contact,
  };

  return (
    <ContentContext.Provider value={{ site, personas, resume, pages, overrides, setField, resetAll }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useSiteContent(): ContentState {
  const ctx = useContext(ContentContext);
  // Return safe fallback during SSR / before hydration
  if (!ctx) {
    return {
      site: { title: "", tagline: "", defaultPersona: "default", footer: "", social: [], navigation: [] } as unknown as SiteConfig,
      personas: [],
      resume: { basics: {} as Resume["basics"], summary: "", summaryEn: "", experience: [], education: [], skills: [], languages: [], awards: [] } as unknown as Resume,
      pages: { about: "", contact: "" },
      overrides: {},
      setField: () => {},
      resetAll: () => {},
    };
  }
  return ctx;
}

/** Convenience: get a single content field with auto-path */
export function useContentField(path: string, defaultValue?: unknown) {
  const { overrides, setField } = useSiteContent();
  const parts = path.split(".");
  let overrideVal: unknown = overrides;
  for (const part of parts) {
    if (overrideVal == null || typeof overrideVal !== "object") { overrideVal = undefined; break; }
    overrideVal = (overrideVal as Record<string, unknown>)[part];
  }
  const value = overrideVal ?? defaultValue;
  const update = useCallback((v: unknown) => setField(path, v), [path, setField]);
  return { value, update };
}

// ---- Helpers ----

function merge<T extends Record<string, unknown>>(base: T, override: unknown): T {
  if (!override || typeof override !== "object") return base;
  return { ...base, ...(override as Record<string, unknown>) } as T;
}

function mergePersonas(base: Persona[], overrides: Record<string, Record<string, unknown>> | undefined): Persona[] {
  if (!overrides) return base;
  return base.map((p) => {
    if (overrides[p.id]) {
      return { ...p, ...overrides[p.id] } as unknown as Persona;
    }
    return p;
  });
}
