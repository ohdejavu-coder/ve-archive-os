"use client";

import { useState } from "react";
import { ExportPanel } from "./ExportPanel";
import { Trash2 } from "lucide-react";
import type { Persona } from "@/types/persona";

interface Props {
  persona: Persona;
  index: number;
}

const SKILL_OPTIONS = ["摄影", "后期处理", "灯光", "构图", "AI 创作", "Prompt Engineering", "AI 影像", "流程自动化", "导演", "叙事", "影视制作", "后期", "项目管理", "新媒体"];
const SECTION_OPTIONS = ["experience", "skills", "education", "awards"];

export function PersonaEditorForm({ persona, index }: Props) {
  const [data, setData] = useState<Persona>(structuredClone(persona));
  const [showExport, setShowExport] = useState(false);

  function update(fn: (d: Persona) => void) {
    setData((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
  }

  const inputClass = "w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent";
  const chipClass = "px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer select-none";

  return (
    <div className="space-y-6 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.accentColor }} />
        <h3 className="text-lg font-semibold">{persona.name} / {persona.nameEn}</h3>
        <code className="text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
          {persona.id}.json
        </code>
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">中文名</label>
          <input className={inputClass} value={data.name} onChange={(e) => update((d) => { d.name = e.target.value; })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">English Name</label>
          <input className={inputClass} value={data.nameEn} onChange={(e) => update((d) => { d.nameEn = e.target.value; })} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-neutral-500 mb-1">简介</label>
          <input className={inputClass} value={data.description} onChange={(e) => update((d) => { d.description = e.target.value; })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">主色</label>
          <div className="flex items-center gap-2">
            <input className={inputClass + " w-24"} value={data.accentColor} onChange={(e) => update((d) => { d.accentColor = e.target.value; })} />
            <span className="w-6 h-6 rounded border" style={{ backgroundColor: data.accentColor }} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">头像路径</label>
          <input className={inputClass} value={data.profilePhoto ?? ""} onChange={(e) => update((d) => { d.profilePhoto = e.target.value; })} />
        </div>
      </div>

      {/* Hero text */}
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Hero 标题</label>
          <input className={inputClass} value={data.heroHeadline ?? ""} onChange={(e) => update((d) => { d.heroHeadline = e.target.value; })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Hero 副标题</label>
          <input className={inputClass} value={data.heroSubtitle ?? ""} onChange={(e) => update((d) => { d.heroSubtitle = e.target.value; })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">个人声明 (中文)</label>
          <textarea className={inputClass} rows={2} value={data.personalStatement ?? ""} onChange={(e) => update((d) => { d.personalStatement = e.target.value; })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Personal Statement (EN)</label>
          <textarea className={inputClass} rows={2} value={data.personalStatementEn ?? ""} onChange={(e) => update((d) => { d.personalStatementEn = e.target.value; })} />
        </div>
      </div>

      {/* Emphasized skills */}
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-2">强调技能</label>
        <div className="flex flex-wrap gap-1.5">
          {SKILL_OPTIONS.map((skill) => {
            const selected = data.emphasizedSkills.includes(skill);
            return (
              <span key={skill}
                className={chipClass}
                style={selected ? { backgroundColor: data.accentColor, color: "#fff", borderColor: data.accentColor } : { borderColor: "var(--tw-color-neutral-200)" }}
                onClick={() => update((d) => {
                  if (selected) d.emphasizedSkills = d.emphasizedSkills.filter((s) => s !== skill);
                  else d.emphasizedSkills.push(skill);
                })}
              >
                {skill}
              </span>
            );
          })}
        </div>
      </div>

      {/* Resume sections */}
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-2">简历模块</label>
        <div className="flex flex-wrap gap-1.5">
          {SECTION_OPTIONS.map((sec) => {
            const selected = data.resumeSections.includes(sec);
            return (
              <span key={sec}
                className={chipClass}
                style={selected ? { backgroundColor: data.accentColor, color: "#fff", borderColor: data.accentColor } : { borderColor: "var(--tw-color-neutral-200)" }}
                onClick={() => update((d) => {
                  if (selected) d.resumeSections = d.resumeSections.filter((s) => s !== sec);
                  else d.resumeSections.push(sec);
                })}
              >
                {sec}
              </span>
            );
          })}
        </div>
      </div>

      {/* Featured works */}
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">精选作品 IDs</label>
        <input className={inputClass} value={data.featuredWorkIds.join(", ")}
          placeholder="example-01, example-02"
          onChange={(e) => update((d) => { d.featuredWorkIds = e.target.value.split(",").map((s) => s.trim()).filter(Boolean); })} />
      </div>

      {/* Navigation */}
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-2">自定义导航 ({data.navigation.length})</label>
        <div className="space-y-2">
          {data.navigation.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input className={inputClass + " flex-1"} placeholder="标签" value={item.label} onChange={(e) => update((d) => { d.navigation[i].label = e.target.value; })} />
              <input className={inputClass + " flex-1"} placeholder="Label (EN)" value={item.labelEn} onChange={(e) => update((d) => { d.navigation[i].labelEn = e.target.value; })} />
              <input className={inputClass + " w-28"} placeholder="/path" value={item.href} onChange={(e) => update((d) => { d.navigation[i].href = e.target.value; })} />
              <button onClick={() => update((d) => { d.navigation.splice(i, 1); })}
                className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
        <button onClick={() => setShowExport(!showExport)} className="px-4 py-2 rounded-md text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
          {showExport ? "隐藏导出" : "导出 JSON"}
        </button>
        {showExport && (
          <div className="mt-3">
            <ExportPanel data={data} targetPath={`content/personas/${data.id}.json`} label={data.name} />
          </div>
        )}
      </div>
    </div>
  );
}
