/*
 * Página de administración.
 *
 * Es la candidata más clara a lazy si esta sección crece:
 *
 *   // app.router.tsx
 *   const AdminPage = lazy(() => import('@/admin/pages/AdminPage'));
 *
 * Motivo: la mayoría de usuarios normales nunca entra en /admin. Cargar su
 * código (tablas, formularios, editores...) en el bundle inicial sería
 * desperdiciar ancho de banda para casi todos.
 */
export const AdminPage = () => {
  return <div>AdminPage</div>;
};
