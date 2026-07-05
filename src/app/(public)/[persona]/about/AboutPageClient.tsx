"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePersona } from "@/lib/identity/context";
import { useLang } from "@/lib/language/context";
import { useOverrides } from "@/lib/content/OverrideContext";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { MDXRenderer } from "@/components/content/MDXRenderer";
import { CTA } from "@/components/sections/CTA";
import { Download } from "lucide-react";

function useLocalData(): Record<string, string> {
  const [data, setData] = useState<Record<string, string>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ve-content");
      if (raw) setData(JSON.parse(raw));
    } catch {}
  }, []);
  return data;
}

export function AboutPageClient({ fileContent }: { fileContent: string }) {
  const persona = usePersona();
  const { lang } = useLang();
  const overrides = useOverrides();
  const localData = useLocalData();

  const pageAboutZh = localData.page_about_zh ?? overrides.page_about_zh ?? fileContent;
  const pageAboutEn = localData.page_about_en ?? overrides.page_about_en ?? "";
  const content = lang === "en" && pageAboutEn ? pageAboutEn : pageAboutZh;

  const photoPath = localData.profilePhoto ?? persona.profilePhoto ?? "/media/profile/avatar.jpg";
  const statementZh = localData.personalStatement ?? persona.personalStatement ?? "";
  const statementEn = localData.personalStatementEn ?? persona.personalStatementEn ?? "";
  const statement = lang === "en" && statementEn ? statementEn : statementZh;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[var(--red)]" />
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-400 font-medium">About</span>
          </div>
          <Typography variant="h1" cinematic>{lang === "en" ? "About" : "关于"}</Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Left: Content */}
          <div className="lg:col-span-8">
            <MDXRenderer content={content} />
            <div className="mt-10 pt-6 pb-16 border-t border-neutral-200 dark:border-neutral-800">
              <a href="/resume/ve-archive-resume.pdf" download className="inline-flex items-center gap-2 px-6 py-3 rounded-sm text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity">
                <Download size={16} />{lang === "en" ? "Download Resume (PDF)" : "下载我的简历 (PDF)"}
              </a>
            </div>
          </div>

          {/* Right: Photo + Statement — sticky */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Photo */}
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-md bg-neutral-100 dark:bg-neutral-800">
                {photoPath ? (
                  <img
                    src={photoPath}
                    alt={persona.name}
                    className="w-full h-full object-cover hero-image-reveal"
                    onError={(e) => {
                      const t = e.currentTarget;
                      t.style.display = "none";
                      const p = t.parentElement;
                      if (p) {
                        p.classList.add("flex", "items-center", "justify-center");
                        p.innerHTML = '<div class="text-center p-6"><div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style="background:var(--red)20"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.5" opacity="0.5"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg></div><p class="text-sm mt-3" style="color:var(--red);opacity:0.6">添加个人照片</p></div>';
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: "var(--red)20" }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5" opacity="0.5">
                          <circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        </svg>
                      </div>
                      <p className="text-sm mt-3" style={{ color: "var(--red)", opacity: 0.6 }}>添加个人照片</p>
                      <p className="text-xs text-neutral-400 mt-1">在CCR首页内容中编辑</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Statement */}
              {statement && (
                <div className="border-l-2 border-[var(--red)] pl-4 pb-12">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                    &ldquo;{statement}&rdquo;
                  </p>
                </div>
              )}
              {!statement && (
                <div className="border-l-2 border-neutral-200 dark:border-neutral-700 pl-4 text-xs text-neutral-400">
                  在 <Link href="/ccr" className="underline hover:text-neutral-600">CCR 首页内容</Link> 编辑个人声明
                </div>
              )}
            </div>
          </aside>
        </div>
      </Container>
      <CTA />
    </section>
  );
}
