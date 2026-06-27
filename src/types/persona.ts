// ============================================================
// Persona types — Multi-identity system core
// Each persona represents a career identity the site can present
// ============================================================

export type PersonaId =
  | "default"
  | "photographer"
  | "ai"
  | "director"
  | "freelance";

export interface PersonaNavigationItem {
  label: string;
  labelEn: string;
  href: string;
}

export interface Persona {
  id: PersonaId;
  /** Display name in Chinese */
  name: string;
  /** Display name in English */
  nameEn: string;
  /** Short description — appears in persona switcher */
  description: string;
  /** Accent color hex — used for links, badges, hover states */
  accentColor: string;
  /** Work IDs to pin/feature on the home page */
  featuredWorkIds: string[];
  /** Skill categories to emphasize for this persona */
  emphasizedSkills: string[];
  /** Resume sections to display (order matters) */
  resumeSections: string[];
  /** Custom navigation for this persona. If empty, uses default nav. */
  navigation: PersonaNavigationItem[];
  /** Hero headline override (optional — falls back to site default) */
  heroHeadline?: string;
  /** Hero subtitle override */
  heroSubtitle?: string;
  /** Path to profile photo for this persona's hero */
  profilePhoto?: string;
  /** Personal statement — prominently displayed in hero (1-2 sentences) */
  personalStatement?: string;
  /** English version of personal statement */
  personalStatementEn?: string;
}
