import { SlashIcon } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Link } from 'react-router';

interface Breadcrumb {
  label: string;
  to: string;
}

interface Props {
  currentPage: string;
  breadcrumbs?: Breadcrumb[];
}

/*
 * Migas de pan reutilizables.
 *
 * `breadcrumbs = []` es un valor por defecto: si el padre no pasa migas
 * intermedias, el componente sigue funcionando y solo muestra Inicio + actual.
 *
 * La página actual se renderiza como texto (sin Link) porque ya estás en ella;
 * los enlaces intermedios sí navegan.
 */
export const CustomBreadcrumbs = ({ currentPage, breadcrumbs = [] }: Props) => {
  return (
    <Breadcrumb className="my-5">
      <BreadcrumbList>
        <BreadcrumbItem>
          {/* asChild: el <Link> de React Router recibe los estilos/props del
              componente de Radix, manteniendo la navegación SPA. */}
          <BreadcrumbLink asChild>
            <Link to="/">Inicio</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/*
         * Cada elemento de una lista renderizada necesita una `key` única.
         * Aquí se usa `to` como identificador. Si dos migas apuntaran a la
         * misma ruta, habría que añadir el índice o un id propio.
         */}
        {breadcrumbs.map((crumb) => (
          <div className="flex items-center" key={crumb.to}>
            <BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              <BreadcrumbLink asChild>
                <Link to={crumb.to}>{crumb.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </div>
        ))}

        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink className="text-black">{currentPage}</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
