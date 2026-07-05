"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ---- Helpers ----

function loadCookie(): Record<string, string> {
  if (typeof document === "undefined") return {};
  try {
    const m = document.cookie.match(/(?:^|;\s*)ve-json=([^;]*)/);
    return m ? JSON.parse(decodeURIComponent(m[1])) : {};
  } catch { return {}; }
}

function saveCookie(obj: Record<string, string>) {
  try {
    document.cookie = `ve-json=${encodeURIComponent(JSON.stringify(obj))};path=/;max-age=86400`;
    return true;
  } catch { return false; }
}

const TABS = [
  { id: "hero", label: "首页内容", desc: "Hero 标题、声明、头像" },
  { id: "resume", label: "基本信息", desc: "姓名、职位、邮箱、简介" },
  { id: "pages", label: "页面文字", desc: "关于页面、联系页面" },
  { id: "site", label: "网站设置", desc: "标题、页脚" },
  { id: "works", label: "作品管理", desc: "新建、编辑作品" },
] as const;
type TabId = typeof TABS[number]["id"];

// ---- Page ----

export default function CCRPage() {
  const [activeTab, setActiveTab] = useState<TabId>("hero");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [savedMsg, setSavedMsg] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [mdxOutput, setMdxOutput] = useState("");

  // Load stored values on mount
  useEffect(() => {
    const stored = loadCookie();
    setFields(stored);
  }, []);

  // Update a field value
  const updateField = useCallback((key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Save all fields to cookie
  const save = useCallback(() => {
    const updated = { ...loadCookie(), ...fields };
    if (saveCookie(updated)) {
      setSavedMsg(`已保存 ${new Date().toLocaleTimeString("zh-CN")}`);
    }
  }, [fields]);

  // Reset
  const reset = useCallback(() => {
    if (!confirm("清除所有编辑？不可撤销。")) return;
    document.cookie = "ve-json=;path=/;max-age=0";
    setFields({});
    setSavedMsg("");
  }, []);

  // Add tag
  const addTag = useCallback((inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const tag = input?.value.trim();
    if (!tag) return;
    setTags((prev) => [...prev, tag]);
    if (input) input.value = "";
  }, []);

  // Remove tag
  const removeTag = useCallback((idx: number) => {
    setTags((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  // Generate MDX
  const generateMDX = useCallback(() => {
    const title = (document.getElementById("wk-title") as HTMLInputElement)?.value || "";
    const titleEn = (document.getElementById("wk-titleEn") as HTMLInputElement)?.value || "";
    const slug = (document.getElementById("wk-slug") as HTMLInputElement)?.value || "new-work";
    const cat = (document.getElementById("wk-cat") as HTMLSelectElement)?.value || "photography";
    const year = (document.getElementById("wk-year") as HTMLInputElement)?.value || "2026";
    const client = (document.getElementById("wk-client") as HTMLInputElement)?.value || "";
    const thumb = (document.getElementById("wk-thumb") as HTMLInputElement)?.value || "";
    const body = (document.getElementById("wk-body") as HTMLTextAreaElement)?.value || "";
    const featured = (document.getElementById("wk-featured") as HTMLInputElement)?.checked;

    const personas: string[] = [];
    document.querySelectorAll("#ccr-works-personas input:checked").forEach((cb) => {
      personas.push((cb as HTMLInputElement).value);
    });

    let o = "---\n";
    o += `id: "${slug}"\n`;
    o += `title: "${title}"\n`;
    o += `titleEn: "${titleEn}"\n`;
    o += `category: "${cat}"\n`;
    o += "tags:\n";
    tags.forEach((t) => { o += `  - "${t}"\n`; });
    o += "personas:\n";
    personas.forEach((p) => { o += `  - "${p}"\n`; });
    o += `featured: ${featured}\n`;
    o += `thumbnail: "${thumb}"\n`;
    o += `year: ${year}\n`;
    if (client) o += `client: "${client}"\n`;
    o += "media: []\n";
    o += "---\n\n";
    o += body;
    setMdxOutput(o);
  }, [tags]);

  const IC = "w-full px-4 py-3 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent transition-colors";

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Top bar */}
      <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-8 bg-white dark:bg-neutral-950 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold tracking-tight hover:opacity-60 uppercase">VE Archive</Link>
          <h1 className="text-base font-medium">设置</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400">{savedMsg}</span>
          <button onClick={save} className="px-5 py-2 rounded-sm text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity">
            保存所有更改
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-neutral-200 dark:border-neutral-800 min-h-[calc(100vh-3.5rem)]">
          <nav className="p-3 space-y-0.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${
                  activeTab === t.id
                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                }`}
              >
                <div className="font-medium">{t.label}</div>
                <div className="text-xs text-neutral-400 mt-0.5 font-normal">{t.desc}</div>
              </button>
            ))}
          </nav>
          <div className="mx-3 mt-2 pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <button onClick={reset} className="w-full text-left px-3 py-2 rounded-md text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              重置全部编辑
            </button>
            <Link href="/" className="block px-3 py-2 rounded-md text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors mt-0.5">
              ← 返回网站
            </Link>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 sm:p-12 max-w-3xl">

          {activeTab === "hero" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-6">首页 Hero 内容</h2>
                <p className="text-sm text-neutral-500 mb-8">所有身份共享同一份 Hero 内容。</p>
                <div className="space-y-6">
                  <F k="heroHeadline" l="Hero 标题（中文）" p="用影像讲述值得被看见的故事" v={fields.heroHeadline ?? ""} onChange={updateField} />
                  <F k="heroHeadlineEn" l="Hero Headline (English)" p="Stories Worth Seeing" v={fields.heroHeadlineEn ?? ""} onChange={updateField} />
                  <F k="heroSubtitle" l="副标题（中文）" p="摄影 · 影视 · AI 创作 · 新媒体" v={fields.heroSubtitle ?? ""} onChange={updateField} />
                  <F k="heroSubtitleEn" l="Subtitle (English)" p="Photography · Film · AI" v={fields.heroSubtitleEn ?? ""} onChange={updateField} />
                  <F k="personalStatement" l="个人声明（中文）" p="我是一名拥有电影制作背景的视觉创作者…" a v={fields.personalStatement ?? ""} onChange={updateField} />
                  <F k="personalStatementEn" l="Personal Statement (English)" p="I am a visual creator…" a v={fields.personalStatementEn ?? ""} onChange={updateField} />
                  <F k="profilePhoto" l="头像图片路径" p="/media/profile/avatar.jpg" v={fields.profilePhoto ?? ""} onChange={updateField} />
                </div>
              </div>
              <SaveBar save={save} />
            </div>
          )}

          {activeTab === "resume" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-6">基本信息</h2>
                <p className="text-sm text-neutral-500 mb-8">编辑后保存，去简历页刷新即可看到。</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <F k="resume_basics_name" l="姓名" p="创作者姓名" v={fields.resume_basics_name ?? ""} onChange={updateField} />
                  <F k="resume_basics_nameEn" l="Name (English)" p="Your Name" v={fields.resume_basics_nameEn ?? ""} onChange={updateField} />
                  <F k="resume_basics_title" l="职位" p="摄影师 / 导演" v={fields.resume_basics_title ?? ""} onChange={updateField} />
                  <F k="resume_basics_titleEn" l="Title (English)" p="Photographer / Director" v={fields.resume_basics_titleEn ?? ""} onChange={updateField} />
                  <F k="resume_basics_location" l="地点" p="中国 · 上海" v={fields.resume_basics_location ?? ""} onChange={updateField} />
                  <F k="resume_basics_email" l="邮箱" p="hello@vearchive.com" v={fields.resume_basics_email ?? ""} onChange={updateField} />
                  <F k="resume_basics_phone" l="电话" p="手机号码" v={fields.resume_basics_phone ?? ""} onChange={updateField} />
                  <F k="resume_basics_website" l="网站" p="https://..." v={fields.resume_basics_website ?? ""} onChange={updateField} />
                </div>
                <div className="mt-6 space-y-6">
                  <F k="resume_summary" l="个人简介（中文）" p="拥有电影制作专业背景的视觉创作者…" a v={fields.resume_summary ?? ""} onChange={updateField} />
                  <F k="resume_summaryEn" l="Summary (English)" p="A visual creator…" a v={fields.resume_summaryEn ?? ""} onChange={updateField} />
                </div>
              </div>
              <SaveBar save={save} />
            </div>
          )}

          {activeTab === "pages" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-6">页面文字</h2>
                <p className="text-sm text-neutral-500 mb-8">支持 Markdown 格式。</p>
                <div className="space-y-8">
                  <div><h3 className="text-base font-medium mb-3">关于页面</h3><F k="page_about" l="关于页内容" a n={10} v={fields.page_about ?? ""} onChange={updateField} /></div>
                  <div><h3 className="text-base font-medium mb-3">联系页面</h3><F k="page_contact" l="联系页内容" a n={10} v={fields.page_contact ?? ""} onChange={updateField} /></div>
                </div>
              </div>
              <SaveBar save={save} />
            </div>
          )}

          {activeTab === "site" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-6">网站设置</h2>
                <div className="space-y-6">
                  <F k="site_title" l="网站标题" p="VE Archive" v={fields.site_title ?? ""} onChange={updateField} />
                  <F k="site_footer" l="页脚文本" p="© 2026 VE Archive. All rights reserved." v={fields.site_footer ?? ""} onChange={updateField} />
                </div>
              </div>
              <SaveBar save={save} />
            </div>
          )}

          {activeTab === "works" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-2">新建作品</h2>
                <p className="text-sm text-neutral-500 mb-8">填写表单 → 生成 MDX → 在文件树 <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">content/works/</code> 下创建 .mdx 文件 → 粘贴 → 保存 → 刷新。</p>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div><label className="block text-xs font-medium text-neutral-500 mb-1">作品名称</label><input id="wk-title" className={IC} placeholder="作品标题" /></div>
                    <div><label className="block text-xs font-medium text-neutral-500 mb-1">Title (English)</label><input id="wk-titleEn" className={IC} placeholder="Project Title" /></div>
                    <div><label className="block text-xs font-medium text-neutral-500 mb-1">文件 Slug</label><input id="wk-slug" className={IC} placeholder="my-new-work" /></div>
                    <div><label className="block text-xs font-medium text-neutral-500 mb-1">分类</label><select id="wk-cat" className={IC}><option>photography</option><option>film</option><option>ai</option><option>new-media</option></select></div>
                    <div><label className="block text-xs font-medium text-neutral-500 mb-1">年份</label><input id="wk-year" className={IC} placeholder="2026" type="number" /></div>
                    <div><label className="block text-xs font-medium text-neutral-500 mb-1">客户</label><input id="wk-client" className={IC} placeholder="个人创作" /></div>
                  </div>
                  <div><label className="block text-xs font-medium text-neutral-500 mb-1">缩略图路径</label><input id="wk-thumb" className={IC} placeholder="/media/works/SLUG/thumb.jpg" /></div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">标签</label>
                    <div className="flex gap-2"><input id="ccr-tag-input" className="flex-1 px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" placeholder="输入标签 → 点击添加" /><button onClick={() => addTag("ccr-tag-input")} className="px-4 py-2 rounded text-sm bg-black text-white dark:bg-white dark:text-black hover:opacity-80">添加</button></div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tags.length === 0 ? <span className="text-xs text-neutral-400">暂无标签</span> : tags.map((t, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800">
                          <span>{t}</span>
                          <button onClick={() => removeTag(i)} className="text-neutral-400 hover:text-red-500">&times;</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div><label className="block text-xs font-medium text-neutral-500 mb-2">展示身份</label>
                    <div id="ccr-works-personas" className="flex flex-wrap gap-3">
                      {["default","photographer","ai","director","freelance"].map((pid) => (<label key={pid} className="flex items-center gap-1.5 text-sm cursor-pointer"><input type="checkbox" value={pid} defaultChecked className="rounded" /><span>{pid==="default"?"默认":pid==="photographer"?"摄影":pid==="ai"?"AI":pid==="director"?"导演":"商业"}</span></label>))}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer"><input id="wk-featured" type="checkbox" className="rounded" /><span className="text-sm">设为精选作品</span></label>
                  <div><label className="block text-xs font-medium text-neutral-500 mb-1">正文 (Markdown)</label><textarea id="wk-body" className="w-full px-4 py-3 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-mono" rows={8} placeholder="# 作品标题&#10;&#10;描述..." /></div>
                  <button onClick={generateMDX} className="px-5 py-2.5 rounded text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80">生成 MDX 文件内容</button>
                  {mdxOutput && (
                    <div className="p-4 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                      <pre className="text-[11px] leading-relaxed whitespace-pre-wrap break-all font-mono">{mdxOutput.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
                    </div>
                  )}
                  {!mdxOutput && <div className="p-4 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"><p className="text-xs text-neutral-400">生成的内容将显示在这里。</p></div>}
                </div>
              </div>
              <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="text-lg font-semibold mb-4">媒体文件管理</h3>
                <div className="p-5 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                  <p>在 VS Code 左侧文件树中操作：</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>将图片/视频/音频拖入 <code className="text-xs bg-neutral-200 dark:bg-neutral-700 px-1.5 py-0.5 rounded">public/media/works/你的作品名/</code> 文件夹</li>
                    <li>支持格式：JPG、PNG、WebP、MP4、MOV、GIF</li>
                    <li>回到本页面，将路径填入缩略图字段</li>
                    <li>生成 MDX → 在 <code className="text-xs bg-neutral-200 dark:bg-neutral-700 px-1.5 py-0.5 rounded">content/works/</code> 新建文件 → 粘贴 → 保存</li>
                    <li>热更新即刻生效</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

const IC = "w-full px-4 py-3 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent transition-colors";

function F({ k, l, p, a, n, v, onChange }: { k: string; l: string; p?: string; a?: boolean; n?: number; v: string; onChange: (k: string, v: string) => void }) {
  return (<div>
    <label className="block text-xs font-medium text-neutral-500 mb-1.5">{l}</label>
    {a
      ? <textarea className={IC + " resize-y"} rows={n ?? 4} value={v} onChange={(e) => onChange(k, e.target.value)} placeholder={p} />
      : <input className={IC} value={v} onChange={(e) => onChange(k, e.target.value)} placeholder={p} />}
  </div>);
}

function SaveBar({ save }: { save: () => void }) {
  return (
    <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
      <button onClick={save} className="px-6 py-2.5 rounded text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity">
        保存更改
      </button>
      <span className="text-xs text-neutral-400">保存后去对应页面刷新即可看到更新</span>
    </div>
  );
}
