"use client";

import { useState } from "react";
import { ExportPanel } from "./ExportPanel";
import { Plus, Trash2 } from "lucide-react";
import type { SiteConfig } from "@/types/content";

interface Props {
  site: SiteConfig;
}

/**
 * Interactive site settings editor.
 * Edit site title, tagline, footer, navigation, social links.
 */
export function SettingsEditorForm({ site }: Props) {
  const [data, setData] = useState<SiteConfig>(structuredClone(site));
  const [showExport, setShowExport] = useState(false);

  function update<T>(fn: (d: SiteConfig) => T) {
    setData((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
  }

  const inputClass = "w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent";

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Site basics */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">网站基本信息</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">网站标题</label>
            <input className={inputClass} value={data.title}
              onChange={(e) => update((d) => { d.title = e.target.value; })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">标语 (Tagline)</label>
            <input className={inputClass} value={data.tagline}
              onChange={(e) => update((d) => { d.tagline = e.target.value; })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">默认身份</label>
            <select className={inputClass} value={data.defaultPersona}
              onChange={(e) => update((d) => { d.defaultPersona = e.target.value as SiteConfig["defaultPersona"]; })}>
              <option value="default">default</option>
              <option value="photographer">photographer</option>
              <option value="ai">ai</option>
              <option value="director">director</option>
              <option value="freelance">freelance</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">页脚文本</label>
            <input className={inputClass} value={data.footer}
              onChange={(e) => update((d) => { d.footer = e.target.value; })} />
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">导航 ({data.navigation.length})</h3>
        {data.navigation.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input className={inputClass + " flex-1"} placeholder="中文标签" value={item.label}
              onChange={(e) => update((d) => { d.navigation[i].label = e.target.value; })} />
            <input className={inputClass + " flex-1"} placeholder="English label" value={item.labelEn}
              onChange={(e) => update((d) => { d.navigation[i].labelEn = e.target.value; })} />
            <input className={inputClass + " w-32"} placeholder="路径" value={item.href}
              onChange={(e) => update((d) => { d.navigation[i].href = e.target.value; })} />
            <button onClick={() => update((d) => { d.navigation.splice(i, 1); })}
              className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={() => update((d) => { d.navigation.push({ label: "", labelEn: "", href: "" }); })}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
          <Plus size={12} /> 添加导航项
        </button>
      </section>

      {/* Social links */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">社交链接 ({data.social.length})</h3>
        {data.social.map((link, i) => (
          <div key={i} className="flex items-center gap-2">
            <input className={inputClass + " flex-1"} placeholder="标签" value={link.label}
              onChange={(e) => update((d) => { d.social[i].label = e.target.value; })} />
            <input className={inputClass + " flex-1"} placeholder="URL" value={link.url}
              onChange={(e) => update((d) => { d.social[i].url = e.target.value; })} />
            <input className={inputClass + " w-24"} placeholder="图标" value={link.icon}
              onChange={(e) => update((d) => { d.social[i].icon = e.target.value; })} />
            <button onClick={() => update((d) => { d.social.splice(i, 1); })}
              className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={() => update((d) => { d.social.push({ label: "", url: "", icon: "" }); })}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
          <Plus size={12} /> 添加链接
        </button>
      </section>

      {/* Export */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <button onClick={() => setShowExport(!showExport)}
          className="px-5 py-2.5 rounded-lg text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
          {showExport ? "隐藏导出" : "导出 JSON"}
        </button>
        {showExport && (
          <div className="mt-4">
            <ExportPanel data={data} targetPath="content/site.json" label="网站设置" />
          </div>
        )}
      </div>
    </div>
  );
}
