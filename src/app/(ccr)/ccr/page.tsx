/**
 * CCR — Creator Control Room.
 * Tab switching: CSS-only radio buttons.
 * Content saving: vanilla JS localStorage.
 * Live preview: right-side column, updated in real-time.
 */

const JS = `!(function(){
  var K="ve-content";
  function L(){try{return JSON.parse(localStorage.getItem(K)||"{}")}catch(e){return{}}}
  function S(s){try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}}
  var store=L();
  var saved=document.getElementById("ccr-saved");
  function t(){if(saved)saved.textContent="已保存 "+new Date().toLocaleTimeString("zh-CN")}

  // ── Fields: load stored values + save on input ──
  document.querySelectorAll("[data-ccr-key]").forEach(function(el){
    var k=el.getAttribute("data-ccr-key");
    if(store[k]!==undefined)el.value=store[k];
    el.addEventListener("input",function(){
      store[k]=el.value||"";S(store);t();
    });
  });

  // ── Live preview: sync field value → preview element ──
  function syncPreview(el){
    var previewEl=document.getElementById(el.getAttribute("data-ccr-preview"));
    if(!previewEl)return;
    if(el.tagName==="TEXTAREA"){
      previewEl.innerHTML=el.value.replace(/\\n/g,"<br>")||"&nbsp;";
    }else{
      previewEl.textContent=el.value||"…";
    }
  }
  // Initial sync
  document.querySelectorAll("[data-ccr-preview]").forEach(function(el){
    syncPreview(el);
    el.addEventListener("input",function(){syncPreview(el);});
  });

  // ── Reset ──
  var r=document.getElementById("ccr-reset");
  if(r)r.addEventListener("click",function(){
    if(!confirm("清除所有编辑？不可撤销。"))return;
    localStorage.removeItem(K);store={};
    document.querySelectorAll("[data-ccr-key]").forEach(function(el){
      el.value="";
      var p=document.getElementById(el.getAttribute("data-ccr-preview"));
      if(p)p.textContent="";
    });
    if(saved)saved.textContent="";
  });
})();`;

export default function CCRPage() {
  return (<>
    <style dangerouslySetInnerHTML={{ __html: `
      .ccr-panel { display: none }
      #r-content:checked~.ccr-wrap .ccr-content,
      #r-content:checked~.ccr-pv .ccr-pv-content { display: block }
      #r-resume:checked~.ccr-wrap .ccr-resume,
      #r-resume:checked~.ccr-pv .ccr-pv-resume { display: block }
      #r-pages:checked~.ccr-wrap .ccr-pages,
      #r-pages:checked~.ccr-pv .ccr-pv-pages { display: block }
      #r-site:checked~.ccr-wrap .ccr-site,
      #r-site:checked~.ccr-pv .ccr-pv-site { display: block }
      #r-content:checked~* label[for=r-content],
      #r-resume:checked~* label[for=r-resume],
      #r-pages:checked~* label[for=r-pages],
      #r-site:checked~* label[for=r-site] {
        background:#171717;color:#fff;font-weight:500
      }
      @media(prefers-color-scheme:dark){
        #r-content:checked~* label[for=r-content],
        #r-resume:checked~* label[for=r-resume],
        #r-pages:checked~* label[for=r-pages],
        #r-site:checked~* label[for=r-site] {
          background:#f0f0f0;color:#111
        }
      }
    `}} />
    <div className="min-h-screen flex bg-white dark:bg-neutral-950">
      <input type="radio" name="t" id="r-content" className="hidden" defaultChecked />
      <input type="radio" name="t" id="r-resume" className="hidden" />
      <input type="radio" name="t" id="r-pages" className="hidden" />
      <input type="radio" name="t" id="r-site" className="hidden" />

      {/* ---- Sidebar ---- */}
      <aside className="w-48 shrink-0 border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="h-12 flex items-center px-4 border-b border-neutral-200 dark:border-neutral-800">
          <a href="/" className="text-sm font-semibold tracking-tight hover:opacity-60 uppercase">VE Archive</a>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          <label htmlFor="r-content" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            首页内容<span className="block text-[11px] opacity-40 mt-0.5 font-normal">Hero 标题、声明</span>
          </label>
          <label htmlFor="r-resume" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            基本信息<span className="block text-[11px] opacity-40 mt-0.5 font-normal">姓名、职位、邮箱</span>
          </label>
          <label htmlFor="r-pages" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            页面文字<span className="block text-[11px] opacity-40 mt-0.5 font-normal">关于页、联系页</span>
          </label>
          <label htmlFor="r-site" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            网站设置<span className="block text-[11px] opacity-40 mt-0.5 font-normal">标题、页脚</span>
          </label>
        </nav>
        <div className="p-2 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
          <button id="ccr-reset" className="w-full text-left px-2.5 py-1.5 rounded-sm text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">重置全部</button>
          <a href="/" className="block px-2.5 py-1.5 rounded-sm text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">← 返回网站</a>
        </div>
      </aside>

      {/* ---- Editor workspace ---- */}
      <div className="ccr-wrap flex-1 flex flex-col min-w-0 border-r border-neutral-200 dark:border-neutral-800">
        <header className="h-12 shrink-0 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6 bg-white dark:bg-neutral-950">
          <h2 className="text-sm font-semibold">内容编辑</h2>
          <span id="ccr-saved" className="text-xs text-neutral-400" />
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-xl space-y-5">
            {/* content */}
            <div className="ccr-panel ccr-content">
              <F k="heroHeadline" l="Hero 标题" p="用影像讲述值得被看见的故事" preview="pv-headline" />
              <F k="heroSubtitle" l="Hero 副标题" p="摄影 · 影视 · AI 创作 · 新媒体" preview="pv-subtitle" />
              <F k="personalStatement" l="个人声明（中文）" p="我是一名拥有电影制作背景的视觉创作者…" a preview="pv-statement" />
              <F k="personalStatementEn" l="个人声明（英文）" p="I am a visual creator…" a preview="pv-statement-en" />
              <F k="profilePhoto" l="头像图片路径" p="/media/profile/avatar.jpg" preview="pv-photo" />
            </div>
            {/* resume */}
            <div className="ccr-panel ccr-resume">
              <div className="grid grid-cols-2 gap-4">
                <F k="resume_basics_name" l="姓名" p="创作者姓名" preview="pv-name" />
                <F k="resume_basics_nameEn" l="Name (EN)" p="Your Name" />
                <F k="resume_basics_title" l="职位" p="摄影师 / 导演" preview="pv-title" />
                <F k="resume_basics_titleEn" l="Title (EN)" p="Photographer / Director" />
                <F k="resume_basics_location" l="地点" p="中国 · 上海" preview="pv-location" />
                <F k="resume_basics_email" l="邮箱" p="hello@vearchive.com" preview="pv-email" />
                <F k="resume_basics_phone" l="电话" p="手机号码" />
                <F k="resume_basics_website" l="网站" p="https://..." />
              </div>
              <div className="mt-5">
                <F k="resume_summary" l="个人简介（中文）" p="拥有电影制作专业背景的视觉创作者…" a preview="pv-summary" />
              </div>
            </div>
            {/* pages */}
            <div className="ccr-panel ccr-pages">
              <F k="page_about" l="关于页内容 (Markdown)" p="# 关于我&#10;&#10;我是一名..." a n={10} preview="pv-about" />
              <div className="mt-8">
                <F k="page_contact" l="联系页内容 (Markdown)" p="# 联系方式&#10;&#10;欢迎合作..." a n={10} preview="pv-contact" />
              </div>
            </div>
            {/* site */}
            <div className="ccr-panel ccr-site">
              <F k="site_title" l="网站标题" p="VE Archive" preview="pv-site-title" />
              <F k="site_footer" l="页脚文本" p="© 2026 VE Archive" preview="pv-site-footer" />
            </div>
          </div>
        </main>
      </div>

      {/* ---- Preview panel ---- */}
      <div className="ccr-pv w-72 shrink-0 flex flex-col bg-neutral-50/30 dark:bg-neutral-900/20">
        <header className="h-12 shrink-0 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-4 bg-white dark:bg-neutral-950">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">预览</span>
        </header>
        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          {/* content preview */}
          <div className="ccr-panel ccr-pv-content space-y-5">
            <PV label="Hero 标题"><span id="pv-headline" className="text-lg font-bold leading-tight">…</span></PV>
            <PV label="Hero 副标题"><span id="pv-subtitle" className="text-sm text-neutral-500">…</span></PV>
            <PV label="个人声明"><blockquote id="pv-statement" className="text-sm italic text-neutral-600 dark:text-neutral-400 border-l-2 border-[var(--red)] pl-3">…</blockquote></PV>
            <PV label="英文声明"><blockquote id="pv-statement-en" className="text-sm italic text-neutral-600 dark:text-neutral-400 border-l-2 border-[var(--red)] pl-3">…</blockquote></PV>
            <PV label="头像"><code id="pv-photo" className="text-xs text-neutral-400">…</code></PV>
          </div>
          {/* resume preview */}
          <div className="ccr-panel ccr-pv-resume space-y-4">
            <PV label="简历预览">
              <div className="p-3 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1.5 text-sm">
                <div id="pv-name" className="font-bold text-base">…</div>
                <div id="pv-title" className="text-neutral-500">…</div>
                <div className="flex gap-3 text-xs text-neutral-400 mt-2">
                  <span id="pv-location">…</span>
                  <span id="pv-email">…</span>
                </div>
                <hr className="my-2" />
                <p id="pv-summary" className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">…</p>
              </div>
            </PV>
          </div>
          {/* pages preview */}
          <div className="ccr-panel ccr-pv-pages space-y-4">
            <PV label="关于页"><div id="pv-about" className="text-xs leading-relaxed whitespace-pre-wrap text-neutral-600 dark:text-neutral-400">…</div></PV>
            <PV label="联系页"><div id="pv-contact" className="text-xs leading-relaxed whitespace-pre-wrap text-neutral-600 dark:text-neutral-400">…</div></PV>
          </div>
          {/* site preview */}
          <div className="ccr-panel ccr-pv-site space-y-4">
            <PV label="网站标题"><span id="pv-site-title" className="text-sm font-semibold">…</span></PV>
            <PV label="页脚"><span id="pv-site-footer" className="text-xs text-neutral-400">…</span></PV>
          </div>
        </div>
      </div>
    </div>
    <script dangerouslySetInnerHTML={{ __html: JS }} />
  </>);
}

function F({ k, l, p, a, n, preview }: { k: string; l: string; p?: string; a?: boolean; n?: number; preview?: string }) {
  const c = "w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent transition-colors";
  const attrs: Record<string, string> = { "data-ccr-key": k };
  if (preview) attrs["data-ccr-preview"] = preview;
  return (<div>
    <label className="block text-xs font-medium text-neutral-500 mb-1">{l}</label>
    {a ? <textarea className={c} rows={n ?? 4} {...attrs} placeholder={p} /> : <input className={c} {...attrs} placeholder={p} />}
  </div>);
}

function PV({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="text-[10px] uppercase tracking-wide text-neutral-400 mb-2 block">{label}</span>
      {children}
    </div>
  );
}
