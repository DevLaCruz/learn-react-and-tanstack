import { heroApi } from '../api/hero.api';
import type { SummaryInformationResponse } from '../types/summary-information.response';

/*
 * Resumen para el dashboard (totales, más fuerte, más inteligente).
 * No recibe parámetros: la misma respuesta sirve para toda la app.
 */
export const getSummaryAction = async () => {
  const { data } = await heroApi.get<SummaryInformationResponse>('/summary');

  return data;
};
