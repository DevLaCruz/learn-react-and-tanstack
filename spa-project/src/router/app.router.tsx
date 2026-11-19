import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

import { AdminLayout } from '@/admin/layouts/AdminLayout';
import { AdminPage } from '@/admin/pages/AdminPage';
import { HeroesLayout } from '@/heroes/layouts/HeroesLayout';
import { HeroPage } from '@/heroes/pages/hero/HeroPage';
import { HomePage } from '@/heroes/pages/home/HomePage';

/*
 * ============================================================================
 *  ¿QUÉ ES `lazy` Y POR QUÉ ESTÁ AQUÍ?
 * ============================================================================
 *
 * `lazy` es una función de React que permite cargar un componente "bajo
 * demanda" (code splitting / carga diferida).
 *
 * Sin lazy:
 *
 *   import { SearchPage } from '@/heroes/pages/search/SearchPage';
 *
 *   - Ese import es ESTÁTICO.
 *   - Vite/Rolldown mete SearchPage y TODO lo que importa (HeroStats,
 *     HeroGrid, SearchControls, react-query, etc.) en el bundle inicial.
 *   - El navegador descarga ese código aunque el usuario nunca visite /search.
 *
 * Con lazy:
 *
 *   const SearchPage = lazy(() => import('@/heroes/pages/search/SearchPage'));
 *
 *   - `import()` es un import DINÁMICO: no se ejecuta al cargar el router.
 *   - Se ejecuta la primera vez que React intenta renderizar <SearchPage />.
 *   - Vite detecta ese import() y genera un archivo (chunk) separado.
 *   - El navegador solo descarga ese chunk cuando el usuario navega a /search.
 *
 * En otras palabras: lazy cambia "descargar todo al inicio" por
 * "descargar cada pantalla cuando se necesita".
 *
 * ----------------------------------------------------------------------------
 *  ¿CÓMO FUNCIONA INTERNAMENTE? (para entender el porqué del Suspense)
 * ----------------------------------------------------------------------------
 *
 * `lazy(() => import(...))` NO devuelve el componente todavía. Devuelve un
 * componente especial que, al renderizarse:
 *
 *   1. Lanza la descarga del módulo (la promesa del import()).
 *   2. Mientras la promesa está pendiente, "suspende" el render.
 *   3. Cuando la promesa se resuelve, React vuelve a renderizar y ya muestra
 *      el componente real.
 *
 * Ese "suspender" es el motivo por el que React.lazy está íntimamente ligado
 * a <Suspense>. Suspense es quien decide qué mostrar mientras se descarga:
 *
 *   <Suspense fallback={<p>Cargando buscador...</p>}>
 *     <SearchPage />
 *   </Suspense>
 *
 * Regla práctica: usa lazy cuando el componente (a) pesa, (b) no es necesario
 * en la primera pantalla, o (c) pertenece a una ruta que no todos visitan.
 * NO lo uses en el camino crítico (HomePage, layout, menú, providers), porque
 * solo añadirías una espera extra a la primera carga.
 *
 * ----------------------------------------------------------------------------
 *  APLICACIONES DE lazy MÁS ALLÁ DE ESTE ROUTER
 * ----------------------------------------------------------------------------
 *
 * lazy no es exclusivo de rutas. Se puede usar en cualquier componente que
 * se importe con import() dinámico. En este proyecto tiene sentido en:
 *
 *   1. src/router/app.router.tsx
 *      - /search (SearchPage) y, si creciera, /admin.
 *   2. src/heroes/pages/hero/HeroPage.tsx
 *      - Es una página grande con muchos tabs y solo se entra al hacer clic
 *        en una tarjeta. Es la siguiente candidata natural a lazy.
 *   3. Subárboles pesados DENTRO de una página ya cargada:
 *      - Los tabs "Poderes", "Equipo" e "Información" de HeroPage.
 *      - El panel de filtros avanzados de SearchControls.
 *      - Modales, editores de texto, gráficas, tablas grandes, PDFs, mapas...
 *        Todo eso puede vivir en su propio chunk y cargarse al abrirlo.
 *   4. Librerías pesadas de terceros:
 *      - Charts, editores (Monaco/CodeMirror), mapas, exportadores...
 *   5. Rutas de administración (src/admin/pages/AdminPage.tsx):
 *      - Normalmente solo las usa un porcentaje pequeño de usuarios.
 *
 * Lo que NO conviene envolver en lazy aquí:
 *   - src/main.tsx, src/HeroesApp.tsx, HeroesLayout, CustomMenu, HomePage.
 *     Son parte de la primera pantalla; diferirlos empeora la experiencia.
 *
 * NOTA: React Router v7 también tiene su propia propiedad `lazy` a nivel de
 * objeto de ruta (route.lazy), pensada para cargar el "módulo de ruta"
 * (loader, action, Component...). Es una alternativa a React.lazy cuando
 * usas loaders/actions. Aquí usamos React.lazy porque definimos las rutas
 * de forma declarativa con `element`.
 * ============================================================================
 */

// Versión "eager" (la que estaba antes y sigue siendo válida):
// import { SearchPage } from '@/heroes/pages/search/SearchPage';
//
// Versión "lazy" (la actual): el import() solo se dispara al entrar a /search.
// OJO: lazy espera que el módulo tenga un `export default`. Por eso
// SearchPage.tsx termina con `export default SearchPage;` además del export
// con nombre (el named export se usa en tests y en otros imports directos).
const SearchPage = lazy(() => import('@/heroes/pages/search/SearchPage'));

export const appRouter = createBrowserRouter([
  {
    // Ruta padre: comparte layout (menú + <Outlet />) con sus hijas.
    // El layout se importa de forma estática porque se ve en todas las rutas.
    path: '/',
    element: <HeroesLayout />,
    children: [
      {
        // Ruta índice: es la primera pantalla, así que se carga de forma
        // eager. Si la hiciéramos lazy, el usuario vería un hueco/fallback
        // justo en la carga inicial, que es lo que queremos evitar.
        index: true,
        element: <HomePage />,
      },
      {
        // Ruta con parámetro dinámico: :idSlug se lee con useParams()
        // dentro de HeroPage. Sigue siendo eager; ver el comentario de
        // HeroPage.tsx sobre por qué es candidata a lazy.
        path: 'heroes/:idSlug',
        element: <HeroPage />,
      },
      {
        // Ruta lazy: React descarga el chunk de SearchPage al entrar aquí.
        //
        // Actualmente no hay un <Suspense> explícito alrededor. En React 19,
        // las navegaciones de React Router ocurren dentro de una transición,
        // así que React puede mantener la pantalla anterior mientras llega el
        // chunk. Aun así, lo idiomático (y lo que verás en la mayoría de
        // proyectos) es declarar un fallback para redes lentas:
        //
        //   element: (
        //     <Suspense fallback={<p>Cargando buscador...</p>}>
        //       <SearchPage />
        //     </Suspense>
        //   ),
        //
        // También podrías poner un único <Suspense> global en HeroesApp.tsx
        // envolviendo <RouterProvider />. La diferencia es el alcance del
        // fallback: global = toda la app; por ruta = solo esa pantalla.
        path: 'search',
        element: <SearchPage />,
      },
      {
        // Comodín: cualquier URL desconocida redirige al inicio.
        // <Navigate /> es un componente que provoca navegación al renderizar.
        path: '*',
        // element: <h1>404</h1>,
        element: <Navigate to="/" />,
      },
    ],
  },

  {
    // Sección de administración: también sería una candidata típica a lazy.
    // Ejemplo:
    //   const AdminPage = lazy(() => import('@/admin/pages/AdminPage'));
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
    ],
  },
]);
