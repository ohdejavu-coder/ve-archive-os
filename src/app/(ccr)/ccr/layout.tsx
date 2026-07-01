import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "编辑 — VE Archive OS",
  description: "内容编辑",
  robots: "noindex, nofollow",
};

export default function CCRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="h-12 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-6">
        <a href="/" className="text-sm font-semibold tracking-tight uppercase hover:opacity-60">VE Archive</a>
        <span className="ml-auto text-xs text-neutral-400">编辑模式</span>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
