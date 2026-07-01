/**
 * CCR — Creator Control Room.
 *
 * Server component. Ships plain HTML.
 * A single <script> at the bottom handles all interactivity.
 * Zero React state. Zero hydration dependency.
 */

const STORE_KEY = "ve-content";

export default function CCRPage() {
  return (
    <>
      <div className="min-h-screen flex bg-white dark:bg-neutral-950">
        {/* ---- Sidebar ---- */}
        <aside className="w-56 shrink-0 border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-neutral-50/50 dark:bg-neutral-900/30">
          <div className="h-12 flex items-center px-4 border-b border-neutral-200 dark:border-neutral-800">
            <a href="/" className="text-sm font-semibold tracking-tight hover:opacity-60 uppercase">VE Archive</a>
          </div>
          <nav className="flex-1 p-3 space-y-0.5">
            <TabBtn id="content">首页内容<span className="block text-xs opacity-50 mt-0.5">Hero 标题、声明、头像</span></TabBtn>
            <TabBtn id="resume">基本信息<span className="block text-xs opacity-50 mt-0.5">姓名、职位、邮箱、简介</span></TabBtn>
            <TabBtn id="pages">页面文字<span className="block text-xs opacity-50 mt-0.5">关于页、联系页</span></TabBtn>
            <TabBtn id="site">网站设置<span className="block text-xs opacity-50 mt-0.5">标题、页脚</span></TabBtn>
          </nav>
          <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
            <button id="ccr-reset" className="w-full text-left px-3 py-2 rounded-sm text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              重置全部编辑
            </button>
            <a href="/" className="block px-3 py-2 rounded-sm text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
              ← 返回网站
            </a>
          </div>
        </aside>

        {/* ---- Content area ---- */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 shrink-0 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6 bg-white dark:bg-neutral-950">
            <h2 className="text-sm font-semibold">内容编辑</h2>
            <span id="ccr-saved" className="text-xs text-neutral-400" />
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl">
              {/* content tab */}
              <div id="ccr-panel-content" className="ccr-panel">
                <h3 className="text-lg font-semibold mb-2">首页 Hero 内容</h3>
                <p className="text-sm text-neutral-500 mb-5">编辑后去首页刷新即可看到。所有身份共享同一份内容。</p>
                <div className="space-y-5">
                  <F k="heroHeadline" label="Hero 标题" ph="用影像讲述值得被看见的故事" />
                  <F k="heroSubtitle" label="Hero 副标题" ph="摄影 · 影视 · AI 创作 · 新媒体" />
                  <F k="personalStatement" label="个人声明（中文）" ph="我是一名拥有电影制作背景的视觉创作者…" ta />
                  <F k="personalStatementEn" label="个人声明（英文）" ph="I am a visual creator…" ta />
                  <F k="profilePhoto" label="头像图片路径" ph="/media/profile/avatar.jpg" />
                </div>
              </div>
              {/* resume tab */}
              <div id="ccr-panel-resume" className="ccr-panel hidden">
                <h3 className="text-lg font-semibold mb-2">基本信息</h3>
                <p className="text-sm text-neutral-500 mb-5">姓名、职位、联系方式。</p>
                <div className="grid grid-cols-2 gap-4">
                  <F k="resume_basics_name" label="姓名" ph="创作者姓名" />
                  <F k="resume_basics_nameEn" label="Name (EN)" ph="Your Name" />
                  <F k="resume_basics_title" label="职位" ph="摄影师 / 导演" />
                  <F k="resume_basics_titleEn" label="Title (EN)" ph="Photographer / Director" />
                  <F k="resume_basics_location" label="地点" ph="中国 · 上海" />
                  <F k="resume_basics_email" label="邮箱" ph="hello@vearchive.com" />
                  <F k="resume_basics_phone" label="电话" ph="手机号码" />
                  <F k="resume_basics_website" label="网站" ph="https://..." />
                </div>
                <div className="mt-5 space-y-5">
                  <F k="resume_summary" label="个人简介（中文）" ph="拥有电影制作专业背景的视觉创作者…" ta />
                  <F k="resume_summaryEn" label="简介 (EN)" ph="A visual creator…" ta />
                </div>
              </div>
              {/* pages tab */}
              <div id="ccr-panel-pages" className="ccr-panel hidden">
                <h3 className="text-lg font-semibold mb-2">关于页面</h3>
                <p className="text-sm text-neutral-500 mb-3">Markdown 格式。</p>
                <F k="page_about" label="关于页内容" ph="# 关于我&#10;&#10;我是一名..." ta rows={10} />
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-2">联系页面</h3>
                  <p className="text-sm text-neutral-500 mb-3">Markdown 格式。</p>
                  <F k="page_contact" label="联系页内容" ph="# 联系方式&#10;&#10;欢迎合作..." ta rows={10} />
                </div>
              </div>
              {/* site tab */}
              <div id="ccr-panel-site" className="ccr-panel hidden">
                <h3 className="text-lg font-semibold mb-2">网站设置</h3>
                <div className="space-y-5">
                  <F k="site_title" label="网站标题" ph="VE Archive" />
                  <F k="site_footer" label="页脚文本" ph="© 2026 VE Archive" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* Core script — all interactivity lives here */}
      <script dangerouslySetInnerHTML={{ __html: CCR_SCRIPT }} />
    </>
  );
}

/* ---- Field component ---- */
function F({ k, label, ph, ta, rows }: { k: string; label: string; ph?: string; ta?: boolean; rows?: number }) {
  const cls = "w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent transition-colors";
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-500 mb-1">{label}</label>
      {ta ? (
        <textarea className={cls} rows={rows ?? 4} data-ccr-key={k} placeholder={ph} />
      ) : (
        <input className={cls} data-ccr-key={k} placeholder={ph} />
      )}
    </div>
  );
}

/* ---- Tab button ---- */
function TabBtn({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <button data-ccr-tab={id} className="w-full text-left px-3 py-2 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-normal">
      {children}
    </button>
  );
}

/* ---- Vanilla JS — lives in its own closure, no React needed ---- */
const CCR_SCRIPT = `
(function(){
  var K="ve-content";
  var $=function(id){return document.getElementById(id);};
  var savedEl=$("ccr-saved");

  function load(){try{return JSON.parse(localStorage.getItem(K)||"{}");}catch(e){return{};}}
  function save(s){try{localStorage.setItem(K,JSON.stringify(s));}catch(e){}}

  var store=load();

  // ── Populate fields ──
  var fields=document.querySelectorAll("[data-ccr-key]");
  fields.forEach(function(el){
    var key=el.getAttribute("data-ccr-key");
    if(store[key]!==undefined)el.value=store[key];
    el.addEventListener("input",function(){
      store[key]=el.value||"";
      save(store);
      if(savedEl)savedEl.textContent="已保存 "+new Date().toLocaleTimeString("zh-CN");
    });
  });

  // ── Tab switching ──
  var tabBtns=document.querySelectorAll("[data-ccr-tab]");
  var activeTab=null;
  function showTab(id){
    document.querySelectorAll(".ccr-panel").forEach(function(p){p.classList.add("hidden");});
    var panel=$("ccr-panel-"+id);
    if(panel)panel.classList.remove("hidden");
    tabBtns.forEach(function(b){
      if(b.getAttribute("data-ccr-tab")===id){
        b.classList.add("bg-neutral-900","text-white","font-medium");
        b.classList.remove("text-neutral-600","dark:text-neutral-400","hover:bg-neutral-100");
      }else{
        b.classList.remove("bg-neutral-900","text-white","font-medium");
        b.classList.add("text-neutral-600","dark:text-neutral-400","hover:bg-neutral-100");
      }
    });
  }
  tabBtns.forEach(function(b){
    b.addEventListener("click",function(){
      showTab(b.getAttribute("data-ccr-tab"));
    });
  });
  showTab("content");

  // ── Reset ──
  var resetBtn=$("ccr-reset");
  if(resetBtn){
    resetBtn.addEventListener("click",function(){
      if(!confirm("清除所有编辑？不可撤销。"))return;
      localStorage.removeItem(K);
      store={};
      fields.forEach(function(el){el.value="";});
      if(savedEl)savedEl.textContent="";
    });
  }
})();
`.replace(/\s+/g, ' ');
