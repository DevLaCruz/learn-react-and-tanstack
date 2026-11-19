import type { Hero } from './hero.interface';

/*
 * Datos del dashboard de estadísticas.
 *
 * El backend devuelve los héroes "más fuerte" y "más inteligente" ya
 * resueltos, en vez de que el frontend tenga que descargar todos los héroes
 * y calcularlo. Es una decisión de diseño: menos datos en el cliente.
 */
export interface SummaryInformationResponse {
  totalHeroes: number;
  strongestHero: Hero;
  smartestHero: Hero;
  heroCount: number;
  villainCount: number;
}
