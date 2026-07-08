"use client";

import { useState, useEffect, useCallback } from "react";
import { EditorPanel } from "./EditorPanel";
import { A4Preview } from "./A4Preview";
import { DEFAULT_DATA, type BuilderData } from "./defaultData";

const STORAGE_KEY = "ve-resume-builder";

function loadData(): BuilderData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as BuilderData;
  } catch {}
  return structuredClone(DEFAULT_DATA);
}

function saveData(data: BuilderData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function BuilderClient() {
  const [data, setData] = useState<BuilderData>(() => DEFAULT_DATA);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setData(loadData());
    setMounted(true);
  }, []);

  // Auto-save on every change
  useEffect(() => {
    if (mounted) saveData(data);
  }, [data, mounted]);

  const updateBasic = useCallback((key: string, value: string) => {
    setData((prev) => ({ ...prev, basics: { ...prev.basics, [key]: value } }));
  }, []);

  const reset = useCallback(() => {
    setData(structuredClone(DEFAULT_DATA));
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-neutral-100 overflow-hidden">
      {/* Left: Editor */}
      <div className="w-[42%] min-w-[380px] h-full overflow-y-auto border-r border-neutral-300 bg-white">
        <EditorPanel
          data={data}
          setData={setData}
          updateBasic={updateBasic}
          reset={reset}
        />
      </div>

      {/* Right: A4 Preview */}
      <div className="flex-1 h-full overflow-y-auto bg-neutral-200 p-6">
        <A4Preview data={data} />
      </div>
    </div>
  );
}
