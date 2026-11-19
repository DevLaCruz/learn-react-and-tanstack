import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina clases de Tailwind de forma segura.
 *
 * - clsx() acepta strings, arrays, objetos condicionales, etc. y descarta los
 *   valores falsy:
 *
 *     cn('p-2', isActive && 'bg-slate-200')
 *
 * - twMerge() resuelve conflictos entre clases de la misma propiedad. Sin él,
 *   'p-2 p-4' dejaría ambas y el resultado dependería del orden en el CSS.
 *   Con twMerge, gana la última: 'p-4'.
 *
 * Se usa en todos los componentes que reciben className condicional.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
