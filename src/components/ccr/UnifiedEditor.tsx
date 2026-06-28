"use client";

import { useState } from "react";
import { useSiteContent } from "@/lib/content/ContentContext";
import { WorksEditor } from "./WorksEditor";
import { Save, RotateCcw, Check, Download } from "lucide-react";
import { exportOverridesAsJSON } from "@/lib/content/overrides";
import type { PersonaId } from "@/types/persona";
import type { Work } from "@/types/work";

const ALL_PERSONAS: PersonaId[] = ["default", "photographer", "ai", "director", "freelance"];
const PLABELS: Record<PersonaId, string> = {
  default: "默认", photographer: "摄影", ai: "AI 创作", director: "导演", freelance: "商业",
};

type Tab = "persona" | "resume" | "pages" | "site" | "works";

/**
 * Unified CCR Editor.
 *
 * One page. All content. Live editing.
 * Changes save to localStorage and reflect on site instantly.
 * No file operations. No copy-paste. No JSON exports.
 */
export function UnifiedEditor({ works = [] }: { works?: Work[] }) {
  const { site, personas, resume, pages, setField, resetAll } = useSiteContent();
  const [tab, setTab] = useState<Tab>("persona");
  const [saved, setSaved] = useState(false);
  const [activePersona, setActivePersona] = useState<PersonaId>("default");

  function handleSave() {
    // Content is already saved to localStorage on every keystroke via setField.
    // This button is a confirmation UI affordance.
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleExport() {
    const json = exportOverridesAsJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ve-archive-content-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "persona", label: "身份内容" },
    { id: "resume", label: "简历" },
    { id: "pages", label: "页面文字" },
    { id: "site", label: "网站设置" },
    { id: "works", label: "作品管理" },
  ];

  const persona = personas.find((p) => p.id === activePersona) ?? personas[0];

  return (
    <div className="space-y-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">创作者控制中心</h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            修改内容即时生效 · 自动保存到本地浏览器 ·{' '}
            <button onClick={handleExport} className="underline hover:text-neutral-700">
              导出备份
            </button>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity"
          >
            {saved ? <Check size={14} /> : <Save size={14} />}
            {saved ? "已保存" : "保存"}
          </button>
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <RotateCcw size={14} /> 重置全部
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative -mb-px ${
              tab === t.id
                ? "text-neutral-900 dark:text-neutral-100 border-b-2 border-[var(--red)]"
                : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ---- PERSONA TAB ---- */}
      {tab === "persona" && (
        <div className="space-y-6">
          {/* Persona selector */}
          <div className="flex gap-2">
            {ALL_PERSONAS.map((pid) => (
              <button
                key={pid}
                onClick={() => setActivePersona(pid)}
                className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                  activePersona === pid
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
                }`}
              >
                {PLABELS[pid]}
              </button>
            ))}
          </div>

          {/* Persona fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldRow
              label="Hero 标题"
              path={`personas.${activePersona}.heroHeadline`}
              value={(persona.heroHeadline ?? "") as string}
              onChange={(v) => setField(`personas.${activePersona}.heroHeadline`, v)}
              placeholder="用影像讲述值得被看见的故事"
            />
            <FieldRow
              label="Hero 副标题"
              path={`personas.${activePersona}.heroSubtitle`}
              value={(persona.heroSubtitle ?? "") as string}
              onChange={(v) => setField(`personas.${activePersona}.heroSubtitle`, v)}
              placeholder="摄影 · 光影 · 故事"
            />
            <FieldRow
              label="个人声明（中文）"
              path={`personas.${activePersona}.personalStatement`}
              value={(persona.personalStatement ?? "") as string}
              onChange={(v) => setField(`personas.${activePersona}.personalStatement`, v)}
              placeholder="你的个人主张..."
              textarea
            />
            <FieldRow
              label="Personal Statement (EN)"
              path={`personas.${activePersona}.personalStatementEn`}
              value={(persona.personalStatementEn ?? "") as string}
              onChange={(v) => setField(`personas.${activePersona}.personalStatementEn`, v)}
              placeholder="Your statement..."
              textarea
            />
            <FieldRow
              label="中文名"
              path={`personas.${activePersona}.name`}
              value={persona.name}
              onChange={(v) => setField(`personas.${activePersona}.name`, v)}
            />
            <FieldRow
              label="English Name"
              path={`personas.${activePersona}.nameEn`}
              value={persona.nameEn}
              onChange={(v) => setField(`personas.${activePersona}.nameEn`, v)}
            />
            <FieldRow
              label="简介"
              path={`personas.${activePersona}.description`}
              value={persona.description}
              onChange={(v) => setField(`personas.${activePersona}.description`, v)}
            />
            <FieldRow
              label="头像路径"
              path={`personas.${activePersona}.profilePhoto`}
              value={(persona.profilePhoto ?? "") as string}
              onChange={(v) => setField(`personas.${activePersona}.profilePhoto`, v)}
              placeholder="/media/profile/avatar.jpg"
            />
          </div>

          <p className="text-xs text-neutral-400 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded border border-neutral-200 dark:border-neutral-800">
            ↑ 修改后点击「保存」，然后回到首页刷新即可看到更新。
          </p>
        </div>
      )}

      {/* ---- RESUME TAB ---- */}
      {tab === "resume" && (
        <div className="space-y-6 max-w-2xl">
          <h3 className="font-semibold">基本信息</h3>
          <div className="grid grid-cols-2 gap-4">
            <FieldRow label="姓名" path="resume.basics.name" value={resume.basics.name} onChange={(v) => setField("resume.basics.name", v)} />
            <FieldRow label="Name (EN)" path="resume.basics.nameEn" value={resume.basics.nameEn} onChange={(v) => setField("resume.basics.nameEn", v)} />
            <FieldRow label="职位" path="resume.basics.title" value={resume.basics.title} onChange={(v) => setField("resume.basics.title", v)} />
            <FieldRow label="Title (EN)" path="resume.basics.titleEn" value={resume.basics.titleEn} onChange={(v) => setField("resume.basics.titleEn", v)} />
            <FieldRow label="地点" path="resume.basics.location" value={resume.basics.location} onChange={(v) => setField("resume.basics.location", v)} />
            <FieldRow label="邮箱" path="resume.basics.email" value={resume.basics.email} onChange={(v) => setField("resume.basics.email", v)} />
            <FieldRow label="网站" path="resume.basics.website" value={(resume.basics.website ?? "") as string} onChange={(v) => setField("resume.basics.website", v)} />
            <FieldRow label="电话" path="resume.basics.phone" value={(resume.basics.phone ?? "") as string} onChange={(v) => setField("resume.basics.phone", v)} />
          </div>
          <div className="space-y-3">
            <FieldRow label="个人简介 (中文)" path="resume.summary" value={resume.summary} onChange={(v) => setField("resume.summary", v)} textarea />
            <FieldRow label="Summary (EN)" path="resume.summaryEn" value={resume.summaryEn} onChange={(v) => setField("resume.summaryEn", v)} textarea />
          </div>

          <h3 className="font-semibold pt-4">工作经历</h3>
          {resume.experience.map((exp, i) => (
            <div key={i} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-medium">#{i + 1}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FieldRow label="公司" path={`resume.experience.${i}.company`} value={exp.company} onChange={(v) => setField(`resume.experience.${i}.company`, v)} compact />
                <FieldRow label="Company (EN)" path={`resume.experience.${i}.companyEn`} value={exp.companyEn} onChange={(v) => setField(`resume.experience.${i}.companyEn`, v)} compact />
                <FieldRow label="职位" path={`resume.experience.${i}.role`} value={exp.role} onChange={(v) => setField(`resume.experience.${i}.role`, v)} compact />
                <FieldRow label="Role (EN)" path={`resume.experience.${i}.roleEn`} value={exp.roleEn} onChange={(v) => setField(`resume.experience.${i}.roleEn`, v)} compact />
              </div>
              <div className="flex gap-4">
                <FieldRow label="开始日期" path={`resume.experience.${i}.startDate`} value={exp.startDate} onChange={(v) => setField(`resume.experience.${i}.startDate`, v)} compact />
                <FieldRow label="结束日期" path={`resume.experience.${i}.endDate`} value={exp.endDate ?? ""} onChange={(v) => setField(`resume.experience.${i}.endDate`, v)} compact />
              </div>
              <FieldRow label="描述" path={`resume.experience.${i}.description`} value={exp.description} onChange={(v) => setField(`resume.experience.${i}.description`, v)} textarea compact />
            </div>
          ))}
        </div>
      )}

      {/* ---- PAGES TAB ---- */}
      {tab === "pages" && (
        <div className="space-y-6 max-w-2xl">
          <h3 className="font-semibold">关于页面</h3>
          <p className="text-xs text-neutral-400">编辑 content/pages/about.mdx 的内容。支持 Markdown 格式。</p>
          <textarea
            className="w-full px-4 py-3 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--red)]/30 focus:border-[var(--red)]"
            rows={12}
            value={pages.about}
            onChange={(e) => setField("pages.about", e.target.value)}
          />

          <h3 className="font-semibold pt-4">联系页面</h3>
          <p className="text-xs text-neutral-400">编辑 content/pages/contact.mdx 的内容。</p>
          <textarea
            className="w-full px-4 py-3 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--red)]/30 focus:border-[var(--red)]"
            rows={8}
            value={pages.contact}
            onChange={(e) => setField("pages.contact", e.target.value)}
          />
        </div>
      )}

      {/* ---- SITE TAB ---- */}
      {tab === "site" && (
        <div className="space-y-4 max-w-2xl">
          <FieldRow label="网站标题" path="site.title" value={site.title} onChange={(v) => setField("site.title", v)} />
          <FieldRow label="标语" path="site.tagline" value={site.tagline} onChange={(v) => setField("site.tagline", v)} />
          <FieldRow label="默认身份" path="site.defaultPersona" value={site.defaultPersona} onChange={(v) => setField("site.defaultPersona", v)} />
          <FieldRow label="页脚文本" path="site.footer" value={site.footer} onChange={(v) => setField("site.footer", v)} textarea />
        </div>
      )}

      {/* ---- WORKS TAB ---- */}
      {tab === "works" && (
        <WorksEditor works={works} />
      )}
    </div>
  );
}

/* ---- Reusable field row ---- */
function FieldRow({
  label,
  path,
  value,
  onChange,
  placeholder,
  textarea,
  compact,
}: {
  label: string;
  path: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  compact?: boolean;
}) {
  const inputClass = `w-full rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--red)]/30 focus:border-[var(--red)] transition-colors ${
    compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2"
  }`;

  return (
    <div>
      <label className="block text-[11px] font-medium text-neutral-500 mb-1">
        {label}
        <code className="ml-2 text-[10px] text-neutral-300 font-normal">{path}</code>
      </label>
      {textarea ? (
        <textarea
          className={inputClass + " resize-y"}
          rows={compact ? 2 : 3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
