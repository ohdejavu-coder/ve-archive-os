import { loadPersonas, loadPersona } from "./loader";
import type { Persona, PersonaId } from "@/types/persona";

/**
 * Returns all active personas.
 * In future, personas can be toggled on/off in CCR.
 */
export function getPersonas(): Persona[] {
  return loadPersonas();
}

/**
 * Returns a single persona by ID.
 * Falls back to "default" persona if not found.
 */
export function getPersonaById(id: string): Persona {
  const persona = loadPersona(id);
  if (persona) return persona;

  // Fallback to default
  const defaultPersona = loadPersona("default");
  if (defaultPersona) return defaultPersona;

  throw new Error(`Persona "${id}" not found and no default persona exists.`);
}

/**
 * Returns the IDs of all available personas.
 */
export function getPersonaIds(): PersonaId[] {
  return getPersonas().map((p) => p.id);
}

/**
 * Validates whether a persona ID is valid.
 */
export function isValidPersona(id: string): id is PersonaId {
  return getPersonaIds().includes(id as PersonaId);
}
