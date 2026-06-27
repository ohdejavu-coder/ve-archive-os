import type { PersonaId } from "@/types/persona";

/**
 * Persona-to-theme mapping.
 * Each persona's accent color drives link color, hover states,
 * badges, and subtle decorative elements.
 *
 * Other visual differences (layout, typography) come from
 * the persona's navigation and content filtering — not theme.
 * This keeps the design coherent across personas.
 */

export interface PersonaTheme {
  accent: string;
  accentLight: string;
  accentDark: string;
}

const themes: Record<PersonaId, PersonaTheme> = {
  default: {
    accent: "#c8a87c",
    accentLight: "#e0d0b0",
    accentDark: "#a08050",
  },
  photographer: {
    accent: "#8b7355",
    accentLight: "#b8a088",
    accentDark: "#5c4a35",
  },
  ai: {
    accent: "#6b8fa3",
    accentLight: "#99b8c5",
    accentDark: "#4a6a7d",
  },
  director: {
    accent: "#a05252",
    accentLight: "#c48080",
    accentDark: "#703838",
  },
  freelance: {
    accent: "#5a7a6a",
    accentLight: "#8aa898",
    accentDark: "#3d5a4a",
  },
};

export function getPersonaTheme(personaId: PersonaId): PersonaTheme {
  return themes[personaId] ?? themes.default;
}

/**
 * Returns CSS custom properties for a persona's accent color.
 * Inline style object — apply to a wrapper element.
 */
export function getAccentStyle(personaId: PersonaId): React.CSSProperties {
  const theme = getPersonaTheme(personaId);
  return {
    "--accent": theme.accent,
    "--accent-light": theme.accentLight,
    "--accent-dark": theme.accentDark,
  } as React.CSSProperties;
}
