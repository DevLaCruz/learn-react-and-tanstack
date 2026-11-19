import type { Hero } from '../types/hero.interface';
import { HeroGridCard } from './HeroGridCard';

interface Props {
  heroes: Hero[];
}

/*
 * Grid presentacional: recibe héroes y los pinta.
 *
 * No hace peticiones ni conoce la URL; eso lo hacen las páginas. Separar
 * "componente que obtiene datos" de "componente que pinta datos" facilita
 * reutilizarlo (HomePage y SearchPage lo usan con fuentes distintas).
 *
 * ¿lazy aquí? Sería posible si el grid fuera enorme, pero en esta app se ve
 * al entrar a la página. Mejor cargar la página completa con lazy (como
 * SearchPage) que dividir cada tarjeta.
 */
export const HeroGrid = ({ heroes }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      {/* key={hero.id}: React usa la key para identificar cada elemento entre
          renders y no confundir tarjetas al filtrar/reordenar. */}
      {heroes.map((hero) => (
        <HeroGridCard key={hero.id} hero={hero} />
      ))}
    </div>
  );
};
