"use client";

import { usePersona } from "@/lib/identity/context";
import { useLang } from "@/lib/language/context";
import { useStoredField } from "@/lib/content/useStoredField";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Divider } from "@/components/ui/Divider";
import { Timeline } from "@/components/sections/Timeline";
import { SkillMatrix } from "@/components/sections/SkillMatrix";
import { CTA } from "@/components/sections/CTA";
import { Mail, MapPin, Globe, Download } from "lucide-react";
import type { Resume } from "@/types/content";
import type { IdentityState } from "@/lib/identity/types";

export function ResumeClient({ identity, fileResume }: { identity: IdentityState; fileResume: Resume }) {
  const persona = usePersona();
  const { lang } = useLang();
  const showSection = (name: string) => persona.resumeSections.includes(name);

  // Read basics from localStorage with file defaults
  const [name] = useStoredField("resume_basics_name", fileResume.basics.name);
  const [nameEn] = useStoredField("resume_basics_nameEn", fileResume.basics.nameEn);
  const [title] = useStoredField("resume_basics_title", fileResume.basics.title);
  const [titleEn] = useStoredField("resume_basics_titleEn", fileResume.basics.titleEn);
  const [location] = useStoredField("resume_basics_location", fileResume.basics.location);
  const [email] = useStoredField("resume_basics_email", fileResume.basics.email);
  const [phone] = useStoredField("resume_basics_phone", fileResume.basics.phone ?? "");
  const [website] = useStoredField("resume_basics_website", fileResume.basics.website ?? "");
  const [summary] = useStoredField("resume_summary", fileResume.summary);
  const [summaryEn] = useStoredField("resume_summaryEn", fileResume.summaryEn);

  return (
    <section className="py-16">
      <Container size="narrow">
        <div className="mb-12">
          <Typography variant="h1">{lang === "en" ? "Resume" : "简历"}</Typography>
          <Typography variant="body" className="text-neutral-500 mt-2">
            {lang === "en" ? `Current identity: ${persona.nameEn}` : `当前展示身份：${persona.name}`}
          </Typography>
        </div>

        {/* Basics */}
        <div className="mb-10 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <Typography variant="h2" className="mb-1">{lang === "en" ? nameEn : name}</Typography>
          <Typography variant="body" className="text-neutral-500 mb-3">{lang === "en" ? titleEn : title}</Typography>

          <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
            <span className="flex items-center gap-1"><MapPin size={14} />{location}</span>
            <span className="flex items-center gap-1"><Mail size={14} />{email}</span>
            {website && <span className="flex items-center gap-1"><Globe size={14} />{website}</span>}
            {phone && <span className="flex items-center gap-1">{phone}</span>}
          </div>

          <Divider className="my-4" />
          <Typography variant="body">{lang === "en" ? summaryEn : summary}</Typography>
        </div>

        {showSection("experience") && fileResume.experience.length > 0 && (
          <div className="mb-12">
            <Typography variant="h3" className="mb-6">{lang === "en" ? "Experience" : "工作经历"}</Typography>
            <Timeline items={fileResume.experience} type="experience" />
          </div>
        )}

        {showSection("skills") && fileResume.skills.length > 0 && (
          <div className="mb-12">
            <Typography variant="h3" className="mb-6">{lang === "en" ? "Skills" : "技能"}</Typography>
            <SkillMatrix skills={fileResume.skills} />
          </div>
        )}

        {showSection("education") && fileResume.education.length > 0 && (
          <div className="mb-12">
            <Typography variant="h3" className="mb-6">{lang === "en" ? "Education" : "教育背景"}</Typography>
            <Timeline items={fileResume.education} type="education" />
          </div>
        )}

        {showSection("awards") && fileResume.awards.length > 0 && (
          <div className="mb-12">
            <Typography variant="h3" className="mb-6">{lang === "en" ? "Awards" : "获奖与荣誉"}</Typography>
            <div className="space-y-3">
              {fileResume.awards.map((award, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-md border border-neutral-100 dark:border-neutral-800">
                  <span className="text-xs text-neutral-400 font-mono mt-0.5">{award.year}</span>
                  <div>
                    <Typography variant="body" className="font-medium">{lang === "en" ? award.titleEn : award.title}</Typography>
                    <Typography variant="caption">{award.issuer}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {fileResume.languages.length > 0 && (
          <div className="mb-12">
            <Typography variant="h3" className="mb-4">{lang === "en" ? "Languages" : "语言能力"}</Typography>
            <div className="flex flex-wrap gap-4">
              {fileResume.languages.map((l, i) => (
                <div key={i} className="px-4 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 text-sm">
                  <span className="font-medium">{lang === "en" ? l.nameEn : l.name}</span>
                  <span className="text-neutral-400 mx-1">·</span>
                  <span className="text-neutral-500">{l.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Download button */}
        <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <a
            href="/resume/ve-archive-resume.pdf"
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-sm text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity"
          >
            <Download size={16} />
            {lang === "en" ? "Download Resume (PDF)" : "下载我的简历 (PDF)"}
          </a>
        </div>
      </Container>
      <CTA />
    </section>
  );
}
