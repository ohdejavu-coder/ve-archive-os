import { getPersonaById, getPersonas, isValidPersona } from "@/lib/content/personas";
import { loadSiteConfig } from "@/lib/content/loader";
import type { IdentityState } from "./types";
import type { PersonaId } from "@/types/persona";

/**
 * Resolves the identity state from a URL persona parameter.
 *
 * Flow:
 * 1. Extract persona ID from URL param
 * 2. Validate it exists
 * 3. Load full persona data
 * 4. Return complete IdentityState
 */
export function resolveIdentity(personaParam: string): IdentityState {
  const allPersonas = getPersonas();
  const siteConfig = loadSiteConfig();

  let personaId: PersonaId;

  if (personaParam && isValidPersona(personaParam)) {
    personaId = personaParam;
  } else {
    personaId = siteConfig.defaultPersona;
  }

  const persona = getPersonaById(personaId);

  return {
    persona,
    allPersonas,
    activePersonaId: personaId,
  };
}

/**
 * Returns the default identity (for root redirect).
 */
export function getDefaultIdentity(): IdentityState {
  const siteConfig = loadSiteConfig();
  return resolveIdentity(siteConfig.defaultPersona);
}
