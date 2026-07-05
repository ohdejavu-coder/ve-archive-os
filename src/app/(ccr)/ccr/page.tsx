/**
 * CCR — Google Settings-style content editor.
 * Each tab has a Save button. Edits go to `ve-json` cookie.
 */

const SCRIPT = `
(function(){
  var K="ve-json";
  function load(){try{var m=document.cookie.match(new RegExp("(^|; )"+K+"=([^;]*)"));return m?JSON.parse(decodeURIComponent(m[2])):{}}catch(e){return{}}}
  function save(o){try{document.cookie=K+"="+encodeURIComponent(JSON.stringify(o))+";path=/;max-age=86400";return true;}catch(e){return false}}

  // Load stored values into fields
  var store=load();
  document.querySelectorAll("[data-ccr-key]").forEach(function(el){
    var k=el.getAttribute("data-ccr-key");
    if(store[k]!==undefined)el.value=store[k];
  });

  // Global save — reads all fields, writes cookie
  window.ccrSave=function(){
    var s=load();
    document.querySelectorAll("[data-ccr-key]").forEach(function(el){
      s[el.getAttribute("data-ccr-key")]=el.value||"";
    });
    if(save(s)){
      var el=document.getElementById("ccr-saved");
      if(el)el.textContent="已保存 "+new Date().toLocaleTimeString("zh-CN");
    }
  };

  // Reset
  var r=document.getElementById("ccr-reset");
  if(r)r.addEventListener("click",function(){
    if(!confirm("清除所有编辑？不可撤销。"))return;
    document.cookie=K+"=;path=/;max-age=0";
    document.querySelectorAll("[data-ccr-key]").forEach(function(el){el.value="";});
    var el=document.getElementById("ccr-saved");if(el)el.textContent="";
  });

  // MDX generator
  var gen=document.getElementById("ccr-gen-mdx");
  if(gen)gen.addEventListener("click",function(){
    var title=document.getElementById("wk-title").value||"",titleEn=document.getElementById("wk-titleEn").value||"",
    slug=document.getElementById("wk-slug").value||"new-work",cat=document.getElementById("wk-cat").value||"photography",
    year=document.getElementById("wk-year").value||"2026",client=document.getElementById("wk-client").value||"",
    thumb=document.getElementById("wk-thumb").value||"",body=document.getElementById("wk-body").value||"";
    var tags=[];document.querySelectorAll("#ccr-tags-display span span").forEach(function(s){tags.push(s.textContent);});
    var personas=[];document.querySelectorAll("#ccr-works-personas input:checked").forEach(function(cb){personas.push(cb.value);});
    var feat=document.getElementById("wk-featured").checked;
    var o="---\\nid: \\""+slug+"\\"\\ntitle: \\""+title+"\\"\\ntitleEn: \\""+titleEn+"\\"\\ncategory: \\""+cat+"\\"\\ntags:\\n";
    tags.forEach(function(t){o+="  - \\""+t+"\\"\\n;});
    o+="personas:\\n";personas.forEach(function(p){o+="  - \\""+p+"\\"\\n;});
    o+="featured: "+feat+"\\nthumbnail: \\""+thumb+"\\"\\nyear: "+year+"\\n";
    if(client)o+="client: \\""+client+"\\"\\n";
    o+="media: []\\n---\\n\\n"+body;
    var el=document.getElementById("ccr-mdx-out");
    el.innerHTML="<pre style='font-size:11px;line-height:1.5;white-space:pre-wrap;word-break:break-all;font-family:monospace;'>"+o.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\\\\n/g,"\\n")+"</pre>";
  });

  // Add tag
  var at=document.getElementById("ccr-add-tag");
  if(at)at.addEventListener("click",function(){
    var i=document.getElementById("ccr-tag-input"),tag=i.value.trim();if(!tag)return;
    var d=document.getElementById("ccr-tags-display"),sp=d.querySelector("span");
    if(sp&&sp.textContent==="暂无标签")d.innerHTML="";
    var b=document.createElement("span");
    b.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800";
    b.innerHTML="<span>"+tag+'</span><button class="text-neutral-400 hover:text-red-500" onclick="this.parentElement.remove()">&times;</button>';
    d.appendChild(b);i.value="";
  });
})();
`.replace(/\s+/g, " ");

export default function CCRPage() {
  return (<>
    <style dangerouslySetInnerHTML={{ __html: `
      .ccr-panel { display: none }
      #r-hero:checked~.ccr-body .ccr-hero { display: block }
      #r-resume:checked~.ccr-body .ccr-resume { display: block }
      #r-pages:checked~.ccr-body .ccr-pages { display: block }
      #r-site:checked~.ccr-body .ccr-site { display: block }
      #r-works:checked~.ccr-body .ccr-works { display: block }
    `}} />

    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Radio controls */}
      <input type="radio" name="ccr" id="r-hero" className="hidden" defaultChecked />
      <input type="radio" name="ccr" id="r-resume" className="hidden" />
      <input type="radio" name="ccr" id="r-pages" className="hidden" />
      <input type="radio" name="ccr" id="r-site" className="hidden" />
      <input type="radio" name="ccr" id="r-works" className="hidden" />

      {/* ---- Top bar ---- */}
      <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-8 bg-white dark:bg-neutral-950 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <a href="/" className="text-sm font-semibold tracking-tight hover:opacity-60 uppercase">VE Archive</a>
          <h1 className="text-base font-medium">设置</h1>
        </div>
        <div className="flex items-center gap-3">
          <span id="ccr-saved" className="text-xs text-neutral-400" />
          <button onClick="window.ccrSave&&ccrSave()" className="px-5 py-2 rounded-sm text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity">
            保存所有更改
          </button>
        </div>
      </header>

      <div className="flex">
        {/* ---- Sidebar ---- */}
        <aside className="w-56 shrink-0 border-r border-neutral-200 dark:border-neutral-800 min-h-[calc(100vh-3.5rem)]">
          <nav className="p-3 space-y-0.5">
            {[
              { id: "r-hero", label: "首页内容", desc: "Hero 标题、声明、头像" },
              { id: "r-resume", label: "基本信息", desc: "姓名、职位、邮箱、简介" },
              { id: "r-pages", label: "页面文字", desc: "关于页面、联系页面" },
              { id: "r-site", label: "网站设置", desc: "标题、页脚" },
              { id: "r-works", label: "作品管理", desc: "新建、编辑作品" },
            ].map((item) => (
              <label key={item.id} htmlFor={item.id} className="block cursor-pointer px-3 py-2.5 rounded-md text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-neutral-400 mt-0.5 font-normal">{item.desc}</div>
              </label>
            ))}
          </nav>
          <div className="mx-3 mt-2 pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <button id="ccr-reset" className="w-full text-left px-3 py-2 rounded-md text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              重置全部编辑
            </button>
            <a href="/" className="block px-3 py-2 rounded-md text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors mt-0.5">
              ← 返回网站
            </a>
          </div>
        </aside>

        {/* ---- Content ---- */}
        <main className="flex-1 p-8 sm:p-12 max-w-3xl ccr-body">
          {/* HERO */}
          <div className="ccr-panel ccr-hero space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-6">首页 Hero 内容</h2>
              <p className="text-sm text-neutral-500 mb-8">编辑后保存，去首页刷新即可看到更新。所有身份共享同一份 Hero 内容。</p>
              <div className="space-y-6">
                <F k="heroHeadline" l="Hero 标题（中文）" p="用影像讲述值得被看见的故事" />
                <F k="heroHeadlineEn" l="Hero Headline (English)" p="Stories Worth Seeing, Told Through Images" />
                <F k="heroSubtitle" l="副标题（中文）" p="摄影 · 影视 · AI 创作 · 新媒体" />
                <F k="heroSubtitleEn" l="Subtitle (English)" p="Photography · Film · AI Creation · New Media" />
                <F k="personalStatement" l="个人声明（中文）" p="我是一名拥有电影制作背景的视觉创作者…" a />
                <F k="personalStatementEn" l="Personal Statement (English)" p="I am a visual creator…" a />
                <F k="profilePhoto" l="头像图片路径" p="/media/profile/avatar.jpg" />
              </div>
            </div>
            <SaveBtn />
          </div>

          {/* RESUME */}
          <div className="ccr-panel ccr-resume space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-6">基本信息</h2>
              <p className="text-sm text-neutral-500 mb-8">编辑后保存，去简历页刷新即可看到更新。</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <F k="resume_basics_name" l="姓名" p="创作者姓名" />
                <F k="resume_basics_nameEn" l="Name (English)" p="Your Name" />
                <F k="resume_basics_title" l="职位" p="摄影师 / 导演" />
                <F k="resume_basics_titleEn" l="Title (English)" p="Photographer / Director" />
                <F k="resume_basics_location" l="地点" p="中国 · 上海" />
                <F k="resume_basics_email" l="邮箱" p="hello@vearchive.com" />
                <F k="resume_basics_phone" l="电话" p="手机号码" />
                <F k="resume_basics_website" l="网站" p="https://..." />
              </div>
              <div className="mt-6 space-y-6">
                <F k="resume_summary" l="个人简介（中文）" p="拥有电影制作专业背景的视觉创作者…" a />
                <F k="resume_summaryEn" l="Summary (English)" p="A visual creator…" a />
              </div>
            </div>
            <SaveBtn />
          </div>

          {/* PAGES */}
          <div className="ccr-panel ccr-pages space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-6">页面文字</h2>
              <p className="text-sm text-neutral-500 mb-8">编辑后保存，去对应页面刷新即可看到更新。支持 Markdown 格式。</p>
              <div className="space-y-8">
                <div>
                  <h3 className="text-base font-medium mb-3">关于页面</h3>
                  <F k="page_about" l="关于页内容" p="# 关于我&#10;&#10;我是一名拥有电影制作背景的视觉创作者。&#10;&#10;我相信影像的力量——它不需要翻译，不需要解释，就能在人与人之间建立连接。" a n={10} />
                </div>
                <div>
                  <h3 className="text-base font-medium mb-3">联系页面</h3>
                  <F k="page_contact" l="联系页内容" p="## 合作意向&#10;&#10;欢迎以下类型的合作：&#10;&#10;- 摄影项目&#10;- 影视制作&#10;- AI 创作&#10;&#10;邮箱：hello@vearchive.com&#10;&#10;48 小时内回复。" a n={10} />
                </div>
              </div>
            </div>
            <SaveBtn />
          </div>

          {/* SITE */}
          <div className="ccr-panel ccr-site space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-6">网站设置</h2>
              <div className="space-y-6">
                <F k="site_title" l="网站标题" p="VE Archive" />
                <F k="site_footer" l="页脚文本" p="© 2026 VE Archive. All rights reserved." />
              </div>
            </div>
            <SaveBtn />
          </div>

          {/* WORKS */}
          <div className="ccr-panel ccr-works space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">新建作品</h2>
              <p className="text-sm text-neutral-500 mb-8">填写表单 → 生成 MDX → 在文件树中 <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">content/works/</code> 下创建 .mdx 文件 → 粘贴。</p>
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
                  <div className="flex gap-2"><input id="ccr-tag-input" className="flex-1 px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm" placeholder="输入标签 → 点击添加" /><button id="ccr-add-tag" className="px-4 py-2 rounded text-sm bg-black text-white dark:bg-white dark:text-black hover:opacity-80">添加</button></div>
                  <div id="ccr-tags-display" className="flex flex-wrap gap-1.5 mt-2"><span className="text-xs text-neutral-400">暂无标签</span></div>
                </div>
                <div><label className="block text-xs font-medium text-neutral-500 mb-2">展示身份</label>
                  <div id="ccr-works-personas" className="flex flex-wrap gap-3">
                    {["default","photographer","ai","director","freelance"].map((pid) => (<label key={pid} className="flex items-center gap-1.5 text-sm cursor-pointer"><input type="checkbox" value={pid} defaultChecked className="rounded" /><span>{pid==="default"?"默认":pid==="photographer"?"摄影":pid==="ai"?"AI":pid==="director"?"导演":"商业"}</span></label>))}
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer"><input id="wk-featured" type="checkbox" className="rounded" /><span className="text-sm">设为精选作品</span></label>
                <div><label className="block text-xs font-medium text-neutral-500 mb-1">正文 (Markdown)</label><textarea id="wk-body" className="w-full px-4 py-3 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-mono" rows={8} placeholder="# 作品标题&#10;&#10;描述..." /></div>
                <button id="ccr-gen-mdx" className="px-5 py-2.5 rounded text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80">生成 MDX 文件内容</button>
                <div id="ccr-mdx-out" className="p-4 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"><p className="text-xs text-neutral-400">生成的内容将显示在这里。</p></div>
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
        </main>
      </div>
    </div>
    <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
  </>);
}

const IC = "w-full px-4 py-3 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--red)] focus:border-transparent transition-colors";

function F({ k, l, p, a, n }: { k: string; l: string; p?: string; a?: boolean; n?: number }) {
  return (<div>
    <label className="block text-xs font-medium text-neutral-500 mb-1.5">{l}</label>
    {a
      ? <textarea className={IC + " resize-y"} rows={n ?? 4} data-ccr-key={k} placeholder={p} />
      : <input className={IC} data-ccr-key={k} placeholder={p} />}
  </div>);
}

function SaveBtn() {
  return (
    <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
      <button onClick="window.ccrSave&&ccrSave()" className="px-6 py-2.5 rounded text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity">
        保存更改
      </button>
      <span className="text-xs text-neutral-400">保存后去对应页面刷新即可看到更新</span>
    </div>
  );
}
