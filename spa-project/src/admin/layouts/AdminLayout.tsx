import { Outlet } from 'react-router';

/*
 * Layout de administración.
 *
 * <Outlet /> es el "hueco" donde React Router renderiza la ruta hija que
 * coincide (aquí, AdminPage en /admin). El layout se mantiene montado al
 * navegar entre sus hijas, así que su estado no se pierde.
 *
 * Los layouts se importan de forma estática: son el marco de varias rutas y
 * deben estar disponibles cuanto antes.
 */
export const AdminLayout = () => {
  return (
    <div className="bg-indigo-500">
      <Outlet />
    </div>
  );
};
