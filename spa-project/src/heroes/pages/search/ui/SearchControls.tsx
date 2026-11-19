import { useRef } from 'react';
import { useSearchParams } from 'react-router';

import { Search, Filter, SortAsc, Grid, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';

/*
 * Controles de búsqueda y filtros.
 *
 * Estado en la URL, no en useState:
 *   - La página (SearchPage) lee ?name y ?strength para lanzar la query.
 *   - Este componente escribe esos params.
 *   - Al cambiar la URL, React Router re-renderiza SearchPage y TanStack Query
 *     detecta que cambió la queryKey y hace la nueva búsqueda.
 *
 * Este es el típico caso de "estado compartido a través de la URL": no hay
 * que pasar callbacks ni sincronizar dos estados.
 *
 * ¿lazy? El panel de filtros avanzados (AccordionContent) es un candidato
 * razonable: no se ve hasta pulsar "Filters". Se podría extraer a un
 * componente y cargarlo con lazy + <Suspense>.
 */
export const SearchControls = () => {
  // const [query, setQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  /*
   * useRef guarda una referencia mutable que NO provoca re-render al cambiar.
   * Aquí apunta al <input> del DOM para leer su valor solo cuando el usuario
   * pulsa Enter. Es la forma "no controlada" de trabajar con un input:
   *   - No re-renderizamos en cada tecla (más eficiente).
   *   - defaultValue solo se aplica al montar.
   *
   * Alternativa controlada: const [query, setQuery] = useState('') +
   * value={query} + onChange={...}. Se re-renderiza en cada tecla, pero el
   * valor siempre está disponible en React.
   */
  const inputRef = useRef<HTMLInputElement>(null);

  const activeAccordion = searchParams.get('active-accordion') ?? '';
  const selectedStrength = Number(searchParams.get('strength') ?? '0');

  /*
   * Actualización funcional de los params: `prev` es el URLSearchParams actual.
   * Devolvemos el mismo objeto modificado; lo idiomático sería clonarlo antes
   * (new URLSearchParams(prev)) para no mutar el estado original.
   */
  const setQueryParams = (name: string, value: string) => {
    setSearchParams((prev) => {
      prev.set(name, value);
      return prev;
    });
  };

  /*
   * Buscamos solo al pulsar Enter, no en cada tecla. Así evitamos una petición
   * por carácter y una URL distinta por cada letra escrita.
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const value = inputRef.current?.value ?? '';
      setQueryParams('name', value);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            ref={inputRef}
            placeholder="Search heroes, villains, powers, teams..."
            className="pl-12 h-12 text-lg bg-white"
            onKeyDown={handleKeyDown}
            // El input no está controlado: solo se inicializa con el valor de
            // la URL (útil al recargar o al volver atrás).
            defaultValue={searchParams.get('name') ?? ''}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant={
              activeAccordion === 'advance-filters' ? 'default' : 'outline'
            }
            className="h-12"
            onClick={() => {
              /*
               * El Accordion es controlado por `active-accordion` en la URL.
               * Si ya está abierto, lo cerramos guardando ''; si no, lo
               * abrimos guardando el value del item.
               */
              if (activeAccordion === 'advance-filters') {
                setQueryParams('active-accordion', '');
                // setSearchParams((prev) => {
                //   prev.delete('active-accordion');
                //   return prev;
                // });
                return;
              }

              setQueryParams('active-accordion', 'advance-filters');
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <Button variant="outline" className="h-12">
            <SortAsc className="h-4 w-4 mr-2" />
            Sort by Name
          </Button>

          <Button variant="outline" className="h-12">
            <Grid className="h-4 w-4" />
          </Button>

          <Button className="h-12">
            <Plus className="h-4 w-4 mr-2" />
            Add Character
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {/*
       * Accordion controlado: `value` viene de la URL y `collapsible` permite
       * cerrar el item activo. Al cambiar la URL, el acordeón se abre/cierra.
       */}
      <Accordion type="single" collapsible value={activeAccordion}>
        <AccordionItem value="advance-filters">
          {/* <AccordionTrigger>Filtros avanzados</AccordionTrigger> */}
          <AccordionContent>
            <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Advanced Filters</h3>
                <Button variant="ghost">Clear All</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Team</label>
                  <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    All teams
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    All categories
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Universe</label>
                  <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    All universes
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    All statuses
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium">
                  Minimum Strength: {selectedStrength}/10
                </label>
                {/*
                 * El Slider toma su valor inicial de la URL (?strength) y cada
                 * cambio actualiza el param. Como cada movimiento dispara
                 * setSearchParams, también dispara la query; para filtros "en
                 * vivo" convendría aplicar debounce.
                 */}
                <Slider
                  defaultValue={[selectedStrength]}
                  onValueChange={(value) =>
                    setQueryParams('strength', value[0].toString())
                  }
                  max={10}
                  step={1}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};
