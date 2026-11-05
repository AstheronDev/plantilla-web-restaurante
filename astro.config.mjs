import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import negocio from './src/data/negocio.json' with { type: 'json' };

// Avisa en cada build de los datos que faltan por completar en negocio.json.
const pendientes = [
  negocio.url.includes('example.com') && 'url',
  negocio.cartaCsv.includes('...') && 'cartaCsv (se usará cartaRespaldo)',
  !negocio.analitica.cloudflareToken && 'analitica.cloudflareToken (sin analítica)',
  ...Object.entries(negocio.legal)
    .filter(([, valor]) => valor.startsWith('PENDIENTE'))
    .map(([campo]) => `legal.${campo}`),
].filter(Boolean);

if (pendientes.length) {
  console.warn(`\n[negocio.json] Pendiente de completar:\n  - ${pendientes.join('\n  - ')}\n`);
}

export default defineConfig({
  site: negocio.url,
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
