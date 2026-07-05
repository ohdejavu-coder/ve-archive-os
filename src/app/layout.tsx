import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = { title: "VE Archive OS", description: "Personal Brand Operating System" };

const SCRIPT = `
(function(){
  var d=document.createElement("div");d.id="cursor-dot";d.style.opacity="0";
  document.body.appendChild(d);
  var mx=0,my=0,cf=0,visible=false;
  function show(){if(!visible){visible=true;d.style.transition="opacity .15s ease,width .2s ease,height .2s ease,background .2s ease";d.style.opacity="1";document.body.classList.add("cursor-ready");}}
  function hide(){if(visible){visible=false;d.style.transition="opacity .15s ease,width .2s ease,height .2s ease,background .2s ease";d.style.opacity="0";document.body.classList.remove("cursor-ready");}}
  function cm(e){mx=e.clientX;my=e.clientY;show();if(!cf){cf=requestAnimationFrame(function(){
    var el=document.elementFromPoint(mx,my);
    var big=!!(el&&el.closest("a,button,input,textarea,select,[role=button]"));
    d.className=big?"big":"";
    var s=big?25:7;d.style.transform="translate("+(mx-s)+"px,"+(my-s)+"px)";
    cf=0;
  })}}
  document.addEventListener("mousemove",cm,{passive:true});
  document.addEventListener("mouseleave",hide);
  document.addEventListener("mouseenter",function(){d.style.opacity="1";});
})();
`.replace(/\s+/g, " ");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      </body>
    </html>
  );
}
