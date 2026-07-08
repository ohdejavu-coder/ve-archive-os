// ============================================================
// Content schema types
// These mirror the JSON/MDX files in /content/
// ============================================================

import type { PersonaId } from "./persona";

// ---- Site Config (content/site.json) ----

export interface SiteConfig {
  /** Site title — shown in browser tab + header */
  title: string;
  /** Tagline — shown in footer + SEO */
  tagline: string;
  /** Default persona ID — redirect target for / */
  defaultPersona: PersonaId;
  /** Public-facing site URL — used by QR code. Falls back to window.location.origin if empty. */
  siteUrl?: string;
  /** Footer text */
  footer: string;
  /** Social links */
  social: {
    label: string;
    url: string;
    icon: string;
  }[];
  /** Navigation items (global default) */
  navigation: {
    label: string;
    labelEn: string;
    href: string;
  }[];
}

// ---- Resume (content/resume/main.json) ----

export interface ResumeBasics {
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  location: string;
  email: string;
  phone?: string;
  website?: string;
}

export interface ResumeExperience {
  company: string;
  companyEn: string;
  role: string;
  roleEn: string;
  startDate: string;
  endDate?: string;
  description: string;
  descriptionEn: string;
  highlights: string[];
}

export interface ResumeEducation {
  institution: string;
  institutionEn: string;
  degree: string;
  degreeEn: string;
  field: string;
  fieldEn: string;
  startDate: string;
  endDate: string;
}

export interface ResumeSkill {
  name: string;
  nameEn: string;
  category: string;
  level: number; // 1-5
}

export interface ResumeProject {
  name: string;
  nameEn: string;
  type: string; // e.g. "Short Film", "Photography", "New Media"
  description: string;
  descriptionEn: string;
  role: string; // Your role
  outcome: string; // Key result / metric
  thumbnail: string; // e.g. "/media/projects/project-name/thumb.jpg"
}

export interface Resume {
  basics: ResumeBasics;
  summary: string;
  summaryEn: string;
  coreStrengths: { zh: string; en: string; items?: { zh: string; en: string }[] }[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  languages: { name: string; nameEn: string; level: string }[];
  awards: { title: string; titleEn: string; year: number; issuer: string }[];
  projects: ResumeProject[];
}
