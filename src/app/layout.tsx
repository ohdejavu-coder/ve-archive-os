import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { loadSiteConfig, loadJSON, loadFile } from "@/lib/content/loader";
import { loadPersonas } from "@/lib/content/loader";
import type { SiteConfig, Resume } from "@/types/content";
import type { Persona } from "@/types/persona";
import { ContentProviderClient } from "./ContentProviderClient";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = loadSiteConfig();
  const personas = loadPersonas();
  let resume: Resume;
  try {
    resume = loadJSON<Resume>("resume/main.json");
  } catch {
    resume = {
      basics: {} as Resume["basics"],
      summary: "",
      summaryEn: "",
      experience: [],
      education: [],
      skills: [],
      languages: [],
      awards: [],
    } as Resume;
  }
  let aboutPage = "";
  let contactPage = "";
  try { aboutPage = loadFile("pages/about.mdx"); } catch { /* */ }
  try { contactPage = loadFile("pages/contact.mdx"); } catch { /* */ }

  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script src="https://cdn.tailwindcss.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: 'tailwind.config={darkMode:"class",theme:{extend:{colors:{background:"var(--bg)",foreground:"var(--fg)",accent:"var(--red)"}}}}',
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ContentProviderClient
          initialSite={site}
          initialPersonas={personas}
          initialResume={resume}
          initialPages={{ about: aboutPage, contact: contactPage }}
        >
          {children}
        </ContentProviderClient>
        {/* Cursor — pure DOM, zero React, fires before anything else renders */}
        <script dangerouslySetInnerHTML={{ __html: CURSOR_SCRIPT }} />
      </body>
    </html>
  );
}

const CURSOR_SCRIPT = `
(function(){
  var d=document.createElement('div');
  d.id='cursor-dot';
  document.body.appendChild(d);
  document.body.classList.add('cursor-ready');
  var mx=0,my=0,f=0;
  function m(e){mx=e.clientX;my=e.clientY;if(!f){f=requestAnimationFrame(function(){
    var el=document.elementFromPoint(mx,my);
    var big=!!(el&&el.closest('a,button,input,textarea,select,[role=button]'));
    d.className=big?'big':'';
    var s=big?14:9;
    d.style.transform='translate('+(mx-s)+'px,'+(my-s)+'px)';
    f=0;
  })}}
  document.addEventListener('mousemove',m,{passive:true});
})();
`.replace(/\s+/g, ' ');
