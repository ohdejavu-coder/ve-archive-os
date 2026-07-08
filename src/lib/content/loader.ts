import fs from "fs";
import path from "path";
import type { SiteConfig } from "@/types/content";
import type { Persona } from "@/types/persona";

const CONTENT_DIR = path.join(process.cwd(), "content");

// ---- Generic loaders ----

/**
 * Loads and parses a JSON file from /content/.
 */
export function loadJSON<T>(filePath: string): T {
  const fullPath = path.join(CONTENT_DIR, filePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}

/**
 * Reads the raw content of any file from /content/.
 */
export function loadFile(filePath: string): string {
  const fullPath = path.join(CONTENT_DIR, filePath);
  return fs.readFileSync(fullPath, "utf-8");
}

/**
 * Lists all files in a directory under /content/.
 */
export function listFiles(dirPath: string, extension?: string): string[] {
  const fullPath = path.join(CONTENT_DIR, dirPath);
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && (!extension || e.name.endsWith(extension)))
    .map((e) => e.name);
}

// ---- Specific loaders ----

let _siteConfigCache: SiteConfig | null = null;

export function loadSiteConfig(): SiteConfig {
  if (!_siteConfigCache) {
    _siteConfigCache = loadJSON<SiteConfig>("site.json");
  }
  return _siteConfigCache;
}

let _personasCache: Persona[] | null = null;

export function loadPersonas(): Persona[] {
  if (!_personasCache) {
    const dir = path.join(CONTENT_DIR, "personas");
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .sort();
    _personasCache = files.map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      return JSON.parse(raw) as Persona;
    });
  }
  return _personasCache;
}

export function loadPersona(id: string): Persona | undefined {
  return loadPersonas().find((p) => p.id === id);
}

/**
 * Reads an MDX file and returns { frontmatter, content }.
 * Simple YAML frontmatter parser — no external dependency.
 */
export function loadMDX(
  filePath: string
): { frontmatter: Record<string, unknown>; content: string } {
  const raw = loadFile(filePath);
  return parseFrontmatter(raw);
}

/**
 * Simple frontmatter parser for MDX files.
 * Extracts YAML between --- delimiters.
 */
function parseFrontmatter(raw: string): {
  frontmatter: Record<string, unknown>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, content: raw };
  }

  const yamlBlock = match[1];
  const markdown = match[2] ?? "";

  // Simple YAML key-value parser (handles our schema)
  const frontmatter: Record<string, unknown> = {};
  parseSimpleYAML(yamlBlock, frontmatter);

  return { frontmatter, content: markdown.trim() };
}

/**
 * Parses a simple subset of YAML sufficient for our frontmatter schema.
 * Supports: strings, numbers, booleans, arrays (inline [] and multiline -),
 * nested objects, and arrays of nested objects.
 */
function parseSimpleYAML(
  yaml: string,
  target: Record<string, unknown>
): void {
  const lines = yaml.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("#")) {
      i++;
      continue;
    }

    const keyMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)/);
    if (!keyMatch) {
      i++;
      continue;
    }

    const key = keyMatch[1];
    const value = keyMatch[2].trim();

    if (value === "") {
      // Could be: multiline array, array of objects, or nested object
      const arrayValues: unknown[] = [];
      let j = i + 1;

      // First, try parsing as an array (lines starting with "  - ")
      while (j < lines.length) {
        const nextLine = lines[j];
        const listMatch = nextLine.match(/^(\s+)-\s+(.*)/);
        if (listMatch) {
          const indent = listMatch[1].length;
          const itemValue = listMatch[2].trim();

          // Check if this item is a nested object (next lines are indented key-value pairs)
          const nestedLines: string[] = [];
          let k = j + 1;
          while (k < lines.length) {
            const nl = lines[k];
            // A line is part of this nested object if it's more indented than the "- " line
            // AND it's not another "- " at the same or shallower level
            const nestedListMatch = nl.match(/^(\s+)-\s+/);
            if (nestedListMatch && nestedListMatch[1].length <= indent) break;
            if (nl.trim() === "") { k++; continue; }
            // Check indentation — should be > indent
            const nestedKeyMatch = nl.match(/^(\s+)([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)/);
            if (nestedKeyMatch && nestedKeyMatch[1].length > indent) {
              nestedLines.push(nl);
              k++;
            } else if (nl.trim() && !nl.match(/^\s+-\s+/)) {
              // Non-empty, non-list line at same/shallower indent = end of this item
              break;
            } else {
              k++;
            }
          }

          // Check if this item is an object (starts with key: value on same line, or has nested props)
          const looksLikeObject = /^[a-zA-Z_][a-zA-Z0-9_]*:/.test(itemValue);
          if (looksLikeObject || nestedLines.length > 0) {
            // Parse as nested object — include the itemValue line
            const allLines = ["  " + itemValue, ...nestedLines].join("\n");
            const nestedObj: Record<string, unknown> = {};
            parseSimpleYAML(allLines, nestedObj);
            arrayValues.push(nestedObj);
            j = k;
          } else {
            // Simple value
            arrayValues.push(parseYAMLValue(itemValue));
            j++;
          }
        } else if (nextLine.trim() === "") {
          j++;
        } else {
          break;
        }
      }

      if (arrayValues.length > 0) {
        target[key] = arrayValues;
        i = j;
        continue;
      }

      // Not an array — empty value
      target[key] = "";
      i++;
    } else {
      target[key] = parseYAMLValue(value);
      i++;
    }
  }
}

function parseYAMLValue(value: string): unknown {
  // Boolean
  if (value === "true") return true;
  if (value === "false") return false;

  // Number
  const num = Number(value);
  if (!isNaN(num) && value.trim() !== "") return num;

  // Quoted string
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  // Inline array: [a, b, c]
  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((s) => parseYAMLValue(s.trim()));
  }

  return value;
}
