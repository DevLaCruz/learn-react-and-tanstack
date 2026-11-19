import { heroApi } from '../api/hero.api';
import type { Hero } from '../types/hero.interface';

const BASE_URL = import.meta.env.VITE_API_URL;

/*
 * Obtiene un héroe por su slug (el mismo valor que llega en :idSlug).
 *
 * axios devuelve un objeto con muchas propiedades; solo nos interesa `data`
 * (el cuerpo de la respuesta), por eso usamos desestructuración.
 *
 * get<Hero> es genérico: no valida nada en runtime, solo tipa lo que
 * esperamos recibir. Si la API cambiara, TypeScript no se enteraría; para
 * validación real habría que usar Zod u otra librería.
 */
export const getHeroAction = async (idSlug: string) => {
  const { data } = await heroApi.get<Hero>(`/${idSlug}`);

  return {
    ...data,
    image: `${BASE_URL}/images/${data.image}`,
  };
};
