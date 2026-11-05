import type { APIRoute } from 'astro';
import negocio from '../data/negocio.json';

// Favicon generado desde negocio.json: inicial del negocio sobre su color principal.
export const GET: APIRoute = () => {
  const { principal, acento } = negocio.colores;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="${principal}"/><text x="16" y="23" text-anchor="middle" font-family="system-ui,sans-serif" font-size="21" font-weight="700" fill="${acento}">${negocio.nombre[0]}</text></svg>`;

  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
