"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CursorScript } from "@/components/layout/CursorScript";
import { LanguageProvider } from "@/lib/language/context";

// Flat localStorage key → value store for all editable content.
const STORE_KEY = "ve-content";

function load(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { const r = localStorage.getItem(STORE_KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}
function save(s: Record<string, string>) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch {}
}
function reset() {
  try { localStorage.removeItem(STORE_KEY); } catch {}
}

type Section = "content" | "resume" | "pages" | "site";

interface SectionDef { id: Section; label: string; desc: string; }

const SECTIONS: SectionDef[] = [
  { id: "content", label: "首页内容", desc: "Hero 标题、声明、头像" },
  { id: "resume", label: "基本信息", desc: "姓名、职位、邮箱、简介" },
  { id: "pages", label: "页面文字", desc: "关于页、联系页" },
  { id: "site", label: "网站设置", desc: "标题、页脚" },
];

export default function CCRPage() {
  const [section, setSection] = useState<Section>("content");
  const [store, setStore] = useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => { setStore(load()); }, []);

  function update(key: string, val: string) {
    setStore((prev) => {
      const next = { ...prev };
      if (val) next[key] = val;
      else delete next[key];
      save(next);
      return next;
    });
    setSavedAt(Date.now());
  }

  function handleReset() {
    if (!confirm("清除所有编辑？不可撤销。")) return;
    reset();
    setStore({});
    setSavedAt(Date.now());
  }

  return (
    <LanguageProvider lang="zh">
      <CursorScript />
      <div className="min-h-screen flex bg-white dark:bg-neutral-950">
        {/* ---- Sidebar ---- */}
        <aside className="w-56 shrink-0 border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-neutral-50/50 dark:bg-neutral-900/30">
          <div className="h-12 flex items-center px-4 border-b border-neutral-200 dark:border-neutral-800">
            <Link href="/" className="text-sm font-semibold tracking-tight hover:opacity-60 uppercase">VE Archive</Link>
          </div>
          <nav className="flex-1 p-3 space-y-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                  section === s.id
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                <div>{s.label}</div>
                <div className="text-xs opacity-50 mt-0.5">{s.desc}</div>
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
            <button onClick={handleReset} className="w-full text-left px-3 py-2 rounded-sm text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              重置全部编辑
            </button>
            <Link href="/" className="block px-3 py-2 rounded-sm text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
              ← 返回网站
            </Link>
          </div>
        </aside>

        {/* ---- Content area ---- */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 shrink-0 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6 bg-white dark:bg-neutral-950">
            <h2 className="text-sm font-semibold">内容编辑</h2>
            {savedAt && (
              <span className="text-xs text-neutral-400">
                已保存 {new Date(savedAt).toLocaleTimeString("zh-CN")}
              </span>
            )}
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            <SectionContent section={section} store={store} update={update} />
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}

/* ================================================================
   Section content renderers
   ================================================================ */

function SectionContent({ section, store, update }: { section: Section; store: Record<string, string>; update: (k: string, v: string) => void }) {
  switch (section) {
    case "content": return <ContentSection store={store} update={update} />;
    case "resume": return <ResumeSection store={store} update={update} />;
    case "pages": return <PagesSection store={store} update={update} />;
    case "site": return <SiteSection store={store} update={update} />;
    default: return null;
  }
}

function Field({ label, value, onChange, placeholder, textarea }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean }) {
  const cls = "w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent transition-colors";
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-500 mb-1">{label}</label>
      {textarea ? (
        <textarea className={cls} rows={4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input className={cls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

function ContentSection({ store, update }: { store: Record<string, string>; update: (k: string, v: string) => void }) {
  return (
    <div className="max-w-2xl space-y-5">
      <h3 className="text-lg font-semibold">首页 Hero 内容</h3>
      <p className="text-sm text-neutral-500">编辑后去首页刷新即可看到。所有身份共享同一份内容。</p>
      <Field label="Hero 标题" value={store.heroHeadline ?? ""} onChange={(v) => update("heroHeadline", v)} placeholder="用影像讲述值得被看见的故事" />
      <Field label="Hero 副标题" value={store.heroSubtitle ?? ""} onChange={(v) => update("heroSubtitle", v)} placeholder="摄影 · 影视 · AI 创作 · 新媒体" />
      <Field label="个人声明（中文）" value={store.personalStatement ?? ""} onChange={(v) => update("personalStatement", v)} placeholder="我是一名拥有电影制作背景的视觉创作者…" textarea />
      <Field label="个人声明（英文）" value={store.personalStatementEn ?? ""} onChange={(v) => update("personalStatementEn", v)} placeholder="I am a visual creator…" textarea />
      <Field label="头像图片路径" value={store.profilePhoto ?? ""} onChange={(v) => update("profilePhoto", v)} placeholder="/media/profile/avatar.jpg" />
    </div>
  );
}

function ResumeSection({ store, update }: { store: Record<string, string>; update: (k: string, v: string) => void }) {
  return (
    <div className="max-w-2xl space-y-5">
      <h3 className="text-lg font-semibold">基本信息</h3>
      <p className="text-sm text-neutral-500">姓名、职位、联系方式。</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="姓名" value={store["resume_basics_name"] ?? ""} onChange={(v) => update("resume_basics_name", v)} placeholder="创作者姓名" />
        <Field label="Name (EN)" value={store["resume_basics_nameEn"] ?? ""} onChange={(v) => update("resume_basics_nameEn", v)} placeholder="Your Name" />
        <Field label="职位" value={store["resume_basics_title"] ?? ""} onChange={(v) => update("resume_basics_title", v)} placeholder="摄影师 / 导演" />
        <Field label="Title (EN)" value={store["resume_basics_titleEn"] ?? ""} onChange={(v) => update("resume_basics_titleEn", v)} placeholder="Photographer / Director" />
        <Field label="地点" value={store["resume_basics_location"] ?? ""} onChange={(v) => update("resume_basics_location", v)} placeholder="中国 · 上海" />
        <Field label="邮箱" value={store["resume_basics_email"] ?? ""} onChange={(v) => update("resume_basics_email", v)} placeholder="hello@vearchive.com" />
        <Field label="电话" value={store["resume_basics_phone"] ?? ""} onChange={(v) => update("resume_basics_phone", v)} placeholder="手机号码" />
        <Field label="网站" value={store["resume_basics_website"] ?? ""} onChange={(v) => update("resume_basics_website", v)} placeholder="https://..." />
      </div>
      <Field label="个人简介（中文）" value={store["resume_summary"] ?? ""} onChange={(v) => update("resume_summary", v)} placeholder="拥有电影制作专业背景的视觉创作者…" textarea />
      <Field label="简介 (EN)" value={store["resume_summaryEn"] ?? ""} onChange={(v) => update("resume_summaryEn", v)} placeholder="A visual creator…" textarea />
    </div>
  );
}

function PagesSection({ store, update }: { store: Record<string, string>; update: (k: string, v: string) => void }) {
  return (
    <div className="max-w-2xl space-y-6">
      <h3 className="text-lg font-semibold">关于页面</h3>
      <p className="text-sm text-neutral-500">Markdown 格式。</p>
      <textarea className="w-full px-4 py-3 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent" rows={10}
        value={store.page_about ?? ""} onChange={(e) => update("page_about", e.target.value)}
        placeholder="# 关于我&#10;&#10;我是一名..." />
      <h3 className="text-lg font-semibold pt-4">联系页面</h3>
      <p className="text-sm text-neutral-500">Markdown 格式。</p>
      <textarea className="w-full px-4 py-3 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent" rows={10}
        value={store.page_contact ?? ""} onChange={(e) => update("page_contact", e.target.value)}
        placeholder="# 联系方式&#10;&#10;欢迎合作..." />
    </div>
  );
}

function SiteSection({ store, update }: { store: Record<string, string>; update: (k: string, v: string) => void }) {
  return (
    <div className="max-w-2xl space-y-5">
      <h3 className="text-lg font-semibold">网站设置</h3>
      <Field label="网站标题" value={store.site_title ?? ""} onChange={(v) => update("site_title", v)} placeholder="VE Archive" />
      <Field label="页脚文本" value={store.site_footer ?? ""} onChange={(v) => update("site_footer", v)} placeholder="© 2026 VE Archive" />
    </div>
  );
}
