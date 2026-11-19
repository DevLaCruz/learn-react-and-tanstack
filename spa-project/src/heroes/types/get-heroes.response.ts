import type { Hero } from './hero.interface';

/*
 * Respuesta paginada de la API de héroes.
 *
 * `total`  -> cuántos héroes hay en total (con el filtro aplicado).
 * `pages`  -> cuántas páginas hay, calculado por el backend.
 * `heroes` -> solo los de la página solicitada.
 *
 * `import type` solo trae el tipo en tiempo de compilación; no genera un
 * import real en el JS final. Úsalo siempre que solo necesites tipos.
 */
export interface HeroesResponse {
  total: number;
  pages: number;
  heroes: Hero[];
}
