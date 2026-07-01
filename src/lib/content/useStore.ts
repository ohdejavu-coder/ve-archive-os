"use client";

import { useState, useEffect } from "react";

/**
 * Hook: read a value from localStorage content store.
 * Returns [value, setter]. Setter writes immediately to localStorage + updates state.
 * Fallback is used when no value exists in the store.
 */
export function useStoreField(key: string, fallback: string): [string, (v: string) => void] {
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

  function update(v: string) {
    setValue(v);
    try {
      const raw = localStorage.getItem("ve-content");
      const store = raw ? (JSON.parse(raw) as Record<string, string>) : {};
      store[key] = v;
      localStorage.setItem("ve-content", JSON.stringify(store));
    } catch {}
  }

  return [value, update];
}
