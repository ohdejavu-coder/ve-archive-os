/**
 * CCR — Creator Control Room.
 * Tab switching: CSS-only radio buttons.
 * Content saving: vanilla JS localStorage.
 * Preview: floating mini window.
 */

const JS = `!(function(){
  var K="ve-content";
  function L(){try{return JSON.parse(localStorage.getItem(K)||"{}")}catch(e){return{}}}
  function S(s){try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}}
  var store=L();
  var saved=document.getElementById("ccr-saved");
  function t(){if(saved)saved.textContent="已保存 "+new Date().toLocaleTimeString("zh-CN")}

  document.querySelectorAll("[data-ccr-key]").forEach(function(el){
    var k=el.getAttribute("data-ccr-key");
    if(store[k]!==undefined)el.value=store[k];
    el.addEventListener("input",function(){store[k]=el.value||"";S(store);t();});
  });

  // Works tab: add tag
  var at=document.getElementById("ccr-add-tag");
  if(at)at.addEventListener("click",function(){
    var i=document.getElementById("ccr-tag-input");
    var tag=i.value.trim();
    if(!tag)return;
    var d=document.getElementById("ccr-tags-display");
    var sp=d.querySelector("span");
    if(sp&&sp.textContent==="暂无标签")d.innerHTML="";
    var b=document.createElement("span");
    b.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800";
    b.innerHTML='<span>'+tag+'</span><button class="text-neutral-400 hover:text-red-500" onclick="this.parentElement.remove()">&times;</button>';
    d.appendChild(b);
    i.value="";
  });

  // Preview toggle
  var pvBtn=document.getElementById("ccr-preview-btn");
  var pvBox=document.getElementById("ccr-preview-box");
  var pvFrame=document.getElementById("ccr-preview-frame");
  if(pvBtn&&pvBox){pvBtn.addEventListener("click",function(){
    if(pvBox.style.display==="block"){pvBox.style.display="none";pvBtn.textContent="打开预览";}
    else{pvBox.style.display="block";pvBtn.textContent="关闭预览";
      var src=pvBtn.getAttribute("data-preview-src")||"/default";
      pvFrame.src=src+"?v="+Date.now();
    }
  });}

  // Generate MDX
  var gen=document.getElementById("ccr-generate-mdx");
  var out=document.getElementById("ccr-mdx-output");
  if(gen&&out)gen.addEventListener("click",function(){
    var fields=document.querySelectorAll("[data-ccr-key]");
    var vals={};fields.forEach(function(f){vals[f.getAttribute("data-ccr-key")]=f.value;});
    var w={id:vals.work_slug||"",title:vals.work_title||"",titleEn:vals.work_titleEn||"",
      category:vals.work_category||"photography",tags:[],personas:[],
      featured:false,thumbnail:vals.work_thumbnail||"",year:vals.work_year||"2026",
      client:vals.work_client||""
    };
    var tags=document.querySelectorAll("#ccr-tags-display span span");
    tags.forEach(function(s){w.tags.push(s.textContent);});
    document.querySelectorAll("#ccr-works-personas input:checked").forEach(function(cb){
      w.personas.push(cb.value);
    });
    if(document.getElementById("ccr-work-featured").checked)w.featured=true;
    var body=document.getElementById("ccr-work-body").value||"";
    var y="---\\n";
    y+="id: \\""+w.id+"\\"\\n";y+="title: \\""+w.title+"\\"\\n";y+="titleEn: \\""+w.titleEn+"\\"\\n";
    y+="category: \\""+w.category+"\\"\\n";
    y+="tags:\\n";w.tags.forEach(function(t){y+="  - \\""+t+"\\"\\n";});
    y+="personas:\\n";w.personas.forEach(function(p){y+="  - \\""+p+"\\"\\n";});
    y+="featured: "+w.featured+"\\n";
    y+="thumbnail: \\""+w.thumbnail+"\\"\\n";y+="year: "+w.year+"\\n";
    if(w.client)y+="client: \\""+w.client+"\\"\\n";
    y+="media: []\\n";
    y+="---\\n\\n"+body;
    out.innerHTML='<pre class="text-xs leading-relaxed whitespace-pre-wrap font-mono">'+y.replace(/</g,"&lt;").replace(/>/g,"&gt;")+'</pre>';
  });

  // Reset
  var r=document.getElementById("ccr-reset");
  if(r)r.addEventListener("click",function(){
    if(!confirm("清除所有编辑？不可撤销。"))return;
    localStorage.removeItem(K);store={};
    document.querySelectorAll("[data-ccr-key]").forEach(function(el){el.value="";});
    if(saved)saved.textContent="";
  });
})();`;

export default function CCRPage() {
  return (<>
    <style dangerouslySetInnerHTML={{ __html: `
      .ccr-panel { display: none }
      #r-content:checked~.ccr-wrap .ccr-content,
      #r-content:checked~.ccr-wrap .ccr-pvbtn-content { display: inline-block }
      #r-resume:checked~.ccr-wrap .ccr-resume,
      #r-resume:checked~.ccr-wrap .ccr-pvbtn-resume { display: inline-block }
      #r-pages:checked~.ccr-wrap .ccr-pages,
      #r-pages:checked~.ccr-wrap .ccr-pvbtn-pages { display: inline-block }
      #r-site:checked~.ccr-wrap .ccr-site,
      #r-site:checked~.ccr-wrap .ccr-pvbtn-site { display: inline-block }
      #r-works:checked~.ccr-wrap .ccr-works { display: block }
      #r-content:checked~.ccr-side label[for=r-content],
      #r-resume:checked~.ccr-side label[for=r-resume],
      #r-pages:checked~.ccr-side label[for=r-pages],
      #r-site:checked~.ccr-side label[for=r-site],
      #r-works:checked~.ccr-side label[for=r-works] {
        background:#171717;color:#fff;font-weight:500
      }
      @media(prefers-color-scheme:dark){
        #r-content:checked~.ccr-side label[for=r-content],
        #r-resume:checked~.ccr-side label[for=r-resume],
        #r-pages:checked~.ccr-side label[for=r-pages],
        #r-site:checked~.ccr-side label[for=r-site],
        #r-works:checked~.ccr-side label[for=r-works] {
          background:#f0f0f0;color:#111
        }
      }
      .ccr-pvbtn { display: none; }
      #ccr-preview-box { position: fixed; top: 60px; right: 16px; width: 380px; height: 520px;
        background:#fff; border:1px solid #d4d4d4; border-radius:8px; box-shadow:0 4px 24px rgba(0,0,0,0.12);
        z-index:100; overflow:hidden; display:none; resize:both; }
      @media(prefers-color-scheme:dark){#ccr-preview-box{background:#1a1a1a;border-color:#333;}}
      #ccr-preview-box iframe { width:380px; height:calc(520px - 36px); border:none;
        transform:scale(0.45);transform-origin:0 0;width:222%;height:222%; }
    `}} />

    <div className="min-h-screen flex bg-white dark:bg-neutral-950">
      <input type="radio" name="t" id="r-content" className="hidden" defaultChecked />
      <input type="radio" name="t" id="r-resume" className="hidden" />
      <input type="radio" name="t" id="r-pages" className="hidden" />
      <input type="radio" name="t" id="r-site" className="hidden" />
      <input type="radio" name="t" id="r-works" className="hidden" />

      {/* ---- Sidebar ---- */}
      <aside className="ccr-side w-48 shrink-0 border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="h-12 flex items-center px-4 border-b border-neutral-200 dark:border-neutral-800">
          <a href="/" className="text-sm font-semibold tracking-tight hover:opacity-60 uppercase">VE Archive</a>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          <label htmlFor="r-content" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">首页内容</label>
          <label htmlFor="r-resume" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">基本信息</label>
          <label htmlFor="r-pages" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">页面文字</label>
          <label htmlFor="r-site" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">网站设置</label>
          <label htmlFor="r-works" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            作品管理<span className="block text-xs opacity-50 mt-0.5 font-normal"></span>
          </label>
        </nav>
        <div className="p-2 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
          <button id="ccr-reset" className="w-full text-left px-2.5 py-1.5 rounded-sm text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">重置全部</button>
          <a href="/" className="block px-2.5 py-1.5 rounded-sm text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">← 返回网站</a>
        </div>
      </aside>

      {/* ---- Editor ---- */}
      <div className="ccr-wrap flex-1 flex flex-col min-w-0">
        <header className="h-12 shrink-0 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6 bg-white dark:bg-neutral-950">
          <h2 className="text-sm font-semibold">内容编辑</h2>
          <div className="flex items-center gap-3">
            <span id="ccr-saved" className="text-xs text-neutral-400" />
            <button id="ccr-preview-btn" className="ccr-pvbtn ccr-pvbtn-content text-xs px-3 py-1 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">打开预览</button>
          </div>
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
            {/* works */}
            <div className="ccr-panel ccr-works">
              <h3 className="text-lg font-semibold mb-2">作品管理</h3>
              <p className="text-sm text-neutral-500 mb-6">在下方填写新作品的信息。</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">作品名称</label>
                    <input data-ccr-key="work_title" className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" placeholder="作品标题" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Title (EN)</label>
                    <input data-ccr-key="work_titleEn" className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" placeholder="Project Title" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">文件 Slug</label>
                    <input data-ccr-key="work_slug" className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" placeholder="my-new-work" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">分类</label>
                    <select data-ccr-key="work_category" className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm">
                      <option>photography</option><option>film</option><option>ai</option><option>new-media</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">年份</label>
                    <input data-ccr-key="work_year" className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" placeholder="2026" type="number" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">客户</label>
                    <input data-ccr-key="work_client" className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" placeholder="个人创作" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-neutral-500 mb-1">缩略图路径</label>
                    <input data-ccr-key="work_thumbnail" className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" placeholder="/media/works/SLUG/thumb.jpg" />
                  </div>
                </div>
                {/* Tags */}
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">标签</label>
                  <div className="flex gap-2">
                    <input id="ccr-tag-input" className="flex-1 px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" placeholder="输入标签后点击添加" />
                    <button id="ccr-add-tag" className="px-4 py-2 rounded text-sm bg-black text-white dark:bg-white dark:text-black hover:opacity-80">添加</button>
                  </div>
                  <div id="ccr-tags-display" className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-xs text-neutral-400">暂无标签</span>
                  </div>
                </div>
                {/* Personas */}
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-2">展示身份</label>
                  <div id="ccr-works-personas" className="flex flex-wrap gap-2">
                    {["default","photographer","ai","director","freelance"].map((pid) => (
                      <label key={pid} className="flex items-center gap-1.5 text-sm cursor-pointer">
                        <input type="checkbox" value={pid} defaultChecked={pid==="default"} className="rounded" />
                        <span>{pid==="default"?"默认":pid==="photographer"?"摄影":pid==="ai"?"AI":pid==="director"?"导演":"商业"}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Body */}
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">正文 (Markdown)</label>
                  <textarea id="ccr-work-body" className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-mono" rows={8} placeholder="# 作品标题&#10;&#10;描述..." />
                </div>
                <button id="ccr-generate-mdx" className="px-5 py-2.5 rounded text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80">生成 MDX 文件内容</button>
                <div id="ccr-mdx-output" className="mt-3 p-4 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <p className="text-xs text-neutral-400">生成的内容将显示在这里。复制后在文件树中创建 .mdx 文件。</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    {/* Floating preview window */}
    <div id="ccr-preview-box">
      <div className="h-9 flex items-center justify-between px-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <span className="text-xs text-neutral-400">预览</span>
        <button onClick="document.getElementById('ccr-preview-box').style.display='none'" className="text-xs text-neutral-400 hover:text-neutral-600">&times;</button>
      </div>
      <iframe id="ccr-preview-frame" data-src="/default" />
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
