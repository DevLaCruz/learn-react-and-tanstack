import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { HeroesApp } from './HeroesApp';

import './index.css';

/*
 * Punto de entrada de la SPA.
 *
 * - createRoot() conecta React con el <div id="root"> del index.html.
 * - El `!` (non-null assertion) le dice a TypeScript que el elemento existe.
 *   Si el HTML no tuviera ese div, la app fallaría en tiempo de ejecución.
 * - <StrictMode> no renderiza nada visible: en desarrollo monta/desmonta los
 *   componentes dos veces para detectar efectos secundarios mal escritos y
 *   muestra warnings adicionales. En producción no tiene ese doble montaje.
 *
 * Aquí NO tiene sentido usar lazy: es el arranque de la app. Toda espera
 * que añadiéramos aquí se notaría en la primera pantalla.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroesApp />
  </StrictMode>
);
