"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePersona, useIdentity } from "@/lib/identity/context";
import { useLang } from "@/lib/language/context";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function PersonaDropdown() {
  const persona = usePersona();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { allPersonas } = useIdentity();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
        aria-expanded={open}
      >
        <span>
          {lang === "en" ? persona.nameEn : persona.name}
        </span>
        <ChevronDown
          size={12}
          className={cn("transition-transform duration-150", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 w-40 py-1 rounded-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg z-50"
          role="listbox"
        >
          {allPersonas.map((p) => (
            <Link
              key={p.id}
              href={`/${p.id}`}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm transition-colors",
                "hover:bg-neutral-50 dark:hover:bg-neutral-800",
                p.id === persona.id && "bg-neutral-50 dark:bg-neutral-800/50"
              )}
              role="option"
              aria-selected={p.id === persona.id}
            >
              <span>{lang === "en" ? p.nameEn : p.name}</span>
              {p.id === persona.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)]" />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
