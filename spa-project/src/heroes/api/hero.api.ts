import axios from 'axios';

/*
 * Instancia de axios reutilizable para la API de héroes.
 *
 * - Las variables que empiezan por VITE_ son las únicas que Vite expone al
 *   navegador (import.meta.env). Nunca pongas secretos ahí: acaban en el JS
 *   que descarga el cliente.
 * - axios.create() guarda baseURL y permite añadir headers, timeouts,
 *   interceptores, etc. en un solo lugar. Luego basta con:
 *
 *     heroApi.get('/summary')      -> {BASE_URL}/api/heroes/summary
 *     heroApi.get('/superman')     -> {BASE_URL}/api/heroes/superman
 */
const BASE_URL = import.meta.env.VITE_API_URL;

export const heroApi = axios.create({
  baseURL: `${BASE_URL}/api/heroes`,
});
