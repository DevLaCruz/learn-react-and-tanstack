import { heroApi } from '../api/hero.api';
import type { HeroesResponse } from '../types/get-heroes.response';

const BASE_URL = import.meta.env.VITE_API_URL;

/*
 * "Action" = función que encapsula una operación contra la API.
 * No sabe nada de React; podría usarse desde un componente, un loader o un
 * test. Separar esto de los componentes evita mezclar UI con HTTP.
 *
 * Paginación por offset:
 *   página 1, limit 6 -> offset 0
 *   página 2, limit 6 -> offset 6
 *   página N, limit L -> offset (N - 1) * L
 *
 * La API devuelve `image` como nombre de archivo (p. ej. "superman.jpg");
 * aquí la convertimos en URL absoluta para que <img src> funcione.
 */
export const getHeroesByPageAction = async (
  page: number, // 1
  limit: number = 6,
  category: string = 'all'
): Promise<HeroesResponse> => {
  // Defensa contra NaN: la URL puede traer ?page=abc.
  if (isNaN(page)) {
    page = 1;
  }

  if (isNaN(limit)) {
    limit = 6;
  }

  const { data } = await heroApi.get<HeroesResponse>(`/`, {
    params: {
      limit: limit,
      offset: (page - 1) * limit,
      category: category,
    },
  });

  const heroes = data.heroes.map((hero) => ({
    ...hero,
    image: `${BASE_URL}/images/${hero.image}`,
  }));

  return {
    ...data,
    heroes: heroes,
  };
};
