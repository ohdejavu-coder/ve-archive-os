import { loadMDX, loadFile, listFiles } from "./loader";
import type { Work, WorkFrontmatter } from "@/types/work";
import type { PersonaId } from "@/types/persona";

/**
 * Loads all works from /content/works/.
 * Returns them parsed with frontmatter + normalized data.
 */
export function loadWorks(): Work[] {
  const files = listFiles("works", ".mdx");
  const works: Work[] = [];

  for (const file of files) {
    const { frontmatter, content } = loadMDX(`works/${file}`);
    const slug = file.replace(/\.mdx$/, "");

    if (!frontmatter.id) {
      frontmatter.id = slug;
    }

    works.push({
      id: String(frontmatter.id ?? slug),
      title: String(frontmatter.title ?? slug),
      titleEn: String(frontmatter.titleEn ?? slug),
      category: (frontmatter.category as WorkFrontmatter["category"]) ?? "photography",
      tags: asStringArray(frontmatter.tags),
      personas: asStringArray(frontmatter.personas) as PersonaId[],
      featured: frontmatter.featured === true,
      thumbnail: String(frontmatter.thumbnail ?? ""),
      media: asMediaArray(frontmatter.media),
      year: Number(frontmatter.year ?? 0),
      client: frontmatter.client ? String(frontmatter.client) : undefined,
      url: frontmatter.url ? String(frontmatter.url) : undefined,
      darkOverlay: frontmatter.darkOverlay === true,
      content,
      slug,
    } satisfies Work);
  }

  return works.sort((a, b) => b.year - a.year);
}

/**
 * Returns works filtered by persona ID.
 * Shows works where the persona is in the work's personas array.
 * Featured works appear first.
 */
export function loadWorksByPersona(personaId: PersonaId): Work[] {
  const all = loadWorks();
  const filtered = all.filter((w) => w.personas.includes(personaId));
  return sortFeatured(filtered);
}

/**
 * Returns a single work by slug.
 */
export function loadWorkBySlug(slug: string): Work | undefined {
  return loadWorks().find((w) => w.slug === slug);
}

/**
 * Returns featured works for a persona (for hero/home page).
 */
export function loadFeaturedWorks(personaId: PersonaId, limit = 3): Work[] {
  const works = loadWorksByPersona(personaId);
  return works.filter((w) => w.featured).slice(0, limit);
}

// ---- Helpers ----

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return [value];
  return [];
}

function asMediaArray(value: unknown): Work["media"] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => ({
    type: (item?.type === "video" ? "video" : "image") as "image" | "video",
    src: String(item?.src ?? ""),
    alt: String(item?.alt ?? ""),
    caption: item?.caption ? String(item.caption) : undefined,
    poster: item?.poster ? String(item.poster) : undefined,
  }));
}

function sortFeatured(works: Work[]): Work[] {
  return [...works].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.year - a.year;
  });
}
