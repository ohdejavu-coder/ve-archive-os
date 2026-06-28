"use client";

import { useEffect } from "react";

/**
 * Pure red dot cursor. mix-blend-mode: difference.
 *
 * On white → appears red.
 * On dark  → inverts to cyan/sky-blue.
 * On interactive elements → grows 3x.
 *
 * No glow. No shadow. One element. One blend mode.
 * The browser calculates the color. We just ship pure red.
 */
export function CustomCursor() {
  useEffect(() => {
    if (document.getElementById("cursor-dot")) return;

    const dot = document.createElement("div");
    dot.id = "cursor-dot";
    document.body.appendChild(dot);

    // Show native cursor fallback until first mouse move
    let ready = false;
    let mx = -100;
    let my = -100;
    let frame = 0;

    function move(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;

      if (!ready) {
        ready = true;
        document.body.classList.add("cursor-ready");
      }

      if (!frame) {
        frame = requestAnimationFrame(() => {
          const el = document.elementFromPoint(mx, my);
          let big = false;
          if (el) {
            big = !!el.closest(
              'a, button, input, textarea, select, [role="button"]'
            );
          }
          dot.className = big ? "big" : "";

          const s = big ? 14 : 5;
          dot.style.transform = `translate(${mx - s}px, ${my - s}px)`;

          frame = 0;
        });
      }
    }

    document.addEventListener("mousemove", move, { passive: true });

    return () => {
      document.removeEventListener("mousemove", move);
      cancelAnimationFrame(frame);
      document.body.classList.remove("cursor-ready");
      dot.remove();
    };
  }, []);

  return null;
}
