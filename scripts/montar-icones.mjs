/**
 * Monta os 4 ícones dos diferenciais a partir das peças extraídas do site atual.
 *
 * Contexto: o Canva serve os ícones como PNG em tons de cinza SEM canal alfa —
 * são máscaras (branco = forma, preto = vazio). Aqui o valor de cinza vira o
 * canal ALFA de uma imagem preta, produzindo um PNG com transparência real.
 * Nos componentes o ícone é usado como `mask-image`, o que permite pintá-lo
 * com a cor da marca.
 *
 * Cada arquivo do Canva traz o ícone duplicado lado a lado — ficamos com a
 * metade esquerda. O ícone de "Experiência real" é composto: anel de estrelas
 * + pessoa no centro.
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const IN = process.env.TEMP + "/icones-extraidos/";
const OUT = "src/assets/icons/";
const LADO = 256;
mkdirSync(OUT, { recursive: true });

/** Converte um recorte em tons de cinza num PNG preto com alfa = luminância. */
async function cinzaParaAlfa(entrada, lado = LADO) {
  const cinza = await sharp(entrada)
    .toColourspace("b-w")
    .resize(lado, lado, { fit: "contain", background: { r: 0, g: 0, b: 0 } })
    .raw()
    .toBuffer();

  return sharp({
    create: {
      width: lado,
      height: lado,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .joinChannel(cinza, { raw: { width: lado, height: lado, channels: 1 } })
    .png()
    .toBuffer();
}

/** Recorta a metade esquerda (uma das duas cópias do ícone). */
async function metadeEsquerda(arquivo) {
  const { width, height } = await sharp(IN + arquivo).metadata();
  return sharp(IN + arquivo)
    .extract({ left: 0, top: 0, width: Math.floor(width / 2), height })
    .toBuffer();
}

for (const [origem, saida] of [
  ["pessoas-0.png", "dif-equipe.png"],
  ["maos-0.png", "dif-apoio.png"],
  ["escuta-0.png", "dif-escuta.png"],
]) {
  const recorte = await metadeEsquerda(origem);
  const png = await cinzaParaAlfa(recorte);
  await sharp(png).toFile(OUT + saida);
  console.log("✔", saida);
}

// Experiência real: anel de estrelas com círculo cheio + pessoa VAZADA no centro.
// No site a pessoa é um recorte no círculo, por isso `dest-out` (subtrai alfa).
{
  const anel = await cinzaParaAlfa(await metadeEsquerda("estrelas-0.png"));
  const PESSOA = 84;
  const pessoa = await cinzaParaAlfa(IN + "estrelas-2.png", PESSOA);
  await sharp(anel)
    .composite([
      {
        input: pessoa,
        top: Math.round((LADO - PESSOA) / 2),
        left: Math.round((LADO - PESSOA) / 2),
        blend: "dest-out",
      },
    ])
    .png()
    .toFile(OUT + "dif-experiencia.png");
  console.log("✔ dif-experiencia.png");
}
