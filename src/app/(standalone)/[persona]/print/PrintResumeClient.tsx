"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/language/context";
import { useOverrides } from "@/lib/content/OverrideContext";
import { PrintSection } from "@/components/print/PrintSection";
import { PrintHeader } from "@/components/print/PrintHeader";
import { PrintProfile } from "@/components/print/PrintProfile";
import { PrintExperienceList } from "@/components/print/PrintExperienceList";
import { PrintEducation } from "@/components/print/PrintEducation";
import { PrintContact } from "@/components/print/PrintContact";
import * as QRCodeLib from "qrcode";
import type { Resume } from "@/types/content";
import type { IdentityState } from "@/lib/identity/types";

export function PrintResumeClient({
  identity,
  fileResume,
}: {
  identity: IdentityState;
  fileResume: Resume;
}) {
  const { lang } = useLang();
  const overrides = useOverrides();

  const [mounted, setMounted] = useState(false);

  const [localData, setLocalData] = useState<Record<string, string>>({});
  useEffect(() => {
    setMounted(true);
    // Ensure custom cursor is active on this page
    requestAnimationFrame(() => {
      if (document.getElementById("cursor-dot")) {
        document.body.classList.add("cursor-ready");
      }
    });
    try {
      const raw = localStorage.getItem("ve-content");
      if (raw) setLocalData(JSON.parse(raw));
    } catch {}
  }, []);

  const merged = { ...overrides, ...localData };

  // --- Basics ---
  const name = merged.resume_basics_name ?? fileResume.basics.name;
  const title = lang === "en" ? (merged.resume_basics_titleEn ?? fileResume.basics.titleEn) : (merged.resume_basics_title ?? fileResume.basics.title);
  const email = merged.resume_basics_email ?? fileResume.basics.email;
  const phone = merged.resume_basics_phone ?? fileResume.basics.phone ?? "";
  const website = merged.resume_basics_website ?? fileResume.basics.website ?? "";

  // --- Summary ---
  const summary = lang === "en"
    ? (merged.resume_summaryEn ?? fileResume.summaryEn)
    : (merged.resume_summary ?? fileResume.summary);

  // --- Experience ---
  let experience = fileResume.experience ?? [];
  try {
    if (merged.experience_json) experience = JSON.parse(merged.experience_json);
  } catch {}

  const expEntries = experience.map((e) => {
    const desc = lang === "en" ? e.descriptionEn : e.description;
    const hls = e.highlights ?? [];
    // Merge description + highlights into one text block with paragraph breaks
    const mergedText = hls.length > 0
      ? desc + "\n\n" + hls.map((h) => "· " + h).join("\n")
      : desc;
    return {
      role: lang === "en" ? e.roleEn : e.role,
      company: lang === "en" ? e.companyEn : e.company,
      startDate: e.startDate,
      endDate: e.endDate,
      description: mergedText,
      highlights: [] as string[],
    };
  });

  // --- Education ---
  let education = fileResume.education ?? [];
  try {
    if (merged.education_json) education = JSON.parse(merged.education_json);
  } catch {}

  // --- Subtitle ---
  const subtitleLines = title
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);

  // --- QR code: generate dynamically from siteUrl ---
  const siteUrl = merged.siteUrl ?? "https://veisviddy.com";
  const [qrSvg, setQrSvg] = useState("");

  useEffect(() => {
    QRCodeLib.toString(siteUrl + "/", { type: "svg", width: 88, margin: 2, color: { dark: "#111111", light: "#ffffff" } })
      .then(setQrSvg)
      .catch(() => {});
  }, [siteUrl]);

  return (
    <>
      {/* ============ SCREEN-ONLY PRINT BAR ============ */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-neutral-200 px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-800">
          打印简历 — {identity.persona.name}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400">
            {lang === "en"
              ? "Ctrl+P → More settings → Uncheck \"Headers and footers\" → Save as PDF"
              : "Ctrl+P → 更多设置 → 取消勾选「页眉和页脚」→ 另存为 PDF"}
          </span>
          <button
            onClick={() => window.print()}
            className="px-5 py-2 rounded-sm text-sm font-medium bg-black text-white hover:opacity-80 transition-opacity"
          >
            {lang === "en" ? "Print" : "打印"}
          </button>
        </div>
      </div>

      {/* ============ RESUME — single continuous flow, browser handles page breaks ============ */}
      <div className="print-a4-page mt-14">
        <PrintHeader
          name={name}
          subtitle={subtitleLines}
          email={email}
          phone={phone}
          website={website}
        />

        <PrintSection label={lang === "en" ? "Profile" : "简介"}>
          <PrintProfile text={summary} />
        </PrintSection>

        {expEntries.length > 0 && (
          <PrintSection label={lang === "en" ? "Experience" : "工作经历"}>
            <PrintExperienceList experiences={expEntries} />
          </PrintSection>
        )}

        {education.length > 0 && (
          <PrintSection label={lang === "en" ? "Education" : "教育背景"}>
            {education.map((edu, i) => (
              <PrintEducation
                key={i}
                institution={lang === "en" ? edu.institutionEn : edu.institution}
                degree={lang === "en" ? edu.degreeEn : edu.degree}
                field={lang === "en" ? edu.fieldEn : edu.field}
                startDate={edu.startDate}
                endDate={edu.endDate}
              />
            ))}
          </PrintSection>
        )}

        <PrintSection label={lang === "en" ? "Scan to Visit" : "扫码访问网站"}>
          <div className="flex items-start gap-5">
            <div className="w-[100px] h-[100px] bg-white p-1 border border-[#e8e8e8] rounded flex items-center justify-center shrink-0 overflow-hidden [&_svg]:block">
              {qrSvg ? (
                <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
              ) : (
                <span className="text-[#cccccc] text-[6pt]">QR</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-[9pt] text-[#444444] leading-relaxed font-medium">
                {siteUrl.replace("https://", "").replace("http://", "")}
              </p>
              <p className="text-[8pt] text-[#999999] leading-relaxed mt-1">
                {lang === "en"
                  ? "Scan to view my full portfolio and resume online."
                  : "扫描二维码在线查看完整作品集与简历。"}
              </p>
            </div>
          </div>
        </PrintSection>

        <PrintSection label={lang === "en" ? "Contact" : "联系方式"}>
          <PrintContact email={email} phone={phone} website={website} />
        </PrintSection>
      </div>
    </>
  );
}
