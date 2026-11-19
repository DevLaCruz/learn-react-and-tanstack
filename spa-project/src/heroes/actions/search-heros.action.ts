import { heroApi } from '../api/hero.api';
import type { Hero } from '../types/hero.interface';

const VITE_API_URL = import.meta.env.VITE_API_URL;

/*
 * Opciones de búsqueda. Todos son opcionales porque el usuario puede filtrar
 * por uno o por varios campos. `strength` llega como string porque viene de
 * la URL (?strength=8); axios lo envía igual como query param.
 */
interface Options {
  name?: string;
  team?: string;
  category?: string;
  universe?: string;
  status?: string;
  strength?: string;
}

/*
 * Busca héroes por filtros.
 *
 * Cortocircuito: si no hay ningún filtro, devolvemos [] sin llamar a la API.
 * Es más rápido, evita una petición que probablemente devolvería todo, y
 * deja la pantalla vacía hasta que el usuario busque algo.
 *
 * Nota sobre `params`: axios omite automáticamente las claves undefined, así
 * que no hace falta construir el objeto dinámicamente.
 */
export const searchHeroesAction = async (options: Options = {}) => {
  const { name, team, category, universe, status, strength } = options;

  if (!name && !team && !category && !universe && !status && !strength) {
    return [];
  }

  const { data } = await heroApi.get<Hero[]>('/search', {
    params: {
      name,
      team,
      category,
      universe,
      status,
      strength,
    },
  });

  return data.map((hero) => ({
    ...hero,
    image: `${VITE_API_URL}/images/${hero.image}`,
  }));
};
