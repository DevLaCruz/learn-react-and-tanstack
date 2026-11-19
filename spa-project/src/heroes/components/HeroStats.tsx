import { use } from 'react';
import { Users, Heart, Zap } from 'lucide-react';
import { HeroStatCard } from './HeroStatCard';

import { Badge } from '@/components/ui/badge';
import { useHeroSummary } from '../hooks/useHeroSummary';
import { FavoriteHeroContext } from '../context/FavoriteHeroContext';

/*
 * Dashboard de estadísticas.
 *
 * Consume dos fuentes de estado distintas:
 *   1. useHeroSummary()      -> datos del servidor (TanStack Query).
 *   2. use(Context)          -> estado global del cliente (favoritos).
 *
 * Si HomePage y SearchPage renderizan este componente, ambas usan la MISMA
 * queryKey ('summary-information') y por tanto comparten caché: el resumen se
 * pide una vez y se reutiliza (hasta que pase el staleTime).
 *
 * ¿lazy? No aquí: se muestra al entrar a Home/Search. Si algún día este bloque
 * quedara debajo del fold o dentro de un tab, entonces sí sería candidato.
 */
export const HeroStats = () => {
  const { data: summary } = useHeroSummary();

  // React 19: use(Contexto) equivale a useContext(Contexto).
  const { favoriteCount } = use(FavoriteHeroContext);

  // const percentageFavorite = useMemo(() => {
  //   const percentage = favoriteCount / summary?.totalHeroes
  // },[favoriteCount, summary])

  // const { data: summary } = useQuery({
  //   queryKey: ['summary-information'],
  //   queryFn: getSummaryAction,
  //   staleTime: 1000 * 60 * 5, // 5 minutos
  // });

  /*
   * Render de carga. TanStack Query devuelve `data: undefined` mientras la
   * primera petición está en curso. Las siguientes visitas usarán la caché y
   * probablemente no verán este mensaje.
   *
   * Mejora opcional: usar `isLoading`/`isPending` y un skeleton en vez de
   * comprobar `!summary`, para distinguir "cargando" de "sin datos".
   */
  if (!summary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <HeroStatCard
        title="Total de personajes"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold">{summary?.totalHeroes}</div>
        <div className="flex gap-1 mt-2">
          <Badge variant="secondary" className="text-xs">
            {summary?.heroCount} Heroes
          </Badge>
          <Badge variant="destructive" className="text-xs">
            {summary?.villainCount} Villains
          </Badge>
        </div>
      </HeroStatCard>

      <HeroStatCard
        title="Favoritos"
        icon={<Heart className="h-4 w-4 text-muted-foreground" />}
      >
        {/* data-testid: gancho estable para los tests, independiente del texto. */}
        <div
          data-testid="favorite-count"
          className="text-2xl font-bold text-red-600"
        >
          {favoriteCount}
        </div>

        <p
          data-testid="favorite-percentage"
          className="text-xs text-muted-foreground"
        >
          {/*
           * Cálculo derivado en el render: no hace falta useState porque no
           * es una fuente de verdad, se obtiene de favoriteCount y summary.
           * .toFixed(2) devuelve string; aquí lo queremos así para mostrarlo.
           */}
          {((favoriteCount / summary.totalHeroes) * 100).toFixed(2)}% of total
        </p>
      </HeroStatCard>

      <HeroStatCard
        title="Fuerte"
        icon={<Zap className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">{summary?.strongestHero.alias}</div>
        <p className="text-xs text-muted-foreground">
          Strength: {summary?.strongestHero.strength}
        </p>
      </HeroStatCard>

      <HeroStatCard
        title="Inteligente"
        icon={<Heart className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">{summary?.smartestHero.alias}</div>
        <p className="text-xs text-muted-foreground">
          Intelligence: {summary?.smartestHero.intelligence}/10
        </p>
      </HeroStatCard>
    </div>
  );
};
