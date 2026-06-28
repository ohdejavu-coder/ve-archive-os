"use client";

import { useEffect, useRef } from "react";

/**
 * Swiss red-dot cursor.
 * - Default: 12px red dot
 * - Interactive (links/buttons): grows to 28px with border ring
 * - Images: inverts to 32px cyan with ripple
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    let raf = 0;
    let mx = 0, my = 0;

    function onMouseMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          dot!.style.left = mx + "px";
          dot!.style.top = my + "px";
          raf = 0;
        });
      }
    }

    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Images trigger cyan mode
      if (target.tagName === "IMG" || target.closest("[data-cursor-image]")) {
        dot!.className = "on-image";
        return;
      }

      // Interactive elements trigger ring mode
      const interactive = target.closest(
        'a, button, input, textarea, select, [role="button"], [data-cursor-interactive]'
      );
      if (interactive) {
        dot!.className = "on-interactive";
        return;
      }

      dot!.className = "";
    }

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={dotRef} id="custom-cursor" />;
}
