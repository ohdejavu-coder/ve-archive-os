"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    // Start visible at center
    dot.style.left = "50vw";
    dot.style.top = "50vh";
    dot.style.opacity = "1";

    // Hide native cursor
    document.body.classList.add("cursor-custom-active");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let frame = 0;

    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          // Position
          dot!.style.left = mx + "px";
          dot!.style.top = my + "px";

          // What's under cursor?
          const el = document.elementFromPoint(mx, my);
          if (el) {
            if (el.tagName === "IMG" || el.closest("[data-cursor-image]")) {
              dot!.className = "on-image";
            } else if (
              el.tagName === "A" ||
              el.tagName === "BUTTON" ||
              el.tagName === "INPUT" ||
              el.tagName === "TEXTAREA" ||
              el.tagName === "SELECT" ||
              el.closest("[role='button']") ||
              el.closest("[data-cursor-interactive]")
            ) {
              dot!.className = "on-interactive";
            } else {
              dot!.className = "";
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
    };
  }, []);

  return <div ref={dotRef} id="custom-cursor" style={{ opacity: 0 }} />;
}
