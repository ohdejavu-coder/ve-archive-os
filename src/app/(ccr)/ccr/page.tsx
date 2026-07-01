"use client";

import { useState, useEffect } from "react";
import { readStore, setField, resetAll, type Store } from "@/lib/content/store";

// All editable fields in one place
const FIELDS = {
  hero: [
    { key: "heroHeadline", label: "Hero 标题", placeholder: "用影像讲述值得被看见的故事" },
    { key: "heroSubtitle", label: "Hero 副标题", placeholder: "摄影 · 影视 · AI 创作 · 新媒体" },
    { key: "personalStatement", label: "个人声明（中文）", placeholder: "我是一名拥有电影制作背景的视觉创作者…", textarea: true },
    { key: "personalStatementEn", label: "个人声明（英文）", placeholder: "I am a visual creator…", textarea: true },
    { key: "profilePhoto", label: "头像路径", placeholder: "/media/profile/avatar.jpg" },
  ],
  basics: [
    { key: "resume_basics_name", label: "姓名" },
    { key: "resume_basics_nameEn", label: "Name (EN)" },
    { key: "resume_basics_title", label: "职位" },
    { key: "resume_basics_titleEn", label: "Title (EN)" },
    { key: "resume_basics_location", label: "地点" },
    { key: "resume_basics_email", label: "邮箱" },
    { key: "resume_basics_website", label: "网站" },
  ],
  text: [
    { key: "resume_summary", label: "个人简介", textarea: true },
    { key: "page_about", label: "关于页面内容", textarea: true, rows: 8 },
    { key: "page_contact", label: "联系页面内容", textarea: true, rows: 6 },
  ],
  site: [
    { key: "site_title", label: "网站标题", placeholder: "VE Archive" },
    { key: "site_footer", label: "页脚文本" },
  ],
};

type FieldDef = { key: string; label: string; placeholder?: string; textarea?: boolean; rows?: number };

const inputStyle = "w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent";

export default function CCRPage() {
  const [store, setStore] = useState<Store>({});
  const [activeTab, setActiveTab] = useState("hero");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setStore(readStore());
  }, []);

  function update(key: string, value: string) {
    setField(key, value);
    setStore((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    if (!confirm("确定要清除所有编辑内容？此操作不可撤销。")) return;
    resetAll();
    setStore({});
    setMsg("已清除全部编辑。");
    setTimeout(() => setMsg(""), 3000);
  }

  const tabs = [
    { id: "hero", label: "首页内容" },
    { id: "basics", label: "基本信息" },
    { id: "text", label: "页面文字" },
    { id: "site", label: "网站设置" },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">内容编辑</h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            所有修改自动保存到浏览器。编辑完去首页刷新看效果。
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded text-sm border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          重置全部
        </button>
      </div>

      {msg && (
        <div className="p-3 rounded bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 text-sm text-green-700 dark:text-green-300">
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-200 dark:border-neutral-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors -mb-px ${
              activeTab === t.id
                ? "border-b-2 border-[var(--red)] text-neutral-900 dark:text-neutral-100"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {(FIELDS[activeTab as keyof typeof FIELDS] as FieldDef[]).map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-neutral-500 mb-1">{f.label}</label>
            {f.textarea ? (
              <textarea
                className={inputStyle}
                rows={f.rows ?? 3}
                value={store[f.key] ?? ""}
                onChange={(e) => update(f.key, e.target.value)}
                placeholder={f.placeholder}
              />
            ) : (
              <input
                className={inputStyle}
                value={store[f.key] ?? ""}
                onChange={(e) => update(f.key, e.target.value)}
                placeholder={f.placeholder}
              />
            )}
          </div>
        ))}
      </div>

      <div className="p-4 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 text-xs text-amber-700 dark:text-amber-300">
        编辑完 → 去首页或对应页面刷新 → 即可看到更新。所有数据保存在你的浏览器中，不会丢失。
      </div>
    </div>
  );
}
