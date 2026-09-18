#!/usr/bin/env node
/**
 * Baixa as fontes do projeto já subsetadas, direto do Google Fonts.
 *
 * Por que não geramos o subset localmente: as 12 fontes do site do Canva vêm com
 * a tabela `name` apagada, o que impede identificar a família e verificar a
 * licença de self-host (ver docs/reference/pendencias.md §1). Foram adotadas
 * equivalentes livres (SIL OFL), e o Google Fonts já entrega o recorte `latin`
 * subsetado — que cobre o português.
 *
 * Resultado: 3 arquivos, ~56 KB. O site antigo servia 12 arquivos e 1,6 MB.
 *
 * Uso: npm run fonts
 */

import { writeFile, mkdir } from "node:fs/promises";

const DESTINO = "public/fonts";

/** O user-agent decide o formato: este garante woff2. */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const FAMILIAS = [
  {
    css: "Playfair+Display:wght@400;700",
    arquivo: "playfair-display-latin.woff2",
    pesos: ["400 700"],
  },
  {
    css: "Poppins:wght@400",
    arquivo: "poppins-400-latin.woff2",
    pesos: ["400"],
  },
  {
    css: "Poppins:wght@700",
    arquivo: "poppins-700-latin.woff2",
    pesos: ["700"],
  },
];

/** Extrai a URL do bloco @font-face cujo unicode-range é o subset `latin`. */
function urlDoSubsetLatin(css) {
  const blocos = css.split("@font-face").slice(1);
  const latin = blocos.find((b) => b.includes("U+0000-00FF"));
  if (!latin)
    throw new Error(
      "Bloco do subset latin não encontrado no CSS do Google Fonts",
    );
  const url = latin.match(/url\((https:\/\/[^)]+\.woff2)\)/);
  if (!url) throw new Error("URL .woff2 não encontrada no bloco latin");
  return url[1];
}

await mkdir(DESTINO, { recursive: true });

let total = 0;
for (const familia of FAMILIAS) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${familia.css}&display=swap`;
  const css = await fetch(cssUrl, { headers: { "User-Agent": UA } }).then(
    (r) => {
      if (!r.ok) throw new Error(`Falha ao buscar ${cssUrl}: HTTP ${r.status}`);
      return r.text();
    },
  );

  const fonteUrl = urlDoSubsetLatin(css);
  const buffer = Buffer.from(
    await fetch(fonteUrl).then((r) => {
      if (!r.ok)
        throw new Error(`Falha ao baixar ${fonteUrl}: HTTP ${r.status}`);
      return r.arrayBuffer();
    }),
  );

  await writeFile(`${DESTINO}/${familia.arquivo}`, buffer);
  const kb = Math.round(buffer.length / 1024);
  total += kb;
  console.log(`✔ ${familia.arquivo.padEnd(30)} ${String(kb).padStart(3)} KB`);
}

console.log(
  `\nTotal: ${FAMILIAS.length} arquivos, ${total} KB (orçamento: 4 arquivos, 120 KB).`,
);
