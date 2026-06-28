"use client";

import { useEffect } from "react";

/**
 * Swiss red-dot cursor.
 *
 * Creates the cursor element directly in the DOM (bypassing React).
 * This ensures it always renders, regardless of component tree.
 */
export function CustomCursor() {
  useEffect(() => {
    // Already created?
    if (document.getElementById("custom-cursor")) return;

    // Create the cursor dot directly in DOM
    const dot = document.createElement("div");
    dot.id = "custom-cursor";
    document.body.appendChild(dot);

    // Hide native cursor
    document.body.classList.add("cursor-custom-active");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let frame = 0;

    // Set initial position
    dot.style.left = mx + "px";
    dot.style.top = my + "px";

    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          dot.style.left = mx + "px";
          dot.style.top = my + "px";

          // Detect what's under cursor
          const el = document.elementFromPoint(mx, my);
          if (el) {
            if (el.tagName === "IMG" || el.closest("[data-cursor-image]")) {
              dot.className = "on-image";
            } else if (
              el.tagName === "A" ||
              el.tagName === "BUTTON" ||
              el.tagName === "INPUT" ||
              el.tagName === "TEXTAREA" ||
              el.tagName === "SELECT" ||
              el.closest("[role='button']") ||
              el.closest("[data-cursor-interactive]")
            ) {
              dot.className = "on-interactive";
            } else {
              dot.className = "";
            }
          }

          frame = 0;
        });
      }
    }

    document.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
      document.body.classList.remove("cursor-custom-active");
      dot.remove();
    };
  }, []);

  // This component renders nothing — everything is in the DOM
  return null;
}
