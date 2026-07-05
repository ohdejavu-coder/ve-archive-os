"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Resume } from "@/types/content";

// ---- Cookie helpers ----

function loadCookie(): Record<string, string> {
  if (typeof document === "undefined") return {};
  try {
    // Primary source: localStorage (always reliable)
    const ls = localStorage.getItem("ve-content");
    if (ls) return JSON.parse(ls) as Record<string, string>;
    // Fallback: cookie
    const m = document.cookie.match(/(?:^|;\s*)ve-json=([^;]*)/);
    if (m) return JSON.parse(decodeURIComponent(m[1])) as Record<string, string>;
    return {};
  } catch { return {}; }
}

function saveCookie(obj: Record<string, string>) {
  try {
    const json = JSON.stringify(obj);
    localStorage.setItem("ve-content", json);
    document.cookie = `ve-json=${encodeURIComponent(json)};path=/;max-age=86400`;
    return true;
  } catch { return false; }
}

// ---- Tab list ----

const TABS = [
  { id: "hero" as const, label: "首页内容", desc: "Hero 标题、声明、头像" },
  { id: "resume" as const, label: "简历编辑", desc: "全部简历内容" },
  { id: "pages" as const, label: "页面文字", desc: "关于页面、联系页面" },
  { id: "site" as const, label: "网站设置", desc: "标题、页脚" },
  { id: "works" as const, label: "作品管理", desc: "新建、编辑作品" },
];
type TabId = typeof TABS[number]["id"];

// ---- Types for resume editor ----
interface ExpEntry {
  company: string; companyEn: string;
  role: string; roleEn: string;
  startDate: string; endDate: string;
  description: string; descriptionEn: string;
  highlights: string[];
}
interface EduEntry {
  institution: string; institutionEn: string;
  degree: string; degreeEn: string;
  field: string; fieldEn: string;
  startDate: string; endDate: string;
}
interface LangEntry { name: string; nameEn: string; level: string }
interface AwardEntry { title: string; titleEn: string; year: number; issuer: string }

// ---- Component ----

export function CCREditor({ fileResume }: { fileResume: Resume }) {
  const [activeTab, setActiveTab] = useState<TabId>("resume");
  const [cookieFields, setCookieFields] = useState<Record<string, string>>({});
  const [savedMsg, setSavedMsg] = useState("");

  // Resume editor state — deep clone from file
  const [experience, setExperience] = useState<ExpEntry[]>(() =>
    fileResume.experience.map((e) => ({ ...e, highlights: [...e.highlights] }))
  );
  const [education, setEducation] = useState<EduEntry[]>(() =>
    fileResume.education.map((e) => ({ ...e }))
  );
  const [coreStrengths, setCoreStrengths] = useState<{ zh: string; en: string; items?: { zh: string; en: string }[] }[]>(() =>
    (fileResume.coreStrengths ?? []).map((s) => ({
      zh: s.zh, en: s.en,
      items: (s.items ?? []).map((it) => ({ ...it })),
    }))
  );
  const [languages, setLanguages] = useState<LangEntry[]>(() =>
    fileResume.languages.map((l) => ({ ...l }))
  );
  const [awards, setAwards] = useState<AwardEntry[]>(() =>
    fileResume.awards.map((a) => ({ ...a }))
  );
  // Basic fields for the cookie pipeline
  const [basicsName, setBasicsName] = useState(fileResume.basics.name ?? "");
  const [basicsNameEn, setBasicsNameEn] = useState(fileResume.basics.nameEn ?? "");
  const [basicsTitle, setBasicsTitle] = useState(fileResume.basics.title ?? "");
  const [basicsTitleEn, setBasicsTitleEn] = useState(fileResume.basics.titleEn ?? "");
  const [basicsLocation, setBasicsLocation] = useState(fileResume.basics.location ?? "");
  const [basicsEmail, setBasicsEmail] = useState(fileResume.basics.email ?? "");
  const [basicsPhone, setBasicsPhone] = useState(fileResume.basics.phone ?? "");
  const [basicsWebsite, setBasicsWebsite] = useState(fileResume.basics.website ?? "");
  const [summary, setSummary] = useState(fileResume.summary ?? "");
  const [summaryEn, setSummaryEn] = useState(fileResume.summaryEn ?? "");

  // Hero/pages/site cookie fields
  const [cookieHeroFields, setCookieHeroFields] = useState<Record<string, string>>({});
  const [cookiePageFields, setCookiePageFields] = useState<Record<string, string>>({
    page_about: "",
    page_contact: "",
  });
  const [cookieSiteFields, setCookieSiteFields] = useState<Record<string, string>>({
    site_title: "",
    site_footer: "",
  });

  // Section visibility toggles (stored in cookie)
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());

  // Load all cookie values on mount — INCLUDING resume fields
  useEffect(() => {
    const c = loadCookie();

    // Resume basics from cookie (restore prior edits)
    if (c.resume_basics_name) setBasicsName(c.resume_basics_name);
    if (c.resume_basics_nameEn) setBasicsNameEn(c.resume_basics_nameEn);
    if (c.resume_basics_title) setBasicsTitle(c.resume_basics_title);
    if (c.resume_basics_titleEn) setBasicsTitleEn(c.resume_basics_titleEn);
    if (c.resume_basics_location) setBasicsLocation(c.resume_basics_location);
    if (c.resume_basics_email) setBasicsEmail(c.resume_basics_email);
    if (c.resume_basics_phone) setBasicsPhone(c.resume_basics_phone);
    if (c.resume_basics_website) setBasicsWebsite(c.resume_basics_website);
    if (c.resume_summary) setSummary(c.resume_summary);
    if (c.resume_summaryEn) setSummaryEn(c.resume_summaryEn);

    // Core strengths from cookie
    if (c.coreStrengths_json) {
      try {
        const parsed = JSON.parse(c.coreStrengths_json);
        setCoreStrengths(parsed);
      } catch {}
    }

    // Hidden sections
    if (c.hiddenResumeSections) {
      setHiddenSections(new Set(c.hiddenResumeSections.split(",")));
    }

    // Hero/pages/site
    setCookieHeroFields({
      heroHeadline: c.heroHeadline ?? "", heroHeadlineEn: c.heroHeadlineEn ?? "",
      heroSubtitle: c.heroSubtitle ?? "", heroSubtitleEn: c.heroSubtitleEn ?? "",
      personalStatement: c.personalStatement ?? "", personalStatementEn: c.personalStatementEn ?? "",
      profilePhoto: c.profilePhoto ?? "",
    });
    setCookiePageFields({ page_about: c.page_about ?? "", page_contact: c.page_contact ?? "" });
    setCookieSiteFields({ site_title: c.site_title ?? "", site_footer: c.site_footer ?? "" });
  }, []);

  // Toggle section visibility
  const toggleSectionVisibility = useCallback((section: string) => {
    setHiddenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section); else next.add(section);
      const c = loadCookie();
      c.hiddenResumeSections = Array.from(next).join(",");
      saveCookie(c);
      return next;
    });
  }, []);

  // Save basics + ALL resume data to cookie
  const saveResumeToCookie = useCallback(() => {
    const c = loadCookie();
    const updates: Record<string, string> = {
      resume_basics_name: basicsName,
      resume_basics_nameEn: basicsNameEn,
      resume_basics_title: basicsTitle,
      resume_basics_titleEn: basicsTitleEn,
      resume_basics_location: basicsLocation,
      resume_basics_email: basicsEmail,
      resume_basics_phone: basicsPhone,
      resume_basics_website: basicsWebsite,
      resume_summary: summary,
      resume_summaryEn: summaryEn,
      coreStrengths_json: JSON.stringify(coreStrengths),
      experience_json: JSON.stringify(experience),
      education_json: JSON.stringify(education),
      languages_json: JSON.stringify(languages),
      awards_json: JSON.stringify(awards),
      hiddenResumeSections: Array.from(hiddenSections).join(","),
    };
    const merged = { ...c, ...updates };
    if (saveCookie(merged)) setSavedMsg(`已保存 ${new Date().toLocaleTimeString("zh-CN")}`);
  }, [basicsName, basicsNameEn, basicsTitle, basicsTitleEn, basicsLocation, basicsEmail, basicsPhone, basicsWebsite, summary, summaryEn, coreStrengths, experience, education, languages, awards]);

  // Save hero to cookie
  const saveHeroToCookie = useCallback(() => {
    const c = loadCookie();
    const merged = { ...c, ...cookieHeroFields };
    if (saveCookie(merged)) setSavedMsg(`已保存 ${new Date().toLocaleTimeString("zh-CN")}`);
  }, [cookieHeroFields]);

  // Save pages to cookie
  const savePagesToCookie = useCallback(() => {
    const c = loadCookie();
    const merged = { ...c, ...cookiePageFields };
    if (saveCookie(merged)) setSavedMsg(`已保存 ${new Date().toLocaleTimeString("zh-CN")}`);
  }, [cookiePageFields]);

  // Save site to cookie
  const saveSiteToCookie = useCallback(() => {
    const c = loadCookie();
    const merged = { ...c, ...cookieSiteFields };
    if (saveCookie(merged)) setSavedMsg(`已保存 ${new Date().toLocaleTimeString("zh-CN")}`);
  }, [cookieSiteFields]);

  // Generate full resume.json
  const [resumeJson, setResumeJson] = useState("");
  const generateResume = useCallback(() => {
    const obj = {
      basics: {
        name: basicsName, nameEn: basicsNameEn,
        title: basicsTitle, titleEn: basicsTitleEn,
        location: basicsLocation, email: basicsEmail,
        phone: basicsPhone || undefined,
        website: basicsWebsite || undefined,
      },
      summary,
      summaryEn,
      coreStrengths,
      experience,
      education,
      languages,
      awards,
    };
    setResumeJson(JSON.stringify(obj, null, 2));
  }, [basicsName, basicsNameEn, basicsTitle, basicsTitleEn, basicsLocation, basicsEmail, basicsPhone, basicsWebsite, summary, summaryEn, coreStrengths, experience, education, languages, awards]);

  // Reset
  const reset = useCallback(() => {
    if (!confirm("清除所有编辑？不可撤销。")) return;
    document.cookie = "ve-json=;path=/;max-age=0";
    setSavedMsg("");
    setCookieHeroFields({ heroHeadline: "", heroHeadlineEn: "", heroSubtitle: "", heroSubtitleEn: "", personalStatement: "", personalStatementEn: "", profilePhoto: "" });
    setCookiePageFields({ page_about: "", page_contact: "" });
    setCookieSiteFields({ site_title: "", site_footer: "" });
  }, []);

  // Works tab
  const [mdxOut, setMdxOut] = useState("");

  const IC = "w-full px-4 py-3 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent transition-colors";
  const is = "w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent transition-colors";

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
          {activeTab === "hero" && <button onClick={saveHeroToCookie} className="px-5 py-2 rounded-sm text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80">保存所有更改</button>}
          {activeTab === "pages" && <button onClick={savePagesToCookie} className="px-5 py-2 rounded-sm text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80">保存所有更改</button>}
          {activeTab === "site" && <button onClick={saveSiteToCookie} className="px-5 py-2 rounded-sm text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80">保存所有更改</button>}
          {activeTab === "resume" && <button onClick={saveResumeToCookie} className="px-5 py-2 rounded-sm text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80">保存基本信息</button>}
          {activeTab === "works" && <span className="text-xs text-neutral-500">使用下方"生成 MDX"按钮导出作品文件</span>}
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar — sticky, scrolls with page */}
        <aside className="w-56 shrink-0 border-r border-neutral-200 dark:border-neutral-800 sticky top-14 h-screen overflow-y-auto">
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

        {/* Content — scrolls with page, centered */}
        <main className="flex-1 p-8 sm:p-12 max-w-5xl mx-auto w-full">

          {/* ============== HERO TAB ============== */}
          {activeTab === "hero" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-6">首页 Hero 内容</h2>
                <p className="text-sm text-neutral-500 mb-8">所有身份共享同一份 Hero 内容。保存后去首页刷新即可。</p>
                <div className="space-y-6">
                  <Field l="Hero 标题（中文）" v={cookieHeroFields.heroHeadline ?? ""} onChange={(v) => setCookieHeroFields((p) => ({ ...p, heroHeadline: v }))} ph="用影像讲述值得被看见的故事" />
                  <Field l="Hero Headline (English)" v={cookieHeroFields.heroHeadlineEn ?? ""} onChange={(v) => setCookieHeroFields((p) => ({ ...p, heroHeadlineEn: v }))} ph="Stories Worth Seeing" />
                  <Field l="副标题（中文）" v={cookieHeroFields.heroSubtitle ?? ""} onChange={(v) => setCookieHeroFields((p) => ({ ...p, heroSubtitle: v }))} ph="摄影 · 影视 · AI 创作" />
                  <Field l="Subtitle (English)" v={cookieHeroFields.heroSubtitleEn ?? ""} onChange={(v) => setCookieHeroFields((p) => ({ ...p, heroSubtitleEn: v }))} ph="Photography · Film · AI" />
                  <Field l="个人声明（中文）" a v={cookieHeroFields.personalStatement ?? ""} onChange={(v) => setCookieHeroFields((p) => ({ ...p, personalStatement: v }))} />
                  <Field l="Personal Statement (English)" a v={cookieHeroFields.personalStatementEn ?? ""} onChange={(v) => setCookieHeroFields((p) => ({ ...p, personalStatementEn: v }))} />
                  <Field l="头像图片路径" v={cookieHeroFields.profilePhoto ?? ""} onChange={(v) => setCookieHeroFields((p) => ({ ...p, profilePhoto: v }))} ph="/media/profile/avatar.jpg" />
                </div>
              </div>

              <hr className="border-neutral-200 dark:border-neutral-800" />

              {/* Persona identity display settings */}
              <div>
                <h3 className="text-lg font-semibold mb-2">身份展示</h3>
                <p className="text-sm text-neutral-500 mb-5">新作品默认在哪些身份下可见。修改后保存即可。</p>
                <div className="flex flex-wrap gap-3">
                  {["default","photographer","ai","director","freelance"].map((pid) => (
                    <label key={pid} className="flex items-center gap-2 text-sm cursor-pointer px-4 py-2 rounded border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 transition-colors">
                      <input
                        type="checkbox"
                        defaultChecked
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const val = pid;
                          setCookieHeroFields((p) => {
                            const current = (p.personas_visible ?? "default,photographer,ai,director,freelance").split(",");
                            const next = checked
                              ? [...new Set([...current, val])]
                              : current.filter((v) => v !== val);
                            return { ...p, personas_visible: next.join(",") };
                          });
                        }}
                        className="rounded"
                      />
                      <span>{pid==="default"?"默认":pid==="photographer"?"摄影":pid==="ai"?"AI":pid==="director"?"导演":"商业"}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============== RESUME TAB ============== */}
          {activeTab === "resume" && (
            <div className="space-y-10">
              {/* ---- Basics ---- */}
              <section>
                <h2 className="text-xl font-semibold mb-6">基本信息</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                  <Field l="姓名" v={basicsName} onChange={setBasicsName} ph="创作者姓名" />
                  <Field l="Name (EN)" v={basicsNameEn} onChange={setBasicsNameEn} ph="Your Name" />
                  <Field l="职位" v={basicsTitle} onChange={setBasicsTitle} ph="摄影师 / 导演" />
                  <Field l="Title (EN)" v={basicsTitleEn} onChange={setBasicsTitleEn} ph="Photographer / Director" />
                  <Field l="地点" v={basicsLocation} onChange={setBasicsLocation} ph="中国 · 上海" />
                  <Field l="邮箱" v={basicsEmail} onChange={setBasicsEmail} ph="hello@vearchive.com" />
                  <Field l="电话" v={basicsPhone} onChange={setBasicsPhone} ph="手机号码" />
                  <Field l="网站" v={basicsWebsite} onChange={setBasicsWebsite} ph="https://..." />
                </div>
                <div className="space-y-4 mb-6">
                  <Field l="个人简介（中文）" a v={summary} onChange={setSummary} />
                  <Field l="Summary (EN)" a v={summaryEn} onChange={setSummaryEn} />
                </div>

                <SaveBtn onClick={saveResumeToCookie} label="保存基本信息" hint="保存后去简历页刷新即可看到更新" />
              </section>

              <hr className="border-neutral-200 dark:border-neutral-800" />

              {/* ---- Core Strengths ---- */}
              <SectionCard
                title="核心优势" sectionKey="strengths"
                count={coreStrengths.length}
                hidden={hiddenSections.has("strengths")}
                onToggle={() => toggleSectionVisibility("strengths")}
                onAdd={() => setCoreStrengths((p) => [...p, { zh: "", en: "", items: [] }])}
              >
                {coreStrengths.map((s, i) => (
                  <div key={i} className="p-3 rounded border border-neutral-100 dark:border-neutral-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neutral-400 w-5">#{i + 1}</span>
                      <FieldL l="中文" v={s.zh} onChange={(v) => { const n = [...coreStrengths]; n[i] = { ...n[i], zh: v }; setCoreStrengths(n); }} inline />
                      <FieldL l="English" v={s.en} onChange={(v) => { const n = [...coreStrengths]; n[i] = { ...n[i], en: v }; setCoreStrengths(n); }} inline />
                      <button onClick={() => setCoreStrengths((p) => p.filter((_, j) => j !== i))} className="text-xs text-red-400 hover:text-red-600 shrink-0">✕</button>
                    </div>
                    {/* Sub-items */}
                    <div className="ml-5 pl-3 border-l-2 border-neutral-200 dark:border-neutral-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500">子标签（hover 时展示）</span>
                        <button
                          onClick={() => {
                            const items = s.items ?? [];
                            setCoreStrengths((p) => {
                              const n = [...p];
                              n[i] = { ...n[i], items: [...items, { zh: "", en: "" }] };
                              return n;
                            });
                          }}
                          className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        >+ 添加</button>
                      </div>
                      {(s.items ?? []).map((sub, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <span className="text-[10px] text-neutral-400 w-4">{j + 1}</span>
                          <FieldL l="" v={sub.zh} onChange={(v) => {
                            const n = [...coreStrengths];
                            const items = [...(n[i].items ?? [])];
                            items[j] = { ...items[j], zh: v };
                            n[i] = { ...n[i], items };
                            setCoreStrengths(n);
                          }} inline />
                          <FieldL l="" v={sub.en} onChange={(v) => {
                            const n = [...coreStrengths];
                            const items = [...(n[i].items ?? [])];
                            items[j] = { ...items[j], en: v };
                            n[i] = { ...n[i], items };
                            setCoreStrengths(n);
                          }} inline />
                          <button onClick={() => {
                            const n = [...coreStrengths];
                            n[i] = { ...n[i], items: (n[i].items ?? []).filter((_, k) => k !== j) };
                            setCoreStrengths(n);
                          }} className="text-xs text-red-400 hover:text-red-600 shrink-0">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </SectionCard>

              <hr className="border-neutral-200 dark:border-neutral-800" />

              {/* ---- Experience ---- */}
              <SectionCard
                title="工作经历" sectionKey="experience"
                count={experience.length}
                hidden={hiddenSections.has("experience")}
                onToggle={() => toggleSectionVisibility("experience")}
                onAdd={() => setExperience((p) => [...p, { company: "", companyEn: "", role: "", roleEn: "", startDate: "", endDate: "", description: "", descriptionEn: "", highlights: [] }])}
              >
                {experience.map((exp, i) => (
                  <div key={i} className="p-4 rounded border border-neutral-200 dark:border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-neutral-400">#{i + 1}</span>
                      <button onClick={() => setExperience((p) => p.filter((_, j) => j !== i))} className="text-xs text-red-400 hover:text-red-600">删除</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FieldL l="公司" v={exp.company} onChange={(v) => { const n = [...experience]; n[i] = { ...n[i], company: v }; setExperience(n); }} />
                      <FieldL l="Company (EN)" v={exp.companyEn} onChange={(v) => { const n = [...experience]; n[i] = { ...n[i], companyEn: v }; setExperience(n); }} />
                      <FieldL l="职位" v={exp.role} onChange={(v) => { const n = [...experience]; n[i] = { ...n[i], role: v }; setExperience(n); }} />
                      <FieldL l="Role (EN)" v={exp.roleEn} onChange={(v) => { const n = [...experience]; n[i] = { ...n[i], roleEn: v }; setExperience(n); }} />
                      <FieldL l="开始日期" v={exp.startDate} onChange={(v) => { const n = [...experience]; n[i] = { ...n[i], startDate: v }; setExperience(n); }} />
                      <FieldL l="结束日期" v={exp.endDate} onChange={(v) => { const n = [...experience]; n[i] = { ...n[i], endDate: v }; setExperience(n); }} />
                    </div>
                    <FieldL l="描述（中文）" a v={exp.description} onChange={(v) => { const n = [...experience]; n[i] = { ...n[i], description: v }; setExperience(n); }} />
                    <FieldL l="Description (EN)" a v={exp.descriptionEn} onChange={(v) => { const n = [...experience]; n[i] = { ...n[i], descriptionEn: v }; setExperience(n); }} />
                  </div>
                ))}
              </SectionCard>

              {/* ---- Education ---- */}
              <SectionCard
                title="教育背景" sectionKey="education"
                count={education.length}
                hidden={hiddenSections.has("education")}
                onToggle={() => toggleSectionVisibility("education")}
                onAdd={() => setEducation((p) => [...p, { institution: "", institutionEn: "", degree: "", degreeEn: "", field: "", fieldEn: "", startDate: "", endDate: "" }])}
              >
                {education.map((edu, i) => (
                  <div key={i} className="p-4 rounded border border-neutral-200 dark:border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-neutral-400">#{i + 1}</span>
                      <button onClick={() => setEducation((p) => p.filter((_, j) => j !== i))} className="text-xs text-red-400 hover:text-red-600">删除</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FieldL l="学校" v={edu.institution} onChange={(v) => { const n = [...education]; n[i] = { ...n[i], institution: v }; setEducation(n); }} />
                      <FieldL l="Institution (EN)" v={edu.institutionEn} onChange={(v) => { const n = [...education]; n[i] = { ...n[i], institutionEn: v }; setEducation(n); }} />
                      <FieldL l="学位" v={edu.degree} onChange={(v) => { const n = [...education]; n[i] = { ...n[i], degree: v }; setEducation(n); }} />
                      <FieldL l="Degree (EN)" v={edu.degreeEn} onChange={(v) => { const n = [...education]; n[i] = { ...n[i], degreeEn: v }; setEducation(n); }} />
                      <FieldL l="专业" v={edu.field} onChange={(v) => { const n = [...education]; n[i] = { ...n[i], field: v }; setEducation(n); }} />
                      <FieldL l="Field (EN)" v={edu.fieldEn} onChange={(v) => { const n = [...education]; n[i] = { ...n[i], fieldEn: v }; setEducation(n); }} />
                      <FieldL l="开始日期" v={edu.startDate} onChange={(v) => { const n = [...education]; n[i] = { ...n[i], startDate: v }; setEducation(n); }} />
                      <FieldL l="结束日期" v={edu.endDate} onChange={(v) => { const n = [...education]; n[i] = { ...n[i], endDate: v }; setEducation(n); }} />
                    </div>
                  </div>
                ))}
              </SectionCard>

              {/* ---- Languages ---- */}
              <SectionCard
                title="语言能力" sectionKey="languages"
                count={languages.length}
                hidden={hiddenSections.has("languages")}
                onToggle={() => toggleSectionVisibility("languages")}
                onAdd={() => setLanguages((p) => [...p, { name: "", nameEn: "", level: "" }])}
              >
                {languages.map((l, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded border border-neutral-100 dark:border-neutral-800">
                    <span className="text-xs text-neutral-400 w-5">{i + 1}</span>
                    <FieldL l="语言" v={l.name} onChange={(v) => { const n = [...languages]; n[i] = { ...n[i], name: v }; setLanguages(n); }} inline />
                    <FieldL l="Language (EN)" v={l.nameEn} onChange={(v) => { const n = [...languages]; n[i] = { ...n[i], nameEn: v }; setLanguages(n); }} inline />
                    <FieldL l="等级" v={l.level} onChange={(v) => { const n = [...languages]; n[i] = { ...n[i], level: v }; setLanguages(n); }} inline />
                    <button onClick={() => setLanguages((p) => p.filter((_, j) => j !== i))} className="text-xs text-red-400 hover:text-red-600 shrink-0">✕</button>
                  </div>
                ))}
              </SectionCard>

              {/* ---- Awards ---- */}
              <SectionCard
                title="获奖与荣誉" sectionKey="awards"
                count={awards.length}
                hidden={hiddenSections.has("awards")}
                onToggle={() => toggleSectionVisibility("awards")}
                onAdd={() => setAwards((p) => [...p, { title: "", titleEn: "", year: new Date().getFullYear(), issuer: "" }])}
              >
                {awards.map((aw, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded border border-neutral-100 dark:border-neutral-800">
                    <span className="text-xs text-neutral-400 w-5">{i + 1}</span>
                    <FieldL l="奖项" v={aw.title} onChange={(v) => { const n = [...awards]; n[i] = { ...n[i], title: v }; setAwards(n); }} inline />
                    <FieldL l="Title (EN)" v={aw.titleEn} onChange={(v) => { const n = [...awards]; n[i] = { ...n[i], titleEn: v }; setAwards(n); }} inline />
                    <input type="number" value={aw.year} onChange={(e) => { const n = [...awards]; n[i] = { ...n[i], year: Number(e.target.value) }; setAwards(n); }} className="w-20 px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs" placeholder="年份" />
                    <FieldL l="颁发机构" v={aw.issuer} onChange={(v) => { const n = [...awards]; n[i] = { ...n[i], issuer: v }; setAwards(n); }} inline />
                    <button onClick={() => setAwards((p) => p.filter((_, j) => j !== i))} className="text-xs text-red-400 hover:text-red-600 shrink-0">✕</button>
                  </div>
                ))}
              </SectionCard>

              <hr className="border-neutral-200 dark:border-neutral-800" />

              {/* ---- Generate JSON ---- */}
              <div className="space-y-4">
                <button onClick={generateResume} className="px-6 py-2.5 rounded text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80">
                  生成 resume.json
                </button>
                {resumeJson && (
                  <div className="p-4 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-neutral-400">
                        复制以下内容 → 在文件树打开 <code className="text-[11px] bg-neutral-200 dark:bg-neutral-700 px-1 rounded">content/resume/main.json</code> → 粘贴替换 → 保存
                      </span>
                      <button onClick={() => navigator.clipboard.writeText(resumeJson)} className="px-3 py-1 rounded text-xs bg-black text-white dark:bg-white dark:text-black hover:opacity-80">
                        复制
                      </button>
                    </div>
                    <pre className="text-[11px] leading-relaxed whitespace-pre-wrap break-all font-mono max-h-[500px] overflow-y-auto">{resumeJson}</pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============== PAGES TAB ============== */}
          {activeTab === "pages" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-6">页面文字</h2>
                <p className="text-sm text-neutral-500 mb-8">支持 Markdown 格式。保存后去对应页面刷新即可。</p>
                <div className="space-y-8">
                  <div><h3 className="text-base font-medium mb-3">关于页面</h3><Field a v={cookiePageFields.page_about ?? ""} onChange={(v) => setCookiePageFields((p) => ({ ...p, page_about: v }))} /></div>
                  <div><h3 className="text-base font-medium mb-3">联系页面</h3><Field a v={cookiePageFields.page_contact ?? ""} onChange={(v) => setCookiePageFields((p) => ({ ...p, page_contact: v }))} /></div>
                </div>
              </div>
              <SaveBtn onClick={savePagesToCookie} label="保存页面文字" hint="保存后去对应页面刷新即可看到更新" />
            </div>
          )}

          {/* ============== SITE TAB ============== */}
          {activeTab === "site" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-6">网站设置</h2>
                <div className="space-y-6">
                  <Field l="网站标题" v={cookieSiteFields.site_title ?? ""} onChange={(v) => setCookieSiteFields((p) => ({ ...p, site_title: v }))} ph="VE Archive" />
                  <Field l="页脚文本" a v={cookieSiteFields.site_footer ?? ""} onChange={(v) => setCookieSiteFields((p) => ({ ...p, site_footer: v }))} ph="© 2026 VE Archive. All rights reserved." />
                </div>
              </div>
              <SaveBtn onClick={saveSiteToCookie} label="保存网站设置" hint="保存后刷新即可看到更新" />
            </div>
          )}

          {/* ============== WORKS TAB ============== */}
          {activeTab === "works" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-2">新建作品</h2>
                <p className="text-sm text-neutral-500 mb-8">填写表单 → 生成 MDX → 在文件树 <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">content/works/</code> 下创建 .mdx 文件 → 粘贴 → 保存 → 刷新。</p>
                <WorkForm ic={IC} mdxOut={mdxOut} setMdxOut={setMdxOut} />
              </div>
              <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="text-lg font-semibold mb-4">媒体文件管理</h3>
                <div className="p-5 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                  <p>在 VS Code 左侧文件树中操作：</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>将图片/视频/音频拖入 <code className="text-xs bg-neutral-200 dark:bg-neutral-700 px-1.5 py-0.5 rounded">public/media/works/你的作品名/</code> 文件夹</li>
                    <li>支持格式：JPG、PNG、WebP、MP4、MOV、GIF</li>
                    <li>回到本页面，将路径填入缩略图字段</li>
                    <li>生成 MDX → 在文件树新建文件 → 粘贴 → 保存</li>
                    <li>热更新即刻生效</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Sticky bottom save bar */}
      {activeTab === "resume" && (
        <div className="sticky bottom-0 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-8 py-3 flex items-center justify-between z-10">
          <span className="text-xs text-neutral-500">编辑完成点击保存 → 去简历页刷新看效果</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400">{savedMsg}</span>
            <button onClick={saveResumeToCookie} className="px-6 py-2 rounded-sm text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity">保存基本信息</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Reusable UI pieces ----

function Field({ l, v, onChange, ph, a, n }: { l?: string; v: string; onChange: (v: string) => void; ph?: string; a?: boolean; n?: number }) {
  return (
    <div>
      {l && <label className="block text-xs font-medium text-neutral-500 mb-1.5">{l}</label>}
      {a
        ? <textarea className="w-full px-4 py-3 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent transition-colors resize-y" rows={n ?? 4} value={v} onChange={(e) => onChange(e.target.value)} placeholder={ph} />
        : <input className="w-full px-4 py-3 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent transition-colors" value={v} onChange={(e) => onChange(e.target.value)} placeholder={ph} />}
    </div>
  );
}

function FieldL({ l, v, onChange, a, inline }: { l?: string; v: string; onChange: (v: string) => void; a?: boolean; inline?: boolean }) {
  const cls = inline
    ? "flex-1 min-w-[80px] px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent transition-colors"
    : "w-full px-4 py-3 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent transition-colors";
  return (
    <div className={inline ? "flex-1 min-w-0" : ""}>
      {l && <label className="block text-xs font-medium text-neutral-500 mb-1.5">{l}</label>}
      {a
        ? <textarea className={cls + " resize-y"} rows={3} value={v} onChange={(e) => onChange(e.target.value)} />
        : <input className={cls} value={v} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}

function SaveBtn({ onClick, label, hint }: { onClick: () => void; label: string; hint?: string }) {
  return (
    <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
      <button onClick={onClick} className="px-6 py-2.5 rounded text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity">
        {label}
      </button>
      {hint && <span className="text-xs text-neutral-400">{hint}</span>}
    </div>
  );
}

function SectionCard({ title, count, onAdd, sectionKey, hidden, onToggle, children }: { title: string; count: number; onAdd: () => void; sectionKey?: string; hidden?: boolean; onToggle?: () => void; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold shrink-0">{title} ({count})</h3>
        <div className="flex items-center gap-3">
          {onToggle && (
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-500 select-none">
              <span>{hidden ? "已隐藏" : "展示中"}</span>
              <button
                onClick={onToggle}
                className={`relative w-9 h-5 rounded-full transition-colors ${hidden ? "bg-neutral-300 dark:bg-neutral-600" : "bg-[var(--red)]"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${hidden ? "left-0.5" : "left-[18px]"}`} />
              </button>
            </label>
          )}
          <button onClick={onAdd} className="px-3 py-1.5 rounded text-xs font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80">+ 添加</button>
        </div>
      </div>
      {children}
    </div>
  );
}

// ---- Works form ----

function WorkForm({ ic, mdxOut, setMdxOut }: { ic: string; mdxOut: string; setMdxOut: (v: string) => void }) {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  function gen() {
    const get = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value || "";
    const title = get("wk-title"), titleEn = get("wk-titleEn"), slug = get("wk-slug") || "new-work";
    const cat = get("wk-cat") || "photography", year = get("wk-year") || "2026";
    const client = get("wk-client"), thumb = get("wk-thumb");
    const body = (document.getElementById("wk-body") as HTMLTextAreaElement)?.value || "";
    const featured = (document.getElementById("wk-featured") as HTMLInputElement)?.checked;
    const personas: string[] = [];
    document.querySelectorAll("#wk-personas input:checked").forEach((cb) => { personas.push((cb as HTMLInputElement).value); });

    let o = "---\n";
    o += `id: "${slug}"\ntitle: "${title}"\ntitleEn: "${titleEn}"\ncategory: "${cat}"\ntags:\n`;
    tags.forEach((t: string) => { o += `  - "${t}"\n`; });
    o += "personas:\n";
    personas.forEach((p: string) => { o += `  - "${p}"\n`; });
    o += `featured: ${featured}\nthumbnail: "${thumb}"\nyear: ${year}\n`;
    if (client) o += `client: "${client}"\n`;
    o += "media: []\n---\n\n" + body;
    setMdxOut(o);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div><label className="block text-xs font-medium text-neutral-500 mb-1">作品名称</label><input id="wk-title" className={ic} placeholder="作品标题" /></div>
        <div><label className="block text-xs font-medium text-neutral-500 mb-1">Title (English)</label><input id="wk-titleEn" className={ic} placeholder="Project Title" /></div>
        <div><label className="block text-xs font-medium text-neutral-500 mb-1">文件 Slug</label><input id="wk-slug" className={ic} placeholder="my-new-work" /></div>
        <div><label className="block text-xs font-medium text-neutral-500 mb-1">分类</label><select id="wk-cat" className={ic}><option>photography</option><option>film</option><option>ai</option><option>new-media</option></select></div>
        <div><label className="block text-xs font-medium text-neutral-500 mb-1">年份</label><input id="wk-year" className={ic} placeholder="2026" type="number" /></div>
        <div><label className="block text-xs font-medium text-neutral-500 mb-1">客户</label><input id="wk-client" className={ic} placeholder="个人创作" /></div>
      </div>
      <div><label className="block text-xs font-medium text-neutral-500 mb-1">缩略图路径</label><input id="wk-thumb" className={ic} placeholder="/media/works/SLUG/thumb.jpg" /></div>
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">标签</label>
        <div className="flex gap-2"><input value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="flex-1 px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" placeholder="输入标签 → 点击添加" onKeyDown={(e) => { if (e.key === "Enter") { const t = tagInput.trim(); if (t) { setTags((p) => [...p, t]); setTagInput(""); } e.preventDefault(); } }} /><button onClick={() => { const t = tagInput.trim(); if (t) { setTags((p) => [...p, t]); setTagInput(""); } }} className="px-4 py-2 rounded text-sm bg-black text-white dark:bg-white dark:text-black hover:opacity-80">添加</button></div>
        <div className="flex flex-wrap gap-1.5 mt-2">{tags.length === 0 ? <span className="text-xs text-neutral-400">暂无标签</span> : tags.map((t, i) => (<span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800"><span>{t}</span><button onClick={() => setTags((p) => p.filter((_, j) => j !== i))} className="text-neutral-400 hover:text-red-500">&times;</button></span>))}</div>
      </div>
      <div><label className="block text-xs font-medium text-neutral-500 mb-2">展示身份</label><div id="wk-personas" className="flex flex-wrap gap-3">{["default","photographer","ai","director","freelance"].map((pid) => (<label key={pid} className="flex items-center gap-1.5 text-sm cursor-pointer"><input type="checkbox" value={pid} defaultChecked className="rounded" /><span>{pid==="default"?"默认":pid==="photographer"?"摄影":pid==="ai"?"AI":pid==="director"?"导演":"商业"}</span></label>))}</div></div>
      <label className="flex items-center gap-2 cursor-pointer"><input id="wk-featured" type="checkbox" className="rounded" /><span className="text-sm">设为精选作品</span></label>
      <div><label className="block text-xs font-medium text-neutral-500 mb-1">正文 (Markdown)</label><textarea id="wk-body" className="w-full px-4 py-3 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-mono" rows={8} placeholder="# 作品标题&#10;&#10;描述..." /></div>
      <button onClick={gen} className="px-5 py-2.5 rounded text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80">生成 MDX 文件内容</button>
      {mdxOut && <div className="p-4 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"><pre className="text-[11px] leading-relaxed whitespace-pre-wrap break-all font-mono">{mdxOut.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></div>}
      {!mdxOut && <div className="p-4 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"><p className="text-xs text-neutral-400">生成的内容将显示在这里。</p></div>}
    </div>
  );
}
