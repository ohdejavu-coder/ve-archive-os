/**
 * CCR — Cookie-based content editor.
 * All edits saved to `ve-json` cookie. Persona layout reads it server-side.
 * Tab switching: CSS-only radio buttons.
 * Works manager: MDX generator.
 */

const SCRIPT = `!(function(){
  function L(){try{var r=document.cookie.match(/(^|; )ve-json=([^;]*)/);return r?JSON.parse(decodeURIComponent(r[2])):{}}catch(e){return{}}}
  function S(o){try{var v=encodeURIComponent(JSON.stringify(o));document.cookie="ve-json="+v+";path=/;max-age=86400";}catch(e){}}
  var store=L();
  var saved=document.getElementById("ccr-saved");
  function t(){if(saved)saved.textContent="已保存 "+new Date().toLocaleTimeString("zh-CN")}

  // Load stored values into all fields
  document.querySelectorAll("[data-ccr-key]").forEach(function(el){
    var k=el.getAttribute("data-ccr-key");
    if(store[k]!==undefined)el.value=store[k];
    el.addEventListener("input",function(){store[k]=el.value||"";S(store);t();});
  });

  // MDX generator
  var gen=document.getElementById("ccr-gen-mdx");
  var out=document.getElementById("ccr-mdx-out");
  if(gen&&out)gen.addEventListener("click",function(){
    var title=document.getElementById("wk-title").value||"";
    var titleEn=document.getElementById("wk-titleEn").value||"";
    var slug=document.getElementById("wk-slug").value||"new-work";
    var cat=document.getElementById("wk-cat").value||"photography";
    var year=document.getElementById("wk-year").value||"2026";
    var client=document.getElementById("wk-client").value||"";
    var thumb=document.getElementById("wk-thumb").value||"";
    var body=document.getElementById("wk-body").value||"";
    // Collect tags
    var tags=[];
    document.querySelectorAll("#ccr-tags-display span span").forEach(function(s){tags.push(s.textContent);});
    // Collect personas
    var personas=[];
    document.querySelectorAll("#ccr-works-personas input:checked").forEach(function(cb){personas.push(cb.value);});
    var feat=document.getElementById("wk-featured").checked;
    var y="---\\n";
    y+="id: \\""+slug+"\\"\\n";
    y+="title: \\""+title+"\\"\\n";
    y+="titleEn: \\""+titleEn+"\\"\\n";
    y+="category: \\""+cat+"\\"\\n";
    y+="tags:\\n";tags.forEach(function(t){y+="  - \\""+t+"\\"\\n;});
    y+="personas:\\n";personas.forEach(function(p){y+="  - \\""+p+"\\"\\n;});
    y+="featured: "+feat+"\\n";
    y+="thumbnail: \\""+thumb+"\\"\\n";
    if(client)y+="client: \\""+client+"\\"\\n";
    y+="year: "+year+"\\n";
    y+="media: []\\n";
    y+="---\\n\\n"+body;
    out.innerHTML="<pre style='font-size:11px;line-height:1.5;white-space:pre-wrap;word-break:break-all;font-family:monospace;'>"+y.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\\\\n/g,"\\n")+"</pre>";
  });

  // Add tag
  var at=document.getElementById("ccr-add-tag");
  if(at)at.addEventListener("click",function(){
    var i=document.getElementById("ccr-tag-input");
    var tag=i.value.trim();if(!tag)return;
    var d=document.getElementById("ccr-tags-display");
    var sp=d.querySelector("span");if(sp&&sp.textContent==="暂无标签")d.innerHTML="";
    var b=document.createElement("span");
    b.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800";
    b.innerHTML='<span>'+tag+'</span><button class="text-neutral-400 hover:text-red-500" onclick="this.parentElement.remove()">&times;</button>';
    d.appendChild(b);i.value="";
  });

  // Reset
  var r=document.getElementById("ccr-reset");
  if(r)r.addEventListener("click",function(){
    if(!confirm("清除所有编辑？不可撤销。"))return;
    document.cookie="ve-json=;path=/;max-age=0";store={};
    document.querySelectorAll("[data-ccr-key]").forEach(function(el){el.value="";});
    if(saved)saved.textContent="";
  });
})();`;

export default function CCRPage() {
  return (<>
    <style dangerouslySetInnerHTML={{ __html: `
      .ccr-panel { display: none }
      #r-hero:checked~.ccr-wrap .ccr-hero { display: block }
      #r-resume:checked~.ccr-wrap .ccr-resume { display: block }
      #r-pages:checked~.ccr-wrap .ccr-pages { display: block }
      #r-site:checked~.ccr-wrap .ccr-site { display: block }
      #r-works:checked~.ccr-wrap .ccr-works { display: block }
      #r-hero:checked~.ccr-side label[for=r-hero],
      #r-resume:checked~.ccr-side label[for=r-resume],
      #r-pages:checked~.ccr-side label[for=r-pages],
      #r-site:checked~.ccr-side label[for=r-site],
      #r-works:checked~.ccr-side label[for=r-works] {
        background:#171717;color:#fff;font-weight:500
      }
      @media(prefers-color-scheme:dark){
        #r-hero:checked~.ccr-side label[for=r-hero],
        #r-resume:checked~.ccr-side label[for=r-resume],
        #r-pages:checked~.ccr-side label[for=r-pages],
        #r-site:checked~.ccr-side label[for=r-site],
        #r-works:checked~.ccr-side label[for=r-works] {
          background:#f0f0f0;color:#111
        }
      }
    `}} />

    <div className="min-h-screen flex bg-white dark:bg-neutral-950">
      <input type="radio" name="t" id="r-hero" className="hidden" defaultChecked />
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
          <label htmlFor="r-hero" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">首页内容</label>
          <label htmlFor="r-resume" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">基本信息</label>
          <label htmlFor="r-pages" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">页面文字</label>
          <label htmlFor="r-site" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">网站设置</label>
          <label htmlFor="r-works" className="block cursor-pointer px-2.5 py-1.5 rounded-sm text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">作品管理</label>
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
          <span id="ccr-saved" className="text-xs text-neutral-400" />
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-xl space-y-5">

            {/* HERO */}
            <div className="ccr-panel ccr-hero">
              <h3 className="text-lg font-semibold mb-2">Hero 标题与声明</h3>
              <p className="text-sm text-neutral-500 mb-5">编辑后刷新首页即可看到。所有身份共享同一份内容。</p>
              <F k="heroHeadline" l="Hero 标题（中文）" p="用影像讲述值得被看见的故事" />
              <F k="heroHeadlineEn" l="Hero Headline (English)" p="Stories Worth Seeing" />
              <F k="heroSubtitle" l="副标题（中文）" p="摄影 · 影视 · AI 创作 · 新媒体" />
              <F k="heroSubtitleEn" l="Subtitle (English)" p="Photography · Film · AI" />
              <F k="personalStatement" l="个人声明（中文）" p="我是一名拥有电影制作背景的视觉创作者…" a />
              <F k="personalStatementEn" l="Personal Statement (English)" p="I am a visual creator…" a />
              <F k="profilePhoto" l="头像图片路径" p="/media/profile/avatar.jpg" />
            </div>

            {/* RESUME */}
            <div className="ccr-panel ccr-resume">
              <h3 className="text-lg font-semibold mb-2">基本信息</h3>
              <p className="text-sm text-neutral-500 mb-5">编辑后去简历页刷新即可看到。</p>
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
              <div className="mt-5"><F k="resume_summary" l="个人简介（中文）" p="拥有电影制作专业背景的视觉创作者…" a /></div>
              <div className="mt-5"><F k="resume_summaryEn" l="Summary (English)" p="A visual creator…" a /></div>
            </div>

            {/* PAGES */}
            <div className="ccr-panel ccr-pages">
              <F k="page_about" l="关于页内容 (Markdown)" p="# 关于我&#10;&#10;我是一名拥有电影制作背景的视觉创作者。&#10;&#10;我相信影像的力量——它不需要翻译，不需要解释，就能在人与人之间建立连接。" a n={8} />
              <div className="mt-8">
                <F k="page_contact" l="联系页内容 (Markdown)" p="## 合作意向&#10;&#10;欢迎以下类型的合作：&#10;&#10;- 摄影项目&#10;- 影视制作&#10;- AI 创作&#10;&#10;邮箱：hello@vearchive.com&#10;&#10;48 小时内回复。" a n={8} />
              </div>
            </div>

            {/* SITE */}
            <div className="ccr-panel ccr-site">
              <F k="site_title" l="网站标题" p="VE Archive" />
              <F k="site_footer" l="页脚文本" p="© 2026 VE Archive. All rights reserved." />
            </div>

            {/* WORKS */}
            <div className="ccr-panel ccr-works">
              <h3 className="text-lg font-semibold mb-2">新建作品</h3>
              <p className="text-sm text-neutral-500 mb-5">填写表单 → 点生成 MDX → 复制 → 在左侧文件树 content/works/ 下新建 .mdx 文件 → 粘贴 → 保存。</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium text-neutral-500 mb-1">作品名称</label><input id="wk-title" className={IC} placeholder="作品标题" /></div>
                  <div><label className="block text-xs font-medium text-neutral-500 mb-1">Title (EN)</label><input id="wk-titleEn" className={IC} placeholder="Project Title" /></div>
                  <div><label className="block text-xs font-medium text-neutral-500 mb-1">文件 Slug</label><input id="wk-slug" className={IC} placeholder="my-new-work" /></div>
                  <div><label className="block text-xs font-medium text-neutral-500 mb-1">分类</label><select id="wk-cat" className={IC}><option>photography</option><option>film</option><option>ai</option><option>new-media</option></select></div>
                  <div><label className="block text-xs font-medium text-neutral-500 mb-1">年份</label><input id="wk-year" className={IC} placeholder="2026" type="number" /></div>
                  <div><label className="block text-xs font-medium text-neutral-500 mb-1">客户</label><input id="wk-client" className={IC} placeholder="个人创作" /></div>
                  <div className="col-span-2"><label className="block text-xs font-medium text-neutral-500 mb-1">缩略图路径</label><input id="wk-thumb" className={IC} placeholder="/media/works/SLUG/thumb.jpg" /></div>
                </div>
                {/* Tags */}
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">标签</label>
                  <div className="flex gap-2"><input id="ccr-tag-input" className="flex-1 px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" placeholder="输入标签后点击添加" /><button id="ccr-add-tag" className="px-4 py-2 rounded text-sm bg-black text-white dark:bg-white dark:text-black hover:opacity-80">添加</button></div>
                  <div id="ccr-tags-display" className="flex flex-wrap gap-1.5 mt-2"><span className="text-xs text-neutral-400">暂无标签</span></div>
                </div>
                {/* Personas */}
                <div><label className="block text-xs font-medium text-neutral-500 mb-2">展示身份</label>
                  <div id="ccr-works-personas" className="flex flex-wrap gap-2">
                    {["default","photographer","ai","director","freelance"].map((pid) => (
                      <label key={pid} className="flex items-center gap-1.5 text-sm cursor-pointer"><input type="checkbox" value={pid} defaultChecked className="rounded" /><span>{pid==="default"?"默认":pid==="photographer"?"摄影":pid==="ai"?"AI":pid==="director"?"导演":"商业"}</span></label>
                    ))}
                  </div>
                </div>
                {/* Featured */}
                <label className="flex items-center gap-2 cursor-pointer"><input id="wk-featured" type="checkbox" className="rounded" /><span className="text-sm">设为精选作品</span></label>
                {/* Body */}
                <div><label className="block text-xs font-medium text-neutral-500 mb-1">正文 (Markdown)</label><textarea id="wk-body" className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-mono" rows={8} placeholder="# 作品标题&#10;&#10;描述..." /></div>

                <button id="ccr-gen-mdx" className="px-5 py-2.5 rounded text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80">生成 MDX 文件内容</button>
                <div id="ccr-mdx-out" className="p-4 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"><p className="text-xs text-neutral-400">生成的内容将显示在这里。复制后在文件树中创建 .mdx 文件。</p></div>
              </div>

              <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="text-lg font-semibold mb-3">媒体文件管理</h3>
                <div className="p-4 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <p>在 VS Code 左侧文件树中：</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>将图片/视频拖入 <code className="text-xs bg-neutral-200 dark:bg-neutral-700 px-1 rounded">public/media/works/你的作品名/</code></li>
                    <li>回到此页面，在缩略图路径填入对应路径</li>
                    <li>生成 MDX 后在 <code className="text-xs bg-neutral-200 dark:bg-neutral-700 px-1 rounded">content/works/</code> 新建 .mdx 文件</li>
                    <li>保存后 CodeSandbox/本地热更新即时生效</li>
                  </ol>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
    <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
  </>);
}

const IC = "w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent transition-colors";

function F({ k, l, p, a, n }: { k: string; l: string; p?: string; a?: boolean; n?: number }) {
  return (<div>
    <label className="block text-xs font-medium text-neutral-500 mb-1">{l}</label>
    {a
      ? <textarea className={IC} rows={n ?? 4} data-ccr-key={k} placeholder={p} />
      : <input className={IC} data-ccr-key={k} placeholder={p} />}
  </div>);
}
