"use client";

import { useState, useEffect } from "react";

/**
 * Reads ve-content localStorage. Returns [value, setter].
 * Reads synchronously from localStorage on mount via useEffect —
 * this ensures it runs AFTER React hydration, avoiding SSR override.
 */
export function useStoredField(key: string, fallback: string): [string, (v: string) => void] {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ve-content");
      if (raw) {
        const store = JSON.parse(raw) as Record<string, string>;
        if (store[key] !== undefined) {
          setValue(store[key]);
        }
      }
    } catch {}
  }, [key]);

  return [value, setValue];
}
