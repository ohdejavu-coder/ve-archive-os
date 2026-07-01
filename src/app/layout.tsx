import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VE Archive OS",
  description: "Personal Brand Operating System",
};

const SYNC_SCRIPT = `
(function(){
  try{
    var s=JSON.parse(localStorage.getItem("ve-content")||"{}");
    var els=document.querySelectorAll("[data-ccr-target]");
    for(var i=0;i<els.length;i++){
      var el=els[i];
      var k=el.getAttribute("data-ccr-target");
      if(s[k]!==undefined){
        if(el.tagName==="TEXTAREA"||el.tagName==="INPUT")continue;
        el.textContent=s[k];
      }
    }
    // MDX content special handling: replace innerHTML for page content
    var mdxEls=document.querySelectorAll("[data-ccr-mdxtarget]");
    for(var j=0;j<mdxEls.length;j++){
      var mel=mdxEls[j];
      var mk=mel.getAttribute("data-ccr-mdxtarget");
      if(s[mk]!==undefined){
        mel.innerHTML=s[mk].replace(/\\n/g,"<br>");
      }
    }
  }catch(e){}
})();
`.replace(/\s+/g, ' ');

const CURSOR_SCRIPT = `
(function(){
  var d=document.createElement('div');
  d.id='cursor-dot';
  document.body.appendChild(d);
  document.body.classList.add('cursor-ready');
  var mx=0,my=0,f=0;
  function m(e){
    mx=e.clientX;my=e.clientY;
    if(!f){f=requestAnimationFrame(function(){
      var el=document.elementFromPoint(mx,my);
      var big=!!(el&&el.closest('a,button,input,textarea,select,[role=button]'));
      d.className=big?'big':'';
      var s=big?25:7;
      d.style.transform='translate('+(mx-s)+'px,'+(my-s)+'px)';
      f=0;
    })}
  }
  document.addEventListener('mousemove',m,{passive:true});
})();
`.replace(/\s+/g, ' ');

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <script dangerouslySetInnerHTML={{ __html: SYNC_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: CURSOR_SCRIPT }} />
      </body>
    </html>
  );
}
