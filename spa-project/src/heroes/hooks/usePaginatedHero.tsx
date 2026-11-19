import { useQuery } from '@tanstack/react-query';
import { getHeroesByPageAction } from '../actions/get-heroes-by-page.action';

/*
 * Hook = lógica reutilizable con estado/efectos, pero también puede ser una
 * simple capa de abstracción (como este caso).
 *
 * ¿Por qué envolver useQuery en un hook propio?
 *   - La página no necesita saber cómo se construye la queryKey.
 *   - Si mañana cambia la forma de pedir héroes, se toca un solo sitio.
 *   - El componente queda más legible.
 *
 * La queryKey es ['heroes', { page, limit, category }]:
 *   - Cada combinación de página/límite/categoría es una entrada de caché.
 *   - Al cambiar de página, TanStack Query devuelve al instante los datos ya
 *     cacheados de esa página si existen, y revalida en segundo plano.
 *
 * `queryFn: () => getHeroesByPageAction(...)` es una función envoltorio porque
 * queryFn no recibe argumentos propios: si pasáramos directamente
 * getHeroesByPageAction, TanStack Query le inyectaría su contexto como primer
 * argumento (page), lo cual sería incorrecto.
 */
export const usePaginatedHero = (
  page: number,
  limit: number,
  category = 'all'
) => {
  return useQuery({
    queryKey: ['heroes', { page, limit, category }],
    queryFn: () => getHeroesByPageAction(+page, +limit, category),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
