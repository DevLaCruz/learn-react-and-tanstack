import {
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { Link, useLocation } from 'react-router';
import { NavigationMenu, NavigationMenuList } from '../ui/navigation-menu';
import { cn } from '@/lib/utils';

/*
 * Menú principal.
 *
 * ¿Por qué NO se carga con lazy? Porque se renderiza en todas las rutas
 * (vive en HeroesLayout) y forma parte de la navegación principal. Diferirlo
 * solo añadiría un parpadeo en la primera pantalla. lazy se reserva para
 * pantallas o bloques que quizá no se visiten.
 *
 * useLocation devuelve la ubicación actual; `pathname` es la ruta sin query
 * string (/search?name=x -> /search). Lo usamos para marcar el enlace activo.
 */
export const CustomMenu = () => {
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <NavigationMenu className="py-5">
      <NavigationMenuList>
        {/* Home */}
        <NavigationMenuItem>
          {/*
           * asChild hace que el componente de Radix no renderice su propio
           * <a>, sino que "preste" sus props y estilos al hijo (<Link>).
           * Así conservamos la navegación SPA de React Router sin anidar
           * enlaces (<a><a>) ni recargar la página.
           *
           * cn() combina clases condicionales y resuelve conflictos de
           * Tailwind (por ejemplo, p-2 vs p-4). Ver src/lib/utils.ts.
           */}
          <NavigationMenuLink
            asChild
            className={cn(isActive('/') && 'bg-slate-200', 'p-2 rounded-md')}
          >
            <Link to="/">Inicio</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Search */}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              isActive('/search') && 'bg-slate-200',
              'p-2 rounded-md'
            )}
          >
            <Link to="/search">Buscar superhéroes</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
