"use client";

import { useEffect } from "react";

/**
 * Renders once on mount, after React hydration is complete.
 * Creates the cursor dot directly in the DOM.
 */
export function CursorScript() {
  useEffect(() => {
    if (document.getElementById("cursor-dot")) return;

    const d = document.createElement("div");
    d.id = "cursor-dot";
    document.body.appendChild(d);
    document.body.classList.add("cursor-ready");

    let mx = 0, my = 0, f = 0;

    function m(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      if (!f) {
        f = requestAnimationFrame(() => {
          const el = document.elementFromPoint(mx, my);
          const big = !!(el && el.closest("a,button,input,textarea,select,[role=button]"));
          d.className = big ? "big" : "";
          const s = big ? 25 : 7;
          d.style.transform = `translate(${mx - s}px, ${my - s}px)`;
          f = 0;
        });
      }
    }

    document.addEventListener("mousemove", m, { passive: true });

    return () => {
      document.removeEventListener("mousemove", m);
      d.remove();
      document.body.classList.remove("cursor-ready");
    };
  }, []);

  return null;
}
