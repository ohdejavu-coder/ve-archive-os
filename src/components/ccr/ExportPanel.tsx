"use client";

import { useState } from "react";
import { Check, Copy, FileJson, FileText } from "lucide-react";

interface ExportPanelProps {
  /** JSON to display (mutually exclusive with mdx) */
  data?: unknown;
  /** MDX string to display (mutually exclusive with data) */
  mdx?: string;
  /** Label for the output type */
  label?: string;
  /** File path hint — shown to user as copy target */
  targetPath: string;
  /** Format: "json" or "mdx" */
  format?: "json" | "mdx";
}

/**
 * Reusable export panel for the Creator Control Room.
 *
 * Takes form output (JSON object or MDX string), prettifies it,
 * displays in a copyable code block, and tells the user
 * which file to paste it into.
 *
 * This is the bridge between "edit in browser" and "save to file"
 * in CodeSandbox's file-based architecture.
 */
export function ExportPanel({
  data,
  mdx,
  label = "导出内容",
  targetPath,
  format = "json",
}: ExportPanelProps) {
  const [copied, setCopied] = useState(false);

  const output =
    format === "mdx" && mdx !== undefined
      ? mdx
      : JSON.stringify(data, null, 2);

  function handleCopy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 text-sm">
          {format === "json" ? (
            <FileJson size={14} className="text-neutral-400" />
          ) : (
            <FileText size={14} className="text-neutral-400" />
          )}
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {label}
          </span>
          <code className="text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
            {targetPath}
          </code>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
        >
          {copied ? (
            <>
              <Check size={12} /> 已复制
            </>
          ) : (
            <>
              <Copy size={12} /> 复制
            </>
          )}
        </button>
      </div>

      {/* Code block */}
      <pre className="p-4 text-xs font-mono text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-950 overflow-x-auto max-h-[400px] overflow-y-auto leading-relaxed whitespace-pre">
        {output}
      </pre>

      {/* Instruction */}
      <div className="px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-900/30 text-xs text-amber-700 dark:text-amber-300">
        复制上方内容 → 在左侧文件树找到 <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">{targetPath}</code> → 粘贴替换 → 保存。刷新页面即可看到更新。
      </div>
    </div>
  );
}
