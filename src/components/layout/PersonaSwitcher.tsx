"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePersona, useIdentity } from "@/lib/identity/context";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

/**
 * Subtle dropdown to switch between personas.
 * Per Principle 05: restrained, professional, not flashy.
 */
export function PersonaSwitcher() {
  const persona = usePersona();
  const { allPersonas } = useIdentity();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
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
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm",
          "transition-colors duration-200",
          "hover:bg-neutral-100 dark:hover:bg-neutral-800",
          "border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-neutral-500 text-xs">
          {persona.nameEn}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-neutral-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 mt-1 w-48 py-1 rounded-lg",
            "bg-white dark:bg-neutral-900",
            "border border-neutral-200 dark:border-neutral-800",
            "shadow-lg",
            "z-50",
            "animate-in fade-in slide-in-from-top-2 duration-200"
          )}
          role="listbox"
        >
          {allPersonas.map((p) => (
            <Link
              key={p.id}
              href={`/${p.id}`}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-between px-4 py-2.5 text-sm",
                "transition-colors duration-100",
                "hover:bg-neutral-50 dark:hover:bg-neutral-800",
                p.id === persona.id &&
                  "bg-neutral-50 dark:bg-neutral-800/50"
              )}
              role="option"
              aria-selected={p.id === persona.id}
            >
              <span>{p.name}</span>
              <span className="text-xs text-neutral-400">{p.nameEn}</span>
              {p.id === persona.id && (
                <span
                  className="ml-2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: p.accentColor }}
                />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
