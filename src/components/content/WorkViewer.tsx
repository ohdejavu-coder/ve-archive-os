"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { WorkMedia } from "@/types/work";

interface WorkViewerProps {
  media: WorkMedia[];
  className?: string;
}

/**
 * Image/video gallery for work detail pages.
 * Supports lightbox on image click.
 * Clean and restrained — per Principle 05.
 */
export function WorkViewer({ media, className }: WorkViewerProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft" && lightboxIndex !== null && lightboxIndex > 0) {
        setLightboxIndex(lightboxIndex - 1);
      }
      if (e.key === "ArrowRight" && lightboxIndex !== null && lightboxIndex < media.length - 1) {
        setLightboxIndex(lightboxIndex + 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, media.length]);

  if (media.length === 0) {
    return (
      <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400 text-sm">
        暂无媒体文件
      </div>
    );
  }

  return (
    <>
      {/* Grid */}
      <div
        className={cn(
          "grid gap-4",
          media.length === 1
            ? "grid-cols-1"
            : media.length === 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          className
        )}
      >
        {media.map((item, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 cursor-pointer"
            onClick={() => item.type === "image" && setLightboxIndex(i)}
          >
            {item.type === "image" ? (
              <>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                {item.caption && (
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm">{item.caption}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-video relative group/video">
                <video
                  ref={(el) => { if (el) el.removeAttribute("controls"); }}
                  src={item.src}
                  poster={item.poster}
                  preload="metadata"
                  onClick={(e) => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }}
                  onMouseEnter={(e) => { e.currentTarget.setAttribute("controls", ""); }}
                  onMouseLeave={(e) => { if (e.currentTarget.paused) e.currentTarget.removeAttribute("controls"); }}
                  onPause={(e) => { e.currentTarget.removeAttribute("controls"); }}
                  onPlay={(e) => { e.currentTarget.setAttribute("controls", ""); }}
                  className="w-full h-full object-cover cursor-pointer"
                >
                  你的浏览器不支持视频播放。
                </video>
                {item.caption && (
                  <p className="mt-2 text-sm text-neutral-500">{item.caption}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox — portal to document.body to escape parent transforms */}
      {lightboxIndex !== null && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9990] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightboxIndex(null)}
            aria-label="关闭"
          >
            <X size={24} />
          </button>

          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
              aria-label="上一张"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          <img
            src={media[lightboxIndex].src}
            alt={media[lightboxIndex].alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {lightboxIndex < media.length - 1 && (
            <button
              className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
              aria-label="下一张"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Caption */}
          {media[lightboxIndex].caption && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-lg">
              <span className="text-white text-sm">
                {media[lightboxIndex].caption}
              </span>
            </div>
          )}

          {/* Counter */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 rounded-lg">
            <span className="text-white text-xs">
              {lightboxIndex + 1} / {media.length}
            </span>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
