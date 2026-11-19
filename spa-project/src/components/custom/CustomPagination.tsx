import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useSearchParams } from 'react-router';

interface Props {
  totalPages: number;
}

/*
 * Paginación basada en la URL.
 *
 * La página actual NO vive en useState: vive en ?page=N. Ventajas:
 *   - Se puede compartir el enlace a la página 3.
 *   - Recargar mantiene la página.
 *   - Atrás/adelante del navegador funciona.
 *
 * El componente solo necesita saber cuántas páginas hay (totalPages); el resto
 * lo deduce de la URL.
 */
export const CustomPagination = ({ totalPages }: Props) => {
  /*
   * searchParams es un objeto URLSearchParams. Ojo: es "mutable", pero React
   * Router recomienda no mutar el existente y crear uno nuevo:
   *
   *   const next = new URLSearchParams(searchParams);
   *   next.set('page', String(page));
   *   setSearchParams(next);
   *
   * Aquí se muta y se pasa el mismo objeto. Funciona en la práctica, pero el
   * patrón inmutable es más seguro y predecible.
   */
  const [searchParams, setSearchParams] = useSearchParams();

  // La URL puede traer basura (?page=abc): normalizamos a 1.
  const queryPage = searchParams.get('page') ?? '1';
  const page = isNaN(+queryPage) ? 1 : +queryPage;

  const handlePageChange = (page: number) => {
    // Evita páginas fuera de rango (incluido el botón "Anteriores" en la 1).
    if (page < 1 || page > totalPages) return;

    searchParams.set('page', page.toString());

    setSearchParams(searchParams);
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        Anteriores
      </Button>

      {/*
       * Array.from({ length: totalPages }) crea un array de longitud N para
       * poder mapearlo. No usamos el valor, solo el índice: la página es
       * index + 1.
       *
       * En listas generadas, `key` debe ser estable y única. Aquí el índice
       * sirve porque las páginas no se reordenan ni se eliminan.
       */}
      {Array.from({ length: totalPages }).map((_, index) => (
        <Button
          key={index}
          variant={page === index + 1 ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </Button>
      ))}

      {/* <Button variant="outline" size="sm">
        2
      </Button> */}
      {/* 
      <Button variant="ghost" size="sm" disabled>
        <MoreHorizontal className="h-4 w-4" />
      </Button> */}

      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        Siguientes
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
