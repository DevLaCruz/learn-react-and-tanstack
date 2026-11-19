interface Props {
  title: string;
  description?: string;
}

/*
 * Cabecera visual de cada página (título grande + descripción opcional).
 *
 * `description?` es opcional: TypeScript obliga a comprobar que existe antes
 * de usarla. En JSX, `{description && <p>...}` no renderiza nada si es
 * undefined, así que el componente se adapta sin lógica extra.
 *
 * Este componente es pequeño y se ve al entrar, así que no tiene sentido
 * cargarlo con lazy.
 */
export const CustomJumbotron = ({ title, description }: Props) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
        {title}
      </h1>
      {description && <p className="text-gray-600 text-lg">{description}</p>}
    </div>
  );
};
