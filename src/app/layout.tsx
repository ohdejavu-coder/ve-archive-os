import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = { title: "VE Archive OS", description: "Personal Brand Operating System" };

const SCRIPT = `(function(){
var d=document.createElement("div");d.id="cursor-dot";
document.body.appendChild(d);
var mx=0,my=0,hover=false,tracking=false;
function tick(){
  var el=document.elementFromPoint(mx,my);
  var big=!!(el&&el.closest("a,button,input,textarea,select,[role=button],[data-cursor-interactive],.cursor-default,[class*=cursor-default]"));
  // Only update class if changed
  var next=big?"big":"";
  if(d.className!==next)d.className=next;
  var s=big?25:7;d.style.transform="translate("+(mx-s)+"px,"+(my-s)+"px)";
  requestAnimationFrame(tick);
}
function show(){if(!tracking){tracking=true;document.body.classList.add("cursor-ready");d.style.opacity="1";}}
function hide(){tracking=false;document.body.classList.remove("cursor-ready");d.style.opacity="0";}
function cm(e){mx=e.clientX;my=e.clientY;show();}
document.addEventListener("mousemove",cm,{passive:true});
document.addEventListener("mouseleave",hide);
document.addEventListener("mouseenter",show);
tick();
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
