import { use, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { HeroStats } from '@/heroes/components/HeroStats';
import { HeroGrid } from '@/heroes/components/HeroGrid';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadcrumbs';

import { useHeroSummary } from '@/heroes/hooks/useHeroSummary';
import { usePaginatedHero } from '@/heroes/hooks/usePaginatedHero';
import { FavoriteHeroContext } from '@/heroes/context/FavoriteHeroContext';

/*
 * ============================================================================
 *  HOME: LA PANTALLA INICIAL (IMPORT EAGER, NO LAZY)
 * ============================================================================
 *
 * Esta página se importa de forma estática en app.router.tsx porque es la
 * primera pantalla. Hacerla lazy añadiría una espera justo cuando el usuario
 * abre la app, que es precisamente lo que queremos evitar.
 *
 * Regla: lazy para lo que "quizá" se visite; eager para lo que "seguro" se ve
 * al entrar.
 *
 * Aquí sí podrías usar lazy en subárboles que no se ven al inicio (por
 * ejemplo, un modal de edición o una gráfica que aparece hasta hacer scroll),
 * pero no en el header, las stats ni el grid principal.
 * ============================================================================
 */
export const HomePage = () => {
  /*
   * `useSearchParams` es el hook de React Router para la query string.
   * Devuelve [params, setParams], parecido a useState pero leyendo/escribiendo
   * la URL. Cambiar los params provoca una navegación y re-renderiza la ruta.
   */
  const [searchParams, setSearchParams] = useSearchParams();

  /*
   * `use(Contexto)` es la API de React 19 para consumir un contexto.
   * Equivale a `useContext(FavoriteHeroContext)`, pero además funciona dentro
   * de condicionales (useContext no). Aquí obtenemos los favoritos globales
   * sin pasarlos por props (evitamos "prop drilling").
   */
  const { favoriteCount, favorites } = use(FavoriteHeroContext);

  // La URL manda: si no hay valor, usamos los valores por defecto.
  const activeTab = searchParams.get('tab') ?? 'all';
  const page = searchParams.get('page') ?? '1';
  const limit = searchParams.get('limit') ?? '6';
  const category = searchParams.get('category') ?? 'all';

  /*
   * useMemo memoriza el resultado entre renders y solo lo recalcula cuando
   * cambia `activeTab`. Aquí se usa como "validación": si alguien escribe
   * /?tab=lo-que-sea, caemos en 'all' y evitamos que Radix Tabs reciba un
   * value inválido.
   */
  const selectedTab = useMemo(() => {
    const validTabs = ['all', 'favorites', 'heroes', 'villains'];
    return validTabs.includes(activeTab) ? activeTab : 'all';
  }, [activeTab]);

  /*
   * Hooks propios que envuelven useQuery (ver src/heroes/hooks/).
   * Le pasamos +page y +limit porque la URL siempre devuelve strings y
   * la acción necesita números. El `+` es el atajo de Number().
   */
  const { data: heroesResponse } = usePaginatedHero(+page, +limit, category);
  const { data: summary } = useHeroSummary();

  return (
    <>
      <>
        {/* Header */}
        <CustomJumbotron
          title="Universo de SuperHéroes"
          description="Descubre, explora y administra super héroes y villanos"
        />

        <CustomBreadcrumbs currentPage="Super Héroes" />

        {/* Stats Dashboard */}
        <HeroStats />

        {/* Tabs */}
        {/*
         * Tabs es un componente controlado: su valor visible lo decide
         * `selectedTab`, que a su vez viene de la URL. Al hacer clic en un
         * tab actualizamos la URL; React Router re-renderiza y el tab cambia.
         *
         * setSearchParams acepta una función (prev) => next. Eso nos permite
         * leer los params actuales sin "pisar" los que ya existían:
         * por ejemplo, conservamos `limit` al cambiar de tab.
         */}
        <Tabs value={selectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="all"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set('tab', 'all');
                  prev.set('category', 'all');
                  prev.set('page', '1');
                  return prev;
                })
              }
            >
              All Characters ({summary?.totalHeroes})
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="flex items-center gap-2"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set('tab', 'favorites');
                  return prev;
                })
              }
            >
              Favorites ({favoriteCount})
            </TabsTrigger>
            <TabsTrigger
              value="heroes"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set('tab', 'heroes');
                  prev.set('category', 'hero');
                  prev.set('page', '1');
                  return prev;
                })
              }
            >
              Heroes ({summary?.heroCount})
            </TabsTrigger>
            <TabsTrigger
              value="villains"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set('tab', 'villains');
                  prev.set('category', 'villain');
                  prev.set('page', '1');
                  return prev;
                })
              }
            >
              Villains ({summary?.villainCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {/* Mostrar todos los personajes */}
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>
          <TabsContent value="favorites">
            {/* Mostrar todos los personajes favoritos */}
            <HeroGrid heroes={favorites} />
          </TabsContent>
          <TabsContent value="heroes">
            {/* Mostrar todos los héroes */}
            <h1>Héroes</h1>
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>
          <TabsContent value="villains">
            {/* Mostrar todos los Villanos */}
            <h1>Villanos</h1>
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {selectedTab !== 'favorites' && (
          <CustomPagination totalPages={heroesResponse?.pages ?? 1} />
        )}
      </>
    </>
  );
};
