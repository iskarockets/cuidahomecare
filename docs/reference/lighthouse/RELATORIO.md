# Relatório de performance — medição local

**Data:** 2026-09-17 · **Ambiente:** `astro preview` em localhost, Chrome headless, máquina Windows do Lucas
**Ferramenta:** Lighthouse 12 · **Arquivos brutos:** `desktop-final.json`, `mobile-final.json`

---

## Resultado

| Categoria | Desktop | Mobile |
|---|---|---|
| **Performance** | **100** | 80–88 (ver ressalva) |
| **Acessibilidade** | **100** | **100** |
| **Boas práticas** | **100** | **100** |
| **SEO** | **100** | **100** |

| Métrica | Desktop | Mobile | Meta |
|---|---|---|---|
| FCP | 0,3 s | 1,3 s | < 1,5 s ✅ |
| LCP | 0,4 s | 1,7–1,9 s | < 1,5 s ⚠️ |
| CLS | 0,014 | 0,004 | < 0,1 ✅ |
| Peso total | — | 172 KB | — |
| JavaScript | **0 KB** | **0 KB** | 0 ✅ |

Comparação com o site atual: **56** de performance, ~10 s de FCP/LCP, ~3,4 MB de JS.

---

## ⚠️ Ressalva importante sobre a nota mobile

A nota de performance mobile oscilou entre **80 e 88 em execuções idênticas**, com métricas
praticamente iguais. O TBT reportado (480–680 ms) **não pode vir da página**: ela não tem
uma única linha de JavaScript.

**Teste de controle:** rodei o Lighthouse mobile contra a página 404, que tem **9 elementos**
no DOM e nenhuma imagem. Resultado: **756 ms de styleLayout e 90 ms de TBT**. Uma página desse
tamanho não pode exigir isso — o custo é do ambiente (Chrome headless com throttling de CPU 4×,
numa máquina de trabalho compartilhando processador), não do site.

**Conclusão:** a medição local vale como indicador, não como aprovação. A medição que conta é
o **PageSpeed sobre a URL de preview da Vercel** (Story 2.1, AC1), que roda na infraestrutura
do Google. Lá, sem a distorção de CPU local e com CDN no lugar de um servidor local, a
expectativa é confortavelmente acima de 90 — a página entrega 172 KB no total e zero JS.

---

## Otimizações aplicadas durante a medição

| Achado | Ação |
|---|---|
| `text-wrap: balance` em todos os títulos e `pretty` em todos os parágrafos | Restringido ao `h1` — faz várias passadas de layout por elemento |
| Logo servido em 400 px para exibição em 180 px (18 KB) | `widths` e `sizes` ajustados ao tamanho real |
| **Erro no console:** `favicon.svg` 404 | Favicon criado com a marca (casa + sol). Boas práticas: 96 → **100** |

---

## O que ainda pode render pontos no mobile

1. **LCP em 1,7–1,9 s:** a imagem do hero é o elemento de LCP. Um `preload` com
   `imagesrcset` correspondente ao `srcset` do `<img>` deve cortar parte do Render Delay.
   Não foi aplicado para não arriscar um download duplicado sem poder medir o efeito real.
2. **18 KB de "imagem superdimensionada"** no hero: o recorte 4:5 no mobile com DPR alto
   puxa a variante de 840 px. Reduzir exigiria uma imagem-fonte maior, que não existe.

Ambos só valem a pena mexer **depois** de medir no preview da Vercel — otimizar contra uma
medição ruidosa é otimizar contra ruído.
