"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { usePersona } from "@/lib/identity/context";
import type { Work } from "@/types/work";

interface FilmStripProps {
  /** Real work thumbnails to display. Falls back to geometric placeholders. */
  works?: Work[];
}

/**
 * FilmStrip — Netflix-style horizontal scrolling stills background.
 *
 * Two rows of work thumbnails scrolling in opposite directions at low opacity.
 * Creates cinematic atmosphere without distracting from Hero content.
 *
 * Per Principle 01: animation assists but never obstructs reading.
 * Per Principle 05: cinematic, restrained, professional.
 */
export function FilmStrip({ works = [] }: FilmStripProps) {
  const persona = usePersona();
  const accent = persona.accentColor;

  const thumbnails = useMemo(() => {
    if (works.length > 0) {
      return works.map((w) => w.thumbnail).filter(Boolean);
    }
    // Fallback: generate placeholder "frames"
    return Array.from({ length: 8 }, (_, i) => `__placeholder_${i}`);
  }, [works]);

  const doubled = [...thumbnails, ...thumbnails];

  const [offset1, setOffset1] = useState(0);
  const [offset2, setOffset2] = useState(0);

  useEffect(() => {
    let frame: number;
    let lastTime = performance.now();

    function animate(now: number) {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setOffset1((prev) => (prev - 28 * dt) % (thumbnails.length * 220));
      setOffset2((prev) => (prev + 18 * dt) % (thumbnails.length * 180));

      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [thumbnails.length]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Edge fades — keep text readable */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/20 to-white dark:from-neutral-950 dark:via-neutral-950/20 dark:to-neutral-950" />

      {/* Row 1 — scrolls left */}
      <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden opacity-[0.10] dark:opacity-[0.06]">
        <div
          className="flex gap-3 absolute"
          style={{
            transform: `translateX(${offset1}px)`,
            width: "max-content",
          }}
        >
          {doubled.map((src, idx) => (
            <div
              key={idx}
              className="w-[180px] h-[110px] rounded-md flex-shrink-0 overflow-hidden"
            >
              {typeof src === "string" && src.startsWith("__placeholder_") ? (
                <div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(135deg, ${accent}18, ${accent}06)`,
                    border: `1px solid ${accent}15`,
                    borderRadius: "6px",
                  }}
                />
              ) : (
                <img
                  src={src as string}
                  alt=""
                  className="w-full h-full object-cover rounded-md"
                  loading="lazy"
                  style={{
                    border: `1px solid ${accent}10`,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden opacity-[0.08] dark:opacity-[0.05]">
        <div
          className="flex gap-4 absolute"
          style={{
            transform: `translateX(${offset2}px)`,
            width: "max-content",
          }}
        >
          {doubled.map((src, idx) => (
            <div
              key={idx}
              className="w-[140px] h-[90px] rounded-md flex-shrink-0 overflow-hidden"
            >
              {typeof src === "string" && src.startsWith("__placeholder_") ? (
                <div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(225deg, ${accent}14, ${accent}04)`,
                    border: `1px solid ${accent}12`,
                    borderRadius: "6px",
                  }}
                />
              ) : (
                <img
                  src={src as string}
                  alt=""
                  className="w-full h-full object-cover rounded-md"
                  loading="lazy"
                  style={{
                    border: `1px solid ${accent}08`,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
