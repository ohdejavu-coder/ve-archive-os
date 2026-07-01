// ============================================================
// VE Archive Content Store
//
// Single localStorage key. Single get/set API.
// Used by BOTH the CCR (write) and public pages (read).
//
// Schema:
//   ve-content :: {
//     heroHeadline?: string
//     heroSubtitle?: string
//     personalStatement?: string
//     personalStatementEn?: string
//     heroHeadline_en?: string
//     ...
//     resume_basics_name?: string
//     ...
//     page_about?: string
//     page_contact?: string
//     site_title?: string
//     ...
//   }
// ============================================================

const KEY = "ve-content";

export type Store = Record<string, string>;

export function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

export function writeStore(store: Store): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // Storage full or private browsing — silently fail
  }
}

export function getField(key: string, fallback: string): string {
  const store = readStore();
  return store[key] !== undefined ? store[key] : fallback;
}

export function setField(key: string, value: string): void {
  const store = readStore();
  if (value) {
    store[key] = value;
  } else {
    delete store[key];
  }
  writeStore(store);
}

export function resetAll(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
