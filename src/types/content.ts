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

export interface Resume {
  basics: ResumeBasics;
  summary: string;
  summaryEn: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  languages: { name: string; nameEn: string; level: string }[];
  awards: { title: string; titleEn: string; year: number; issuer: string }[];
}
