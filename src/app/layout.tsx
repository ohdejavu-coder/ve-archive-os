import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = { title: "VE Archive OS", description: "Personal Brand Operating System" };

const CURSOR = `
(function(){
  var d=document.createElement("div");d.id="cursor-dot";
  document.body.appendChild(d);
  document.body.classList.add("cursor-ready");
  var mx=0,my=0,cf=0;
  function cm(e){mx=e.clientX;my=e.clientY;if(!cf){cf=requestAnimationFrame(function(){
    var el=document.elementFromPoint(mx,my);
    var big=!!(el&&el.closest("a,button,input,textarea,select,[role=button]"));
    d.className=big?"big":"";
    var s=big?25:7;d.style.transform="translate("+(mx-s)+"px,"+(my-s)+"px)";
    cf=0;
  })}}
  document.addEventListener("mousemove",cm,{passive:true});
})();
`.replace(/\s+/g, " ");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <script dangerouslySetInnerHTML={{ __html: CURSOR }} />
      </body>
    </html>
  );
}
