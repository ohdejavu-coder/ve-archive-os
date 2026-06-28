"use client";

import { useEffect, useRef } from "react";

/**
 * Swiss red-dot custom cursor.
 *
 * - Default: 12px red dot (mix-blend-mode: difference for visibility)
 * - Interactive (a, button, input, etc): grows to 28px ring
 * - Images: 36px cyan circle with ripple animation
 *
 * Native cursor is hidden ONLY after the custom cursor successfully mounts.
 * If this component fails, the native cursor remains visible (fail-safe).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    // Show immediately at center
    dot.style.left = window.innerWidth / 2 + "px";
    dot.style.top = window.innerHeight / 2 + "px";
    dot.style.opacity = "1";

    // Add class to body to hide native cursor — only after we're confirmed working
    document.body.classList.add("cursor-custom-active");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let ticking = false;

    function move(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          dot!.style.left = mx + "px";
          dot!.style.top = my + "px";
          ticking = false;
        });
      }
    }

    function over(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (!t || !dot) return;

      if (t.tagName === "IMG" || t.closest("[data-cursor-image]")) {
        dot.className = "on-image";
        return;
      }
      const inter = t.closest(
        'a, button, input, textarea, select, [role="button"], [data-cursor-interactive]'
      );
      dot.className = inter ? "on-interactive" : "";
    }

    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.body.classList.remove("cursor-custom-active");
    };
  }, []);

  return <div ref={dotRef} id="custom-cursor" style={{ opacity: 0 }} />;
}
