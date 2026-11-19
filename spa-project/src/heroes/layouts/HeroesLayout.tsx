import { CustomMenu } from '@/components/custom/CustomMenu';
import { Outlet } from 'react-router';

/*
 * Layout público de la zona de héroes.
 *
 * Contiene el menú y un <Outlet />. React Router renderiza aquí las páginas
 * hijas (HomePage, HeroPage, SearchPage) sin desmontar el layout, de modo que
 * el menú no parpadea al navegar.
 *
 * Import estático a propósito: es el marco de la app y se ve en todas las
 * rutas hijas. No lo cargues con lazy.
 */
export const HeroesLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        <CustomMenu />

        <Outlet />
      </div>
    </div>
  );
};
