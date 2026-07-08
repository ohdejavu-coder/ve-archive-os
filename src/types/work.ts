// ============================================================
// Work types — Portfolio / project entries
// Each work is defined as an MDX file with YAML frontmatter
// ============================================================

import type { PersonaId } from "./persona";

export type WorkCategory = "photography" | "film" | "ai" | "new-media";

export interface WorkMedia {
  type: "image" | "video";
  src: string;
  alt: string;
  /** Optional caption */
  caption?: string;
  /** For video: poster/thumbnail image */
  poster?: string;
}

export interface WorkFrontmatter {
  id: string;
  title: string;
  titleEn: string;
  category: WorkCategory;
  tags: string[];
  /** Which personas this work should appear under */
  personas: PersonaId[];
  /** If true, pinned to top of work grid for matching personas */
  featured: boolean;
  thumbnail: string;
  media: WorkMedia[];
  year: number;
  client?: string;
  /** External URL if applicable */
  url?: string;
  /** If true, uses a dark gradient overlay on the hero image for light backgrounds */
  darkOverlay?: boolean;
}

export interface Work extends WorkFrontmatter {
  /** The MDX body rendered as HTML/React */
  content: React.ReactNode;
  /** Slug derived from filename */
  slug: string;
}
