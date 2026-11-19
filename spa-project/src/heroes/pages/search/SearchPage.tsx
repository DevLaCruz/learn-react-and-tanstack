import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { HeroStats } from '@/heroes/components/HeroStats';
import { SearchControls } from './ui/SearchControls';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadcrumbs';
import { HeroGrid } from '@/heroes/components/HeroGrid';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import { searchHeroesAction } from '@/heroes/actions/search-heros.action';

/*
 * ============================================================================
 *  ESTA ES LA PÁGINA QUE EL ROUTER CARGA CON `lazy`
 * ============================================================================
 *
 * En app.router.tsx:
 *
 *   const SearchPage = lazy(() => import('@/heroes/pages/search/SearchPage'));
 *
 * Para que eso funcione, este archivo DEBE tener un `export default`
 * (React.lazy se queda con la propiedad `default` del módulo). Abajo verás
 * tanto el export con nombre como el default:
 *
 *   export const SearchPage = ...   // named export (tests, imports directos)
 *   export default SearchPage;      // lo que consume lazy()
 *
 * Si quitáramos el default, lazy fallaría con algo como:
 * "Element type is invalid... got: undefined".
 *
 * ¿Por qué esta página es buena candidata a lazy?
 *   - No es la pantalla inicial: el usuario solo la ve si navega a /search.
 *   - Arrastra bastante UI (estadísticas, filtros, grid, componentes Radix).
 *   - Si nunca entra, ese código no hace falta descargarlo.
 *
 * ¿Y si además quisiéramos dividir ESTA página? Se podría hacer lazy en
 * subcomponentes pesados, por ejemplo HeroStats o el panel de filtros
 * avanzados, envolviéndolos en <Suspense>. Divide cuando un subárbol es
 * claramente grande y no se ve al entrar; no dividas por dividir.
 * ============================================================================
 */
export const SearchPage = () => {
  /*
   * useSearchParams es la forma de React Router de leer la query string.
   *
   * URL: /search?name=superman&strength=8
   *   searchParams.get('name')     -> "superman"
   *   searchParams.get('strength') -> "8"
   *   searchParams.get('foo')      -> null
   *
   * Usamos la URL como fuente de verdad (en vez de useState) porque:
   *   - La búsqueda se puede compartir/recargar sin perder los filtros.
   *   - El botón atrás/adelante del navegador funciona de forma natural.
   *
   * `?? undefined` convierte el null de "no existe" en undefined, porque la
   * acción espera `name?: string` y axios omite los params undefined.
   */
  const [searchParams] = useSearchParams();

  const name = searchParams.get('name') ?? undefined;
  const strength = searchParams.get('strength') ?? undefined;

  /*
   * useQuery = estado + caché + revalidación de una petición async.
   *
   * queryKey: identifica esta consulta en la caché. Es un array porque puede
   *   contener varias partes. Si cambia (por ejemplo, otro `name`), TanStack
   *   Query entiende que es OTRA consulta y vuelve a pedir los datos.
   *   Incluir los filtros en la key evita mostrar resultados de una búsqueda
   *   anterior mientras llega la nueva.
   *
   * queryFn: la función que hace la petición. Debe devolver una promesa.
   *
   * staleTime: cuánto tiempo los datos se consideran "frescos". Dentro de esos
   *   5 minutos, si vuelves a la misma búsqueda, TanStack Query usa la caché y
   *   no repite la petición al servidor. Pasado ese tiempo, los marca como
   *   obsoletos y los revalida en segundo plano.
   *
   * data: la respuesta. Le damos un valor por defecto ([]) para poder pasar
   *   `heroes` directamente a <HeroGrid /> sin comprobar undefined.
   */
  const { data: heroes = [] } = useQuery({
    queryKey: ['search', { name, strength }],
    queryFn: () => searchHeroesAction({ name, strength }),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return (
    <>
      <CustomJumbotron
        title="Búsqueda de SuperHéroes"
        description="Descubre, explora y administra super héroes y villanos"
      />

      {/* Migas de pan: "Inicio / Buscador de héroes" */}
      <CustomBreadcrumbs
        currentPage="Buscador de héroes"
        // breadcrumbs={[
        //   { label: 'Home1', to: '/' },
        //   { label: 'Home2', to: '/' },
        //   { label: 'Home3', to: '/' },
        // ]}
      />

      {/* Stats Dashboard: también hace su propia consulta (summary). */}
      <HeroStats />

      {/* Filtros: escriben en la URL y esta página se re-renderiza sola. */}
      <SearchControls />

      {/* Resultados de la búsqueda actual. */}
      <HeroGrid heroes={heroes} />
    </>
  );
};

// Requerido por React.lazy: se queda con el export default del módulo.
export default SearchPage;
