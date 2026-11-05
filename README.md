# Plantilla web de restaurante

Web estática con Astro y Tailwind para Cloudflare Workers. Todo lo que cambia entre clientes está en
`src/data/negocio.json`, y la carta se edita desde una hoja de Google Sheets.

Requiere Node 22.12 o superior.

```bash
npm install
npm run dev
```

## Adaptarla a un cliente

1. Edita `src/data/negocio.json`. Cada `npm run build` lista en consola los datos que siguen pendientes.
2. Cambia `name` en `wrangler.jsonc`.
3. Sustituye `public/og.png` (1200×630), que es la imagen al compartir el enlace en WhatsApp y redes.

Los iconos de `puntosFuertes` admiten `terraza`, `producto` y `familia`. Para añadir más, amplía `iconos` en
`src/pages/index.astro`.

## Carta en Google Sheets

1. Crea una hoja con estas columnas en la primera fila: `categoria`, `plato`, `descripcion`, `precio`, `disponible`.
2. En `disponible`, escribe `NO` para marcar el plato como agotado.
3. Ve a **Archivo > Compartir > Publicar en la web**, elige la hoja y el formato CSV, y publica.
4. Pega el enlace en `cartaCsv`.

Los cambios en la hoja aparecen en la web sin volver a desplegar; Google puede tardar unos minutos en actualizar el
CSV publicado.

El contenido de `cartaRespaldo` va en el HTML. Se muestra hasta que llega la hoja y se mantiene si la hoja falla o
tarda más de 5 segundos, o si no hay conexión. Conviene actualizarlo de vez en cuando, porque es lo que ven los
buscadores.

## Analítica

Crea el sitio en Cloudflare, en **Analytics & Logs > Web Analytics**, y pega el token en
`analitica.cloudflareToken`. Sin token, el script no se incluye.

## Despliegue

```bash
npx astro build && npx wrangler deploy
```

`npm run preview` sirve el resultado de `dist/` con Wrangler en local.

## Versiones

Astro está fijado en 7.3.8 porque las versiones posteriores exigen un Node más reciente (22.23.4 o superior).
