"use client";

import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { usePersona } from "@/lib/identity/context";
import { FilmStrip } from "./FilmStrip";
import { PortraitPhoto } from "@/components/content/PortraitPhoto";
import type { Work } from "@/types/work";

interface HeroProps {
  /** Works for the FilmStrip background thumbnails */
  works?: Work[];
}

/**
 * Hero section — redesigned.
 *
 * Layout (desktop):
 *   Left column: Name, title, personal statement, CTAs
 *   Right column: Large cinematic portrait
 *   Background: Netflix-style scrolling film stills (from real works)
 *
 * This is the first thing anyone sees.
 * It must answer: Who is this person? What do they do? Why should I care?
 * In under 10 seconds.
 */
export function Hero({ works = [] }: HeroProps) {
  const persona = usePersona();

  const headline = persona.heroHeadline ?? "用影像讲述值得被看见的故事";
  const subtitle = persona.heroSubtitle ?? "";
  const statement = persona.personalStatement ?? "";
  const photoPath = persona.profilePhoto ?? "/media/profile/avatar.jpg";

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white dark:bg-neutral-950">
      {/* Cinematic film strip background */}
      <FilmStrip works={works} />

      {/* Content */}
      <Container className="relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center py-16 lg:py-0">
          {/* ---- LEFT: Text content ---- */}
          <div className="lg:col-span-7 space-y-6">
            {/* Subtle identity label */}
            <div className="flex items-center gap-2">
              <span
                className="w-8 h-px"
                style={{ backgroundColor: persona.accentColor }}
              />
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-medium">
                {persona.nameEn}
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight text-neutral-900 dark:text-neutral-100">
              {headline}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-lg sm:text-xl text-neutral-500 max-w-xl leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Personal statement — the soul of the hero */}
            {statement && (
              <div className="relative pl-5 border-l-2" style={{ borderColor: persona.accentColor }}>
                <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-lg italic">
                  "{statement}"
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                href={`/${persona.id}/works`}
                variant="primary"
                size="lg"
              >
                查看作品
              </Button>
              <Button
                href={`/${persona.id}/contact`}
                variant="secondary"
                size="lg"
              >
                联系我
              </Button>
            </div>
          </div>

          {/* ---- RIGHT: Profile photo ---- */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 lg:w-80 lg:h-[30rem]">
              {/* Decorative frame */}
              <div
                className="absolute -inset-3 rounded-2xl opacity-20"
                style={{ backgroundColor: persona.accentColor }}
              />
              <PortraitPhoto
                src={photoPath}
                alt={`${persona.name} — ${persona.nameEn}`}
                accentColor={persona.accentColor}
                aspectRatio="aspect-[4/5]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
