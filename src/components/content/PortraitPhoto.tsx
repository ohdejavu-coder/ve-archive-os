"use client";

import { useState } from "react";

interface PortraitPhotoProps {
  src: string;
  alt: string;
  accentColor: string;
  className?: string;
  aspectRatio?: string;
}

/**
 * Portrait photo with graceful fallback.
 * Client component — uses onError for image load failure.
 */
export function PortraitPhoto({
  src,
  alt,
  accentColor,
  className = "",
  aspectRatio = "aspect-[3/4]",
}: PortraitPhotoProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`${aspectRatio} ${className} flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700`}
      >
        <div className="text-center p-6 space-y-3">
          <div
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke={accentColor}
              strokeWidth="1.5"
              opacity="0.5"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <p
            className="text-sm"
            style={{ color: accentColor, opacity: 0.6 }}
          >
            添加个人照片
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${aspectRatio} ${className} w-full h-full object-cover rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-lg hero-image-reveal`}
      onError={() => setFailed(true)}
    />
  );
}
