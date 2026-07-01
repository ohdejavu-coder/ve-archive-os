"use client";

import { useState } from "react";

/**
 * Reads ve-content localStorage synchronously on first render.
 * Returns [value, setter]. No useEffect = no flash of old content.
 */
export function useStoredField(key: string, fallback: string): [string, (v: string) => void] {
  const [value, setValue] = useState<string>(() => {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = localStorage.getItem("ve-content");
      if (raw) {
        const store = JSON.parse(raw) as Record<string, string>;
        if (store[key] !== undefined) return store[key];
      }
    } catch {}
    return fallback;
  });

  return [value, setValue];
}
