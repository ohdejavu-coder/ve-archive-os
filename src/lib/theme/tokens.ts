// ============================================================
// Design Tokens — the single source of truth for visual design.
// These values feed into Tailwind CSS and all components.
// ============================================================

export const tokens = {
  // ---- Typography ----
  typography: {
    fontSans: "var(--font-geist-sans), system-ui, sans-serif",
    fontMono: "var(--font-geist-mono), monospace",
    fontSerif: "Georgia, 'Times New Roman', serif",
    /** For cinematic headings — apply via className or component */
    fontHeading: "var(--font-geist-sans), system-ui, sans-serif",

    size: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
    },

    weight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },

    leading: {
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
    },
  },

  // ---- Spacing ----
  spacing: {
    page: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
    section: "py-16 md:py-24",
    sectionSmall: "py-8 md:py-12",
  },

  // ---- Colors (neutral palette) ----
  colors: {
    neutral: {
      50: "#fafaf9",
      100: "#f5f5f4",
      200: "#e7e5e4",
      300: "#d6d3d1",
      400: "#a8a29e",
      500: "#78716c",
      600: "#57534e",
      700: "#44403c",
      800: "#292524",
      900: "#1c1917",
      950: "#0c0a09",
    },
  },

  // ---- Animation ----
  // Principle 01: Content > Animation. Only subtle, functional transitions.
  animation: {
    fadeIn: "transition-opacity duration-500 ease-in-out",
    slideUp: "transition-all duration-500 ease-out",
    hover: "transition-colors duration-200 ease-in-out",
  },
} as const;
