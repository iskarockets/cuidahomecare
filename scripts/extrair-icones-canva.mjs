import sharp from "sharp";
import { mkdirSync } from "node:fs";

const DIR = process.env.TEMP + "/canva-assets/";
const OUT = process.env.TEMP + "/icones-extraidos/";
mkdirSync(OUT, { recursive: true });

const arquivos = {
  pessoas: "300fcea0b987cbd9ec37f1ab6b85ef20",
  maos: "76dc9a3be71d1df3e91990f6e7fd72fd",
  escuta: "a0cbe01245d8535bb6c56f0db99e4ea1",
  estrelas: "8a5a376266ec9732d26a3ff3c28191d4",
};

for (const [nome, hash] of Object.entries(arquivos)) {
  const src = sharp(DIR + hash + ".png");
  const { width, height } = await src.metadata();
  const { data, info } = await src
    .clone()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const C = info.channels;

  // Colunas que contêm pixel claro (o branco é a forma do ícone)
  const colunaTemConteudo = new Array(width).fill(false);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * C] > 40) colunaTemConteudo[x] = true;
    }
  }

  // Agrupa colunas em segmentos, tolerando pequenos vãos
  const VAO = Math.round(width * 0.01);
  const segmentos = [];
  let inicio = null;
  let vazias = 0;
  for (let x = 0; x < width; x++) {
    if (colunaTemConteudo[x]) {
      if (inicio === null) inicio = x;
      vazias = 0;
    } else if (inicio !== null) {
      vazias++;
      if (vazias > VAO) {
        segmentos.push([inicio, x - vazias]);
        inicio = null;
      }
    }
  }
  if (inicio !== null) segmentos.push([inicio, width - 1]);

  const uteis = segmentos.filter(([a, b]) => b - a > width * 0.02);
  console.log(
    nome.padEnd(10),
    width + "x" + height,
    "→",
    uteis.length,
    "peça(s):",
    uteis.map(([a, b]) => `${a}-${b}`).join(" "),
  );

  for (let i = 0; i < uteis.length; i++) {
    const [a, b] = uteis[i];
    const w = b - a + 1;
    // Linhas com conteúdo dentro deste segmento
    let topo = height,
      base = 0;
    for (let y = 0; y < height; y++) {
      for (let x = a; x <= b; x++) {
        if (data[(y * width + x) * C] > 40) {
          if (y < topo) topo = y;
          if (y > base) base = y;
          break;
        }
      }
    }
    const h = base - topo + 1;
    // Grava o recorte AINDA EM TONS DE CINZA: a conversão para alfa acontece
    // no montar-icones.mjs, que precisa do valor de cinza preservado.
    await sharp(DIR + hash + ".png")
      .extract({ left: a, top: topo, width: w, height: h })
      .png()
      .toFile(`${OUT}${nome}-${i}.png`);
  }
}
console.log("saída em", OUT);
