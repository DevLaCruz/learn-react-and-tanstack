import { RouterProvider } from 'react-router';
import { appRouter } from './router/app.router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FavoriteHeroProvider } from './heroes/context/FavoriteHeroContext';

/*
 * QueryClient = la "base de datos" en memoria de TanStack Query.
 * Guarda las respuestas de las peticiones, su estado (loading, error...),
 * el momento en que se volvieron obsoletas, etc.
 *
 * Se crea UNA sola vez, fuera del componente. Si se creara dentro del render,
 * cada render generaría una caché nueva y se perderían los datos.
 */
const queryClient = new QueryClient();

/*
 * Composición de providers de la app. El orden importa:
 *
 * <QueryClientProvider>
 *   Cualquier componente hijo puede usar useQuery/useMutation.
 *   <FavoriteHeroProvider>
 *     Cualquier descendiente puede leer el contexto de favoritos.
 *     <RouterProvider>
 *       Monta el árbol de rutas definido en app.router.tsx.
 *
 * Como HeroesApp se renderiza una sola vez, aquí tampoco conviene lazy.
 *
 * SI QUISIERAS UN FALLBACK GLOBAL PARA LAS RUTAS LAZY, este sería el lugar:
 *
 *   <Suspense fallback={<p>Cargando...</p>}>
 *     <RouterProvider router={appRouter} />
 *   </Suspense>
 *
 * Pero ojo: un Suspense aquí envuelve TODA la app, incluido el layout y el
 * menú. Si el chunk de /search tarda, se ocultaría también la navegación.
 * Por eso suele ser mejor tener un Suspense por ruta (ver app.router.tsx).
 */
export const HeroesApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoriteHeroProvider>
        <RouterProvider router={appRouter} />

        {/* Panel de depuración de queries; solo se muestra en desarrollo. */}
        <ReactQueryDevtools initialIsOpen={false} />
      </FavoriteHeroProvider>
    </QueryClientProvider>
  );
};
