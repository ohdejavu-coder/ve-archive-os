"use client";

// ============================================================
// Content Override Engine
//
// All site content flows through this layer.
// localStorage overrides > file-based defaults.
//
// This is what makes "all text editable from the website" possible.
// No file operations needed. No copy-paste. No JSON exports.
// Edit in CCR → saved to localStorage → site reflects instantly.
// ============================================================

const STORAGE_KEY = "ve-archive-overrides";

export interface ContentOverrides {
  resume?: Record<string, unknown>;
  personas?: Record<string, Record<string, unknown>>;
  works?: Record<string, Record<string, unknown>>;
  site?: Record<string, unknown>;
  pages?: Record<string, string>; // about, contact
}

/** Load all overrides from localStorage */
export function loadOverrides(): ContentOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Save all overrides to localStorage */
export function saveOverrides(overrides: ContentOverrides): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

/** Get a specific override value with dot-path access */
export function getOverride(path: string): unknown {
  const overrides = loadOverrides();
  const parts = path.split(".");
  let current: unknown = overrides;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/** Set a specific override value with dot-path access */
export function setOverride(path: string, value: unknown): void {
  const overrides = loadOverrides();
  const parts = path.split(".");
  let current: Record<string, unknown> = overrides as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
  saveOverrides(overrides);
}

/** Delete a specific override */
export function deleteOverride(path: string): void {
  const overrides = loadOverrides();
  const parts = path.split(".");
  let current: Record<string, unknown> = overrides as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) return;
    current = current[parts[i]] as Record<string, unknown>;
  }
  delete current[parts[parts.length - 1]];
  saveOverrides(overrides);
}

/** Merge override with file-default value */
export function useOverride<T>(path: string, defaultValue: T): T {
  const override = getOverride(path);
  if (override !== undefined && override !== null) {
    // Handle nested object merge for personas
    if (typeof override === "object" && typeof defaultValue === "object" && !Array.isArray(override)) {
      return { ...defaultValue, ...override } as T;
    }
    return override as T;
  }
  return defaultValue;
}

/** Reset all overrides (dangerous - confirm first) */
export function resetAllOverrides(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/** Export all overrides as downloadable JSON files (for backup/portability) */
export function exportOverridesAsJSON(): string {
  return JSON.stringify(loadOverrides(), null, 2);
}
