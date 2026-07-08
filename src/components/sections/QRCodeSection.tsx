"use client";

import { useEffect, useState, useCallback } from "react";
import * as QRCodeLib from "qrcode";
import { useOverrides } from "@/lib/content/OverrideContext";

function useLocalSiteUrl(): string {
  const [url, setUrl] = useState("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ve-content");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.siteUrl) setUrl(data.siteUrl);
      }
    } catch {}
  }, []);
  return url;
}

/**
 * QR code section for CTA footer.
 * Generates a QR code pointing to the website root,
 * with a "download QR code" link below.
 *
 * URL priority: siteUrl in site.json (configurable) > window.location.origin
 */
export function QRCodeSection() {
  const [svg, setSvg] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const overrides = useOverrides();
  const localSiteUrl = useLocalSiteUrl();

  useEffect(() => {
    // Priority: CCR cookie > site.json config > window.location.origin (production fallback)
    const base = localSiteUrl || overrides.siteUrl || window.location.origin;
    const url = base.replace(/\/+$/, "") + "/";
    QRCodeLib.toString(url, { type: "svg", width: 88, margin: 2, color: { dark: "#111111", light: "#ffffff" } })
      .then(setSvg)
      .catch(() => {});
    QRCodeLib.toDataURL(url, { width: 400, margin: 2, color: { dark: "#111111", light: "#ffffff" } })
      .then(setDataUrl)
      .catch(() => {});
  }, []);

  const download = useCallback(() => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "ve-archive-qrcode.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [dataUrl]);

  if (!svg) {
    return (
      <div className="w-[88px] h-[88px] rounded-md border border-dashed border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
        <span className="text-[10px] text-neutral-300">QR</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div
        className="w-[88px] h-[88px] bg-white p-0 rounded-md border border-neutral-200 dark:border-neutral-700 overflow-hidden [&_svg]:block"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <button
        onClick={download}
        className="text-[10px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors leading-none"
        data-cursor-interactive
      >
        下载二维码
      </button>
    </div>
  );
}
