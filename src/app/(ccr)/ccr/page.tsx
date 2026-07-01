/**
 * CCR — Creator Control Room.
 *
 * Tab switching: CSS-only radio buttons.
 * Content saving: vanilla JS localStorage.
 * Preview: real iframe of the site.
 */

const JS = `!(function(){
  var K="ve-content";
  function L(){try{return JSON.parse(localStorage.getItem(K)||"{}")}catch(e){return{}}}
  function S(s){try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}}
  var store=L();
  var saved=document.getElementById("ccr-saved");
  function t(){if(saved)saved.textContent="已保存 "+new Date().toLocaleTimeString("zh-CN")}

  // ── Load stored values into fields ──
  document.querySelectorAll("[data-ccr-key]").forEach(function(el){
    var k=el.getAttribute("data-ccr-key");
    if(store[k]!==undefined)el.value=store[k];
    el.addEventListener("input",function(){
      store[k]=el.value||"";S(store);t();
      // Refresh iframe on each keystroke
      var f=document.getElementById("ccr-iframe");
      if(f)f.src=f.src;
    });
  });

  // ── Sync field → DOM preview element ──
  function syncPreview(el){
    var id=el.getAttribute("data-ccr-preview");
    var pv=id?document.getElementById(id):null;
    if(!pv)return;
    if(el.tagName==="TEXTAREA") pv.innerHTML=el.value.replace(/\\n/g,"<br>")||"&nbsp;";
    else pv.textContent=el.value||"...";
  }
  document.querySelectorAll("[data-ccr-preview]").forEach(function(el){
    syncPreview(el);
    el.addEventListener("input",function(){syncPreview(el);});
  });

  // ── Refresh iframe ──
  var rf=document.getElementById("ccr-refresh");
  if(rf)rf.addEventListener("click",function(){
    var f=document.getElementById("ccr-iframe");
    if(f)f.src=f.src;
    var f2=document.getElementById("ccr-iframe-resume");
    if(f2)f2.src=f2.src;
    var f3=document.getElementById("ccr-iframe-pages");
    if(f3)f3.src=f3.src;
    var f4=document.getElementById("ccr-iframe-site");
    if(f4)f4.src=f4.src;
  });

  // ── Reset ──
  var r=document.getElementById("ccr-reset");
  if(r)r.addEventListener("click",function(){
    if(!confirm("清除所有编辑？不可撤销。"))return;
    localStorage.removeItem(K);store={};
    document.querySelectorAll("[data-ccr-key]").forEach(function(el){
      el.value="";
      var pid=el.getAttribute("data-ccr-preview");
      var pv=pid?document.getElementById(pid):null;
      if(pv)pv.textContent=pv.tagName==="DIV"?"":"...";
    });
    if(saved)saved.textContent="";
  });
})();`;

export default function CCRPage() {
  return (<>
    <style dangerouslySetInnerHTML={{ __html: `
      .ccr-panel,.ccr-pvpanel { display: none }
      #r-content:checked~.ccr-wrap .ccr-content,
      #r-content:checked~.ccr-pv .ccr-pvcontent { display: block }
      #r-resume:checked~.ccr-wrap .ccr-resume,
      #r-resume:checked~.ccr-pv .ccr-pvresume { display: block }
      #r-pages:checked~.ccr-wrap .ccr-pages,
      #r-pages:checked~.ccr-pv .ccr-pvpages { display: block }
      #r-site:checked~.ccr-wrap .ccr-site,
      #r-site:checked~.ccr-pv .ccr-pvsite { display: block }
      #r-content:checked~.ccr-side label[for=r-content],
      #r-resume:checked~.ccr-side label[for=r-resume],
      #r-pages:checked~.ccr-side label[for=r-pages],
      #r-site:checked~.ccr-side label[for=r-site] {
        background:#171717;color:#fff;font-weight:500
      }
      @media(prefers-color-scheme:dark){
        #r-content:checked~.ccr-side label[for=r-content],
        #r-resume:checked~.ccr-side label[for=r-resume],
        #r-pages:checked~.ccr-side label[for=r-pages],
        #r-site:checked~.ccr-side label[for=r-site] {
          background:#f0f0f0;color:#111
        }
      }
      .ccr-pvpanel { height: 100%; }
      .ccr-pvpanel iframe { width: 100%; height: 100%; border: none; border-radius: 0; }
    `}} />

    <div className="min-h-screen flex bg-white dark:bg-neutral-950">
      <input type="radio" name="t" id="r-content" className="hidden" defaultChecked />
      <input type="radio" name="t" id="r-resume" className="hidden" />
      <input type="radio" name="t" id="r-pages" className="hidden" />
      <input type="radio" name="t" id="r-site" className="hidden" />

      {/* ---- Sidebar ---- */}
      <aside className="ccr-side w-48 shrink-0 border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="h-12 flex items-center px-4 border-b border-neutral-200 dark:border-neutral-800">
          <a href="/" className="text-sm font-semibold tracking-tight hover:opacity-60 uppercase">VE Archive</a>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          <label htmlFor="r-content" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            首页内容
          </label>
          <label htmlFor="r-resume" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            基本信息
          </label>
          <label htmlFor="r-pages" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            页面文字
          </label>
          <label htmlFor="r-site" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            网站设置
          </label>
        </nav>
        <div className="p-2 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
          <button id="ccr-reset" className="w-full text-left px-2.5 py-1.5 rounded-sm text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">重置全部</button>
          <a href="/" className="block px-2.5 py-1.5 rounded-sm text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">← 返回网站</a>
        </div>
      </aside>

      {/* ---- Editor ---- */}
      <div className="ccr-wrap flex-1 flex flex-col min-w-0 border-r border-neutral-200 dark:border-neutral-800">
        <header className="h-12 shrink-0 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6 bg-white dark:bg-neutral-950">
          <h2 className="text-sm font-semibold">内容编辑</h2>
          <span id="ccr-saved" className="text-xs text-neutral-400" />
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-xl space-y-5">
            {/* content */}
            <div className="ccr-panel ccr-content">
              <h3 className="text-lg font-semibold mb-5">首页 Hero 内容</h3>
              <F k="heroHeadline" l="Hero 标题" p="用影像讲述值得被看见的故事" />
              <F k="heroSubtitle" l="Hero 副标题" p="摄影 · 影视 · AI 创作 · 新媒体" />
              <F k="personalStatement" l="个人声明（中文）" p="我是一名拥有电影制作背景的视觉创作者…" a />
              <F k="personalStatementEn" l="个人声明（英文）" p="I am a visual creator…" a />
              <F k="profilePhoto" l="头像图片路径" p="/media/profile/avatar.jpg" />
            </div>
            {/* resume */}
            <div className="ccr-panel ccr-resume">
              <h3 className="text-lg font-semibold mb-5">基本信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <F k="resume_basics_name" l="姓名" p="创作者姓名" />
                <F k="resume_basics_nameEn" l="Name (EN)" p="Your Name" />
                <F k="resume_basics_title" l="职位" p="摄影师 / 导演" />
                <F k="resume_basics_titleEn" l="Title (EN)" p="Photographer / Director" />
                <F k="resume_basics_location" l="地点" p="中国 · 上海" />
                <F k="resume_basics_email" l="邮箱" p="hello@vearchive.com" />
                <F k="resume_basics_phone" l="电话" p="手机号码" />
                <F k="resume_basics_website" l="网站" p="https://..." />
              </div>
              <div className="mt-5">
                <F k="resume_summary" l="个人简介（中文）" p="拥有电影制作专业背景的视觉创作者…" a />
                <F k="resume_summaryEn" l="简介 (EN)" p="A visual creator…" a />
              </div>
            </div>
            {/* pages */}
            <div className="ccr-panel ccr-pages">
              <F k="page_about" l="关于页内容 (Markdown)" p="# 关于我&#10;&#10;我是一名..." a n={10} />
              <div className="mt-8">
                <F k="page_contact" l="联系页内容 (Markdown)" p="# 联系方式&#10;&#10;欢迎合作..." a n={10} />
              </div>
            </div>
            {/* site */}
            <div className="ccr-panel ccr-site">
              <F k="site_title" l="网站标题" p="VE Archive" />
              <F k="site_footer" l="页脚文本" p="© 2026 VE Archive" />
            </div>
          </div>
        </main>
      </div>

      {/* ---- Preview: real iframe ---- */}
      <div className="ccr-pv flex-1 flex flex-col bg-neutral-50 dark:bg-neutral-900 min-w-0">
        <header className="h-12 shrink-0 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-4 bg-white dark:bg-neutral-950">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">实时预览</span>
          <button id="ccr-refresh" className="ml-auto text-xs text-neutral-400 hover:text-neutral-600">刷新</button>
        </header>
        {/* content preview */}
        <div className="ccr-pvpanel ccr-pvcontent">
          <iframe id="ccr-iframe" src="/default" title="Preview" />
        </div>
        {/* resume preview */}
        <div className="ccr-pvpanel ccr-pvresume">
          <iframe id="ccr-iframe-resume" src="/default/resume" title="Resume Preview" />
        </div>
        {/* pages preview */}
        <div className="ccr-pvpanel ccr-pvpages">
          <iframe id="ccr-iframe-pages" src="/default/about" title="Pages Preview" />
        </div>
        {/* site preview */}
        <div className="ccr-pvpanel ccr-pvsite">
          <iframe id="ccr-iframe-site" src="/default" title="Site Preview" />
        </div>
      </div>
    </div>
    <script dangerouslySetInnerHTML={{ __html: JS }} />
  </>);
}

function F({ k, l, p, a, n }: { k: string; l: string; p?: string; a?: boolean; n?: number }) {
  const c = "w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent transition-colors";
  return (<div>
    <label className="block text-xs font-medium text-neutral-500 mb-1">{l}</label>
    {a ? <textarea className={c} rows={n ?? 4} data-ccr-key={k} placeholder={p} /> : <input className={c} data-ccr-key={k} placeholder={p} />}
  </div>);
}
