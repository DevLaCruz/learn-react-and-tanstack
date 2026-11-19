/*
 * Modelo de un héroe tal como lo consume la UI.
 *
 * `interface` describe la forma de un objeto; no genera código en runtime.
 * Las ventajas:
 *   - Autocompletado y errores si escribimos mal una propiedad.
 *   - Sirve de contrato entre API, acciones, hooks y componentes.
 *
 * `image` se guarda como URL absoluta después de pasar por las acciones
 * (ver get-hero.action.ts); la API en realidad devuelve solo el nombre del
 * archivo.
 */
export interface Hero {
  id: string;
  name: string;
  slug: string;
  alias: string;
  powers: string[];
  description: string;
  strength: number;
  intelligence: number;
  speed: number;
  durability: number;
  team: string;
  image: string;
  firstAppearance: string;
  status: string;
  category: string;
  universe: string;
}
