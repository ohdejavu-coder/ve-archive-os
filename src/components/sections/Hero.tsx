"use client";

import { usePersona } from "@/lib/identity/context";
import { useSiteContent } from "@/lib/content/ContentContext";
import { useLang } from "@/lib/language/context";
import type { Work } from "@/types/work";

interface HeroProps {
  works?: Work[];
}

export function Hero({ works = [] }: HeroProps) {
  const persona = usePersona();
  const { overrides } = useSiteContent();
  const { lang } = useLang();

  const headline = (overrides.personas?.[persona.id]?.heroHeadline as string)
    ?? persona.heroHeadline
    ?? "用影像讲述值得被看见的故事";
  const subtitle = (overrides.personas?.[persona.id]?.heroSubtitle as string)
    ?? persona.heroSubtitle
    ?? "";
  const statementZh = (overrides.personas?.[persona.id]?.personalStatement as string)
    ?? persona.personalStatement
    ?? "";
  const statementEn = (overrides.personas?.[persona.id]?.personalStatementEn as string)
    ?? persona.personalStatementEn
    ?? "";
  const statement = lang === "en" ? statementEn : statementZh;

  const bgImage = works.length > 0 && works[0].thumbnail
    ? works[0].thumbnail
    : null;

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-end overflow-hidden bg-neutral-900">
      {bgImage ? (
        <>
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover hero-image-reveal"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        </>
      ) : (
        <div className="absolute inset-0 bg-neutral-900">
          <div className="absolute inset-0 swiss-grid opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
      )}

      <div className="relative z-10 w-full pb-16 md:pb-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl space-y-6">
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
            <p className="text-lg md:text-xl text-white/60 max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}

          {statement && (
            <div className="flex items-start gap-4 pt-2 max-w-lg">
              <div className="w-0.5 min-h-[2rem] bg-[var(--red)] shrink-0 mt-1" />
              <p className="text-base md:text-lg text-white/50 italic leading-relaxed">
                &ldquo;{statement}&rdquo;
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href={`/${persona.id}/works`}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-sm text-sm font-semibold tracking-wide bg-white text-black hover:bg-neutral-200 transition-colors uppercase"
            >
              {lang === "en" ? "View Works" : "查看作品"}
            </a>
            <a
              href={`/${persona.id}/contact`}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-sm text-sm font-semibold tracking-wide border border-white/30 text-white hover:border-white/60 transition-colors uppercase"
            >
              {lang === "en" ? "Contact" : "联系我"}
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-8 z-10 hidden md:block">
        <div className="flex flex-col items-center gap-2 text-white/30">
          <div className="w-px h-8 bg-white/20" />
          <span className="text-[10px] tracking-[0.2em] uppercase rotate-90 origin-center mt-4">
            {lang === "en" ? "scroll" : "滚动"}
          </span>
        </div>
      </div>
    </section>
  );
}
