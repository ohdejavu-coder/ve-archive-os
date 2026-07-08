"use client";

import { useState, useEffect, useCallback } from "react";
import { usePersona } from "@/lib/identity/context";
import { useLang } from "@/lib/language/context";
import type { Work } from "@/types/work";

interface HeroProps { works?: Work[] }

function useLocalOverrides(): Record<string, string> {
  const [data, setData] = useState<Record<string, string>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ve-content");
      if (raw) setData(JSON.parse(raw));
    } catch {}
  }, []);
  return data;
}

export function Hero({ works = [] }: HeroProps) {
  const persona = usePersona();
  const { lang } = useLang();
  const local = useLocalOverrides();

  const headlineZh = local.heroHeadline || persona.heroHeadline || "用影像讲述值得被看见的故事";
  const headlineEn = local.heroHeadlineEn || persona.heroHeadlineEn;
  const headline = lang === "en" && headlineEn ? headlineEn : headlineZh;

  const subtitle = lang === "en" && persona.heroSubtitleEn
    ? persona.heroSubtitleEn
    : persona.heroSubtitle ?? "";

  const statementZh = local.personalStatement || persona.personalStatement || "";
  const statementEn = local.personalStatementEn || persona.personalStatementEn || "";
  const statement = lang === "en" && statementEn ? statementEn : statementZh;

  // Collect thumbnails from all works, photography first
  const heroImages = works
    .filter((w) => w.thumbnail)
    .sort((a, b) => {
      if (a.category === "photography" && b.category !== "photography") return -1;
      if (a.category !== "photography" && b.category === "photography") return 1;
      return b.year - a.year;
    })
    .map((w) => w.thumbnail);

  const hasImages = heroImages.length > 0;
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((i: number) => {
    if (i === current) return;
    setCurrent(i);
  }, [current]);

  // Auto-advance
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Reset if works array changes
  useEffect(() => {
    setCurrent(0);
  }, [works.length]);

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-end overflow-hidden bg-neutral-900">
      {/* Background — single img, key forces remount on change */}
      {hasImages && (
        <>
          <img
            key={current}
            src={heroImages[current]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover animate-fadeIn"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
        </>
      )}
      {!hasImages && (
        <div className="absolute inset-0 bg-neutral-900">
          <div className="absolute inset-0 swiss-grid opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
      )}

      <div className="relative z-10 w-full pb-16 md:pb-24 px-6 md:px-16 lg:px-24">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-0.5 bg-[var(--red)]" />
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 font-medium">
              {lang === "en" ? persona.nameEn : persona.name}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight text-white max-w-3xl">
            {headline}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/60 max-w-xl leading-relaxed">{subtitle}</p>
          )}
          {statement && (
            <div className="flex items-start gap-4 pt-2 max-w-lg">
              <div className="w-0.5 min-h-[2rem] bg-[var(--red)] shrink-0 mt-1" />
              <p className="text-base md:text-lg text-white/50 italic leading-relaxed">
                &ldquo;{statement}&rdquo;
              </p>
            </div>
          )}

          {/* Buttons + dots row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-4">
              <a href={`/${persona.id}/works`} className="inline-flex items-center justify-center px-8 py-3.5 rounded-sm text-sm font-semibold tracking-wide bg-white text-black hover:bg-neutral-200 transition-colors uppercase">
                {lang === "en" ? "View Works" : "查看作品"}
              </a>
              <a href={`/${persona.id}/contact`} className="inline-flex items-center justify-center px-8 py-3.5 rounded-sm text-sm font-semibold tracking-wide border border-white/30 text-white hover:border-white/60 transition-colors uppercase">
                {lang === "en" ? "Contact" : "联系我"}
              </a>
            </div>

            {/* Dot indicators — big click targets */}
            {heroImages.length > 1 && (
              <div className="flex items-center gap-1.5">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`px-2 py-3 transition-all duration-300 rounded-full group`}
                    aria-label={`第 ${i + 1} 张`}
                  >
                    <span className={`block rounded-full transition-all duration-300 ${
                      i === current
                        ? "bg-white h-1.5 w-5"
                        : "bg-white/40 h-1.5 w-1.5 group-hover:bg-white/70"
                    }`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
