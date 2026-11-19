import type { PropsWithChildren } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

/*
 * PropsWithChildren añade automáticamente `children?: ReactNode` a las props.
 * Es el patrón para componentes "contenedor" que envuelven contenido.
 *
 * `icon: React.ReactNode` acepta cualquier cosa renderizable: un elemento
 * <Users />, un string, un número...
 */
interface Props extends PropsWithChildren {
  title: string;
  icon: React.ReactNode;
}

export const HeroStatCard = ({ title, icon, children }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
