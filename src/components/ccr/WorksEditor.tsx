"use client";

import { useState } from "react";
import { Check, Copy, Eye, Plus } from "lucide-react";
import type { Work, WorkCategory } from "@/types/work";
import type { PersonaId } from "@/types/persona";

interface Props {
  works: Work[];
}

const ALL_PERSONAS: PersonaId[] = ["default", "photographer", "ai", "director", "freelance"];
const PLABELS: Record<PersonaId, string> = {
  default: "默认",
  photographer: "摄影",
  ai: "AI",
  director: "导演",
  freelance: "商业",
};

export function WorksEditor({ works }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [copied, setCopied] = useState("");

  function blank(): Work {
    return {
      id: "", title: "", titleEn: "",
      category: "photography", tags: [], personas: ["default"],
      featured: false, thumbnail: "/media/works/NEW/thumb.jpg",
      media: [], year: new Date().getFullYear(),
      client: "", content: "", slug: "",
    };
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">作品管理</h2>
          <p className="text-sm text-neutral-500 mt-0.5">{works.length} 个作品</p>
        </div>
        <button onClick={() => { setEditing(null); setShowNew(true); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
          <Plus size={14} /> 新增作品
        </button>
      </div>

      {works.map((w) => {
        const open = editing === w.slug;
        return (
          <div key={w.slug} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <div className="w-20 h-14 rounded-md bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0">
                {w.thumbnail ? (
                  <img src={w.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[10px]">暂无图</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{w.title}</span>
                  <span className="text-xs text-neutral-400">{w.titleEn}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">{w.category}</span>
                  <span className="text-[11px] text-neutral-400">{w.year}</span>
                  {w.featured && <span className="text-[11px] text-amber-600">★</span>}
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-1">
                {ALL_PERSONAS.map((pid) => (
                  <span key={pid} className={`text-[10px] px-1.5 py-0.5 rounded border ${w.personas.includes(pid) ? "border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400" : "border-transparent text-neutral-300 dark:text-neutral-700"}`}>
                    {PLABELS[pid]}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setEditing(open ? null : w.slug)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${open ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"}`}>
                  {open ? "收起" : "编辑"}
                </button>
                <a href={`/default/works/${w.slug}`} target="_blank" className="px-2 py-1.5 rounded-md text-xs text-neutral-400 hover:text-neutral-600">
                  <Eye size={14} />
                </a>
              </div>
            </div>
            {open && <EditPanel work={w} onClose={() => setEditing(null)} onCopied={() => { setCopied(w.slug); setTimeout(() => setCopied(""), 2500); }} justCopied={copied === w.slug} />}
          </div>
        );
      })}

      {showNew && (
        <div className="rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-6">
          <EditPanel work={blank()} isNew onClose={() => setShowNew(false)} onCopied={() => { setCopied("new"); setTimeout(() => setCopied(""), 2500); }} justCopied={copied === "new"} />
        </div>
      )}

      <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
        <strong>保存方式：</strong>编辑 → 点「复制」→ 左侧文件树粘贴到 <code className="text-[11px] bg-neutral-200 dark:bg-neutral-700 px-1 rounded">content/works/YOUR-FILE.mdx</code> → 保存 → 刷新即可。
      </div>
    </div>
  );
}

function EditPanel({ work, isNew, onClose, onCopied, justCopied }: { work: Work; isNew?: boolean; onClose: () => void; onCopied: () => void; justCopied: boolean }) {
  const [data, setData] = useState<Work>(structuredClone(work));
  const [body, setBody] = useState(typeof work.content === "string" ? work.content : "");

  const ic = "w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent";
  const lc = "block text-[11px] font-medium text-neutral-500 mb-1";

  function mkMDX(): string {
    const fm: Record<string, unknown> = { id: data.id || data.slug || "", title: data.title, titleEn: data.titleEn, category: data.category, tags: data.tags, personas: data.personas, featured: data.featured, thumbnail: data.thumbnail, media: data.media, year: data.year };
    if (data.client) fm.client = data.client;
    let y = "---\n";
    for (const [k, v] of Object.entries(fm)) {
      if (v === null || v === undefined) continue;
      if (Array.isArray(v)) { y += `${k}:\n`; for (const item of v) y += `  - ${typeof item === "object" ? JSON.stringify(item) : `"${item}"`}\n`; }
      else if (typeof v === "boolean") y += `${k}: ${v}\n`;
      else if (typeof v === "number") y += `${k}: ${v}\n`;
      else y += `${k}: "${String(v)}"\n`;
    }
    return y + "---\n\n" + body;
  }

  return (
    <div className="border-t border-neutral-100 dark:border-neutral-800 p-4 space-y-4 bg-neutral-50/50 dark:bg-neutral-950/30">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className={lc}>{isNew ? "文件名（英文）" : "文件名"}</label>
          <div className="flex items-center gap-1"><input className={ic} value={data.slug} onChange={(e) => setData({ ...data, slug: e.target.value })} placeholder="my-work" /><span className="text-xs text-neutral-400">.mdx</span></div>
        </div>
        <div><label className={lc}>年份</label><input className={ic} type="number" value={data.year} onChange={(e) => setData({ ...data, year: Number(e.target.value) })} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={lc}>作品名称</label><input className={ic} value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} /></div>
        <div><label className={lc}>Title (EN)</label><input className={ic} value={data.titleEn} onChange={(e) => setData({ ...data, titleEn: e.target.value })} /></div>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <div><label className={lc}>分类</label><select className={ic + " w-28"} value={data.category} onChange={(e) => setData({ ...data, category: e.target.value as WorkCategory })}><option value="photography">摄影</option><option value="film">影视</option><option value="ai">AI</option><option value="new-media">新媒体</option></select></div>
        <div><label className={lc}>客户</label><input className={ic + " w-36"} value={data.client ?? ""} onChange={(e) => setData({ ...data, client: e.target.value || undefined })} /></div>
        <label className="flex items-center gap-2 pt-5 cursor-pointer"><input type="checkbox" checked={data.featured} onChange={(e) => setData({ ...data, featured: e.target.checked })} className="rounded" /><span className="text-sm">精选</span></label>
      </div>
      <div><label className={lc}>标签（逗号分隔）</label><input className={ic} value={data.tags.join(", ")} onChange={(e) => setData({ ...data, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="摄影, 城市" /></div>
      <div>
        <label className={lc}>展示身份</label>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {ALL_PERSONAS.map((pid) => {
            const a = data.personas.includes(pid);
            return (
              <button key={pid} onClick={() => setData({ ...data, personas: a ? data.personas.filter((p) => p !== pid) : [...data.personas, pid] })}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${a ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100" : "bg-white dark:bg-neutral-900 text-neutral-500 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"}`}>
                {PLABELS[pid]}{a ? " ✓" : ""}
              </button>
            );
          })}
        </div>
      </div>
      <div><label className={lc}>缩略图路径</label><input className={ic} value={data.thumbnail} onChange={(e) => setData({ ...data, thumbnail: e.target.value })} placeholder="/media/works/SLUG/thumb.jpg" /></div>
      <div><label className={lc}>正文 (Markdown)</label><textarea className={ic + " font-mono text-xs leading-relaxed"} rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder="# 标题&#10;&#10;内容..." /></div>
      <div className="flex items-center gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
        <button onClick={() => { navigator.clipboard.writeText(mkMDX()).then(onCopied); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
          {justCopied ? <><Check size={14} /> 已复制</> : <><Copy size={14} /> 复制文件内容</>}
        </button>
        <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-neutral-500 hover:text-neutral-700 transition-colors">取消</button>
      </div>
    </div>
  );
}
