import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import type { Hero } from '../types/hero.interface';

/*
 * ============================================================================
 *  CONTEXTO DE FAVORITOS: ESTADO GLOBAL SIN PROP DRILLING
 * ============================================================================
 *
 * Un Context es un "canal" por el que un componente padre comparte datos con
 * cualquier descendiente, sin tener que pasar props nivel por nivel.
 *
 * Aquí guardamos los favoritos porque los necesitan componentes que están en
 * ramas distintas del árbol (HomePage, HeroStats, HeroGridCard...).
 *
 * Piezas:
 *   createContext  -> crea el canal (con un valor por defecto).
 *   Provider       -> publica un valor para todos sus descendientes.
 *   use(Context)   -> consume ese valor desde cualquier descendiente.
 * ============================================================================
 */

/*
 * El tipo del valor que viaja por el contexto.
 * Incluye estado (favorites, favoriteCount) y acciones (isFavorite,
 * toggleFavorite). Es importante tiparlo: createContext no infiere nada.
 */
interface FavoriteHeroContext {
  // State
  favorites: Hero[];
  favoriteCount: number;

  // Methods
  isFavorite: (hero: Hero) => boolean;
  toggleFavorite: (hero: Hero) => void;
}

/*
 * `createContext({} as FavoriteHeroContext)` crea el contexto con un objeto
 * vacío "disfrazado" del tipo correcto. Es un patrón habitual para evitar
 * tener que comprobar null en cada consumidor:
 *
 *   const { favorites } = use(FavoriteHeroContext);
 *
 * El valor por defecto casi nunca se usa, porque en la práctica siempre hay
 * un Provider por encima. Si un componente consume el contexto SIN provider,
 * obtendrá ese objeto vacío y fallará al usar sus propiedades. Alternativa
 * más segura: createContext<FavoriteHeroContext | null>(null) y lanzar un
 * error en un hook custom si es null.
 *
 * El comentario eslint desactiva la regla de "solo exportar componentes" de
 * Fast Refresh: exportar el contexto y el provider desde el mismo archivo es
 * intencional y no rompe la app.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const FavoriteHeroContext = createContext({} as FavoriteHeroContext);

/*
 * Lee los favoritos guardados en el navegador.
 *
 * localStorage solo guarda strings, por eso hacemos JSON.parse al leer y
 * JSON.stringify al escribir. Si la clave no existe, devolvemos [].
 *
 * Ojo: esto se ejecuta en el navegador. En SSR, `localStorage` no existe y
 * habría que comprobar `typeof window !== 'undefined'`.
 */
const getFavoritesFromLocalStorage = (): Hero[] => {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
};

export const FavoriteHeroProvider = ({ children }: PropsWithChildren) => {
  /*
   * Inicialización perezosa de useState:
   *
   *   useState(getFavoritesFromLocalStorage())
   *
   * leería localStorage en CADA render (aunque React solo use el valor la
   * primera vez). Pasando la función:
   *
   *   useState(getFavoritesFromLocalStorage)
   *
   * React la ejecuta únicamente en el primer render. Es el mismo patrón que
   * lazy: "no hagas el trabajo hasta que de verdad haga falta".
   */
  const [favorites, setFavorites] = useState<Hero[]>(
    getFavoritesFromLocalStorage
  );

  /*
   * Alterna un héroe entre favorito y no favorito.
   *
   * Importante: creamos un array NUEVO (filter / spread). React compara por
   * referencia para decidir si debe re-renderizar; mutar el array existente
   * (favorites.push) no dispararía la actualización.
   */
  const toggleFavorite = (hero: Hero) => {
    const heroExist = favorites.find((h) => h.id === hero.id);

    if (heroExist) {
      const newFavorites = favorites.filter((h) => h.id !== hero.id);
      setFavorites(newFavorites);
      return;
    }

    setFavorites([...favorites, hero]);
  };

  // some() devuelve true en cuanto encuentra una coincidencia.
  const isFavorite = (hero: Hero) => {
    return favorites.some((h) => h.id === hero.id);
  };

  /*
   * Sincroniza el estado con localStorage cada vez que cambian los favoritos.
   * El array de dependencias [favorites] evita escribir en cada render.
   *
   * En React StrictMode (desarrollo) este efecto se ejecuta dos veces para
   * detectar efectos no idempotentes. Aquí es inofensivo: escribir dos veces
   * el mismo valor en localStorage produce el mismo resultado.
   */
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  return (
    /*
     * React 19 permite usar el propio contexto como provider:
     *
     *   <FavoriteHeroContext value={...}>
     *
     * Antes se escribía <FavoriteHeroContext.Provider value={...}>.
     *
     * Cada render crea un objeto nuevo para `value`. Eso hace que TODOS los
     * consumidores se re-rendericen cuando cambia el provider, incluso si solo
     * cambió una parte. En una app grande se optimiza separando contextos o
     * memorizando el value con useMemo/useCallback.
     */
    <FavoriteHeroContext
      value={{
        // State
        favoriteCount: favorites.length,
        favorites: favorites,
        // Methods
        isFavorite: isFavorite,
        toggleFavorite: toggleFavorite,
      }}
    >
      {children}
    </FavoriteHeroContext>
  );
};
