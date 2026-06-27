"use client";

import { useEffect, useState, useRef } from "react";
import { usePersona } from "@/lib/identity/context";

/**
 * FilmStrip — Netflix-style horizontal scrolling stills background.
 *
 * Two rows of images scrolling in opposite directions at low opacity.
 * Creates cinematic atmosphere without distracting from content.
 * Uses CSS transforms + requestAnimationFrame for smooth 60fps scroll.
 *
 * Per Principle 01: animation assists but never obstructs.
 * Per Principle 05: cinematic, restrained, professional.
 */
export function FilmStrip() {
  const persona = usePersona();
  const accent = persona.accentColor;

  // Generate placeholder still frames using gradient blocks
  // In production, these would be work thumbnails
  const stills = Array.from({ length: 12 }, (_, i) => i);

  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const [offset1, setOffset1] = useState(0);
  const [offset2, setOffset2] = useState(0);

  useEffect(() => {
    let frame: number;
    let lastTime = performance.now();

    function animate(now: number) {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Row 1: scroll left (negative direction, ~30px/s)
      setOffset1((prev) => (prev - 30 * dt) % 1200);
      // Row 2: scroll right (positive direction, ~20px/s — slower for contrast)
      setOffset2((prev) => (prev + 20 * dt) % 1200);

      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Gradient fades on edges so text remains readable */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/30 to-white dark:from-neutral-950 dark:via-neutral-950/30 dark:to-neutral-950" />

      {/* Row 1 — scrolls left */}
      <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden opacity-[0.12] dark:opacity-[0.08]">
        <div
          className="flex gap-3 absolute"
          style={{
            transform: `translateX(${offset1}px)`,
            width: "max-content",
          }}
        >
          {[...stills, ...stills].map((i, idx) => (
            <div
              key={idx}
              className="w-[200px] h-[120px] rounded-md flex-shrink-0 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${accent}20, ${accent}08)`,
                border: `1px solid ${accent}20`,
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className="w-12 h-12 rounded-full"
                  style={{ backgroundColor: `${accent}15` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden opacity-[0.10] dark:opacity-[0.06]">
        <div
          className="flex gap-4 absolute"
          style={{
            transform: `translateX(${offset2}px)`,
            width: "max-content",
          }}
        >
          {[...stills, ...stills].map((i, idx) => (
            <div
              key={idx}
              className="w-[160px] h-[100px] rounded-md flex-shrink-0 overflow-hidden"
              style={{
                background: `linear-gradient(225deg, ${accent}18, ${accent}06)`,
                border: `1px solid ${accent}18`,
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className="w-10 h-10 rounded-sm rotate-45"
                  style={{ backgroundColor: `${accent}12` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
