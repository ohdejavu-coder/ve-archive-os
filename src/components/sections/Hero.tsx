"use client";

import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { usePersona } from "@/lib/identity/context";
import { FilmStrip } from "./FilmStrip";

/**
 * Hero section — redesigned.
 *
 * Layout (desktop):
 *   Left column: Name, title, personal statement, CTAs
 *   Right column: Large cinematic portrait
 *   Background: Netflix-style scrolling film stills
 *
 * This is the first thing anyone sees.
 * It must answer: Who is this person? What do they do? Why should I care?
 * In under 10 seconds.
 */
export function Hero() {
  const persona = usePersona();

  const headline = persona.heroHeadline ?? "用影像讲述值得被看见的故事";
  const subtitle = persona.heroSubtitle ?? "";
  const statement = persona.personalStatement ?? "";
  const photoPath = persona.profilePhoto ?? "/media/profile/avatar.jpg";

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white dark:bg-neutral-950">
      {/* Cinematic film strip background */}
      <FilmStrip />

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

              {/* Photo container */}
              <div className="relative w-full h-full rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-lg bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={photoPath}
                  alt={`${persona.name} — ${persona.nameEn}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback: show a styled placeholder if image fails to load
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.classList.add(
                        "flex",
                        "items-center",
                        "justify-center"
                      );
                      const placeholder = document.createElement("div");
                      placeholder.className =
                        "text-center p-6 space-y-3";
                      placeholder.innerHTML = `
                        <div style="width:64px;height:64px;border-radius:50%;background:${persona.accentColor}20;margin:0 auto;display:flex;align-items:center;justify-content:center;">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${persona.accentColor}" stroke-width="1.5" opacity="0.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                        </div>
                        <p style="color:${persona.accentColor};font-size:0.875rem;opacity:0.6;">添加个人照片</p>
                      `;
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
