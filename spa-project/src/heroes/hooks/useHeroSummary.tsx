import { useQuery } from '@tanstack/react-query';
import { getSummaryAction } from '../actions/get-summary.action';

/*
 * Resumen global (totales, héroe más fuerte, más inteligente...).
 *
 * Esta queryKey NO incluye parámetros: el resumen es el mismo para todos los
 * usuarios y pantallas. Por eso puede compartirse entre HomePage y SearchPage:
 * si HomePage ya lo cargó, HeroStats en SearchPage lo reutiliza de la caché
 * y no vuelve a pedirlo al servidor.
 *
 * `queryFn: getSummaryAction` sí puede pasarse directamente porque la función
 * no necesita argumentos.
 */
export const useHeroSummary = () => {
  return useQuery({
    queryKey: ['summary-information'],
    queryFn: getSummaryAction,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
