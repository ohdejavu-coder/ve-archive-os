"use client";

import { useState, type ReactNode } from "react";

interface EditorSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function EditorSection({ title, defaultOpen, children }: EditorSectionProps) {
  const [open, setOpen] = useState(defaultOpen ?? true);

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 transition-colors text-left"
      >
        <span className="text-[14px] font-semibold text-neutral-800">{title}</span>
        <svg
          className={`w-4 h-4 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div className="p-4 border-t border-neutral-200">{children}</div>}
    </div>
  );
}
