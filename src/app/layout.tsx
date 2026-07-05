import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = { title: "VE Archive OS", description: "Personal Brand Operating System" };

const SCRIPT = `(function(){
try{
var d=document.createElement("div");d.id="cursor-dot";d.style.opacity="0";
document.body.appendChild(d);
var mx=0,my=0,tracking=false;
function tick(){
  var el=document.elementFromPoint(mx,my);
  var isText=!!(el&&(el.tagName==="INPUT"||el.tagName==="TEXTAREA"));
  if(isText){d.style.opacity="0";}else{if(tracking)d.style.opacity="1";}
  var big=!!(el&&el.closest("a,button,select,[role=button],[data-cursor-interactive]"));
  var next=big&&!isText?"big":"";
  if(d.className!==next)d.className=next;
  var s=big?25:7;d.style.transform="translate("+(mx-s)+"px,"+(my-s)+"px)";
  requestAnimationFrame(tick);
}
function show(){if(!tracking){tracking=true;try{document.body.classList.add("cursor-ready")}catch(e){};}}
function hide(){tracking=false;try{document.body.classList.remove("cursor-ready")}catch(e){};d.style.opacity="0";}
function cm(e){mx=e.clientX;my=e.clientY;show();}
document.addEventListener("mousemove",cm,{passive:true});
document.addEventListener("mouseleave",hide);
document.addEventListener("mouseenter",function(){d.style.opacity="1";});
tick();
}catch(e){}
})();`.replace(/\s+/g," ");

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
