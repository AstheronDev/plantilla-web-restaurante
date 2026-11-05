// Lógica de la carta compartida entre el build (respaldo) y el navegador (CSV).

export interface Plato {
  categoria: string;
  plato: string;
  descripcion: string;
  precio: string;
  agotado: boolean;
}

export interface Categoria {
  nombre: string;
  platos: Plato[];
}

type Fila = Record<string, string | undefined>;

/** Parser CSV (RFC 4180): comillas, comillas escapadas, comas y saltos de línea en celdas. */
export function parseCsv(texto: string): string[][] {
  const filas: string[][] = [];
  let fila: string[] = [];
  let celda = '';
  let entreComillas = false;

  // Sin BOM y con un salto final, para que la última fila siempre se cierre.
  const fuente = `${texto.replace(/^﻿/, '')}\n`;

  for (let i = 0; i < fuente.length; i++) {
    const c = fuente[i];

    if (entreComillas) {
      if (c !== '"') celda += c;
      else if (fuente[i + 1] === '"') {
        celda += '"';
        i++;
      } else entreComillas = false;
    } else if (c === '"') {
      entreComillas = true;
    } else if (c === ',') {
      fila.push(celda);
      celda = '';
    } else if (c === '\n') {
      fila.push(celda);
      celda = '';
      if (fila.some((valor) => valor.trim())) filas.push(fila);
      fila = [];
    } else if (c !== '\r') {
      celda += c;
    }
  }

  return filas;
}

/** "Categoría " -> "categoria": tolera mayúsculas, tildes y espacios en la cabecera de la hoja. */
const normalizarCabecera = (cabecera: string) =>
  cabecera
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/** Convierte el texto CSV en objetos usando la primera fila como cabecera. */
export function csvAFilas(texto: string): Fila[] {
  const [cabecera, ...filas] = parseCsv(texto);
  if (!cabecera) return [];

  const columnas = cabecera.map(normalizarCabecera);
  return filas.map((fila) => Object.fromEntries(columnas.map((columna, i) => [columna, fila[i]])));
}

/** "12,00" -> "12,00 €"; un texto como "Según mercado" se respeta tal cual. */
function formatearPrecio(precio: string): string {
  const limpio = precio.replace('€', '').trim();
  return /^\d/.test(limpio) ? `${limpio} €` : limpio;
}

/** Normaliza las filas y descarta las que no tienen nombre de plato. */
export function aPlatos(filas: Fila[]): Plato[] {
  return filas.flatMap((fila) => {
    const plato = fila.plato?.trim();
    if (!plato) return [];

    return {
      plato,
      categoria: fila.categoria?.trim() || 'Otros',
      descripcion: fila.descripcion?.trim() ?? '',
      precio: formatearPrecio(fila.precio ?? ''),
      agotado: fila.disponible?.trim().toLowerCase() === 'no',
    };
  });
}

/** Agrupa por categoría conservando el orden en que aparecen en la hoja. */
export function agrupar(platos: Plato[]): Categoria[] {
  const categorias = new Map<string, Plato[]>();

  for (const plato of platos) {
    const grupo = categorias.get(plato.categoria);
    if (grupo) grupo.push(plato);
    else categorias.set(plato.categoria, [plato]);
  }

  return [...categorias].map(([nombre, platos]) => ({ nombre, platos }));
}
