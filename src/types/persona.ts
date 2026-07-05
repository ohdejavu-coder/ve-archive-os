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
  /** Hero headline (Chinese) */
  heroHeadline?: string;
  /** Hero headline (English) */
  heroHeadlineEn?: string;
  /** Hero subtitle (Chinese) */
  heroSubtitle?: string;
  /** Hero subtitle (English) */
  heroSubtitleEn?: string;
  /** Path to profile photo */
  profilePhoto?: string;
  /** Personal statement (Chinese) */
  personalStatement?: string;
  /** Personal statement (English) */
  personalStatementEn?: string;
}
