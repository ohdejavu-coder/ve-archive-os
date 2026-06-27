import type { Persona, PersonaId } from "@/types/persona";

/**
 * Identity context state provided to all components.
 */
export interface IdentityState {
  /** The current persona */
  persona: Persona;
  /** All available personas */
  allPersonas: Persona[];
  /** The currently active persona ID */
  activePersonaId: PersonaId;
}
