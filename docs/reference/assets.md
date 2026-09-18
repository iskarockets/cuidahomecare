# Assets — origem e uso

## Imagens

Origem: enviadas pelo Lucas em 2026-09-17 (`Imagens site-20260917T185516Z-1-001`).
São os arquivos originais do Canva — **não são de resolução maior** que os servidos pelo
site (teto de 1285 px). Ver `pendencias.md` §5.

| Arquivo no projeto              | Original                | Dimensão | Onde é usado                                                                                                           |
| ------------------------------- | ----------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| `logo-cuida.png`                | Cuida Home Care (1).png | 585×198  | Hero, rodapé, 404                                                                                                      |
| `logo-cuida-alt.png`            | Cuida Home Care.png     | 528×219  | Reserva (não usado)                                                                                                    |
| `hero-cuidadora-idosa.png`      | Cuida Home Care1.png    | 840×1156 | **Hero (LCP)**                                                                                                         |
| `visita-acolhimento.png`        | Cuida Home Care5.png    | 655×655  | Como funciona, passo 2                                                                                                 |
| `inicio-atendimento.png`        | Cuida Home Care2.png    | 769×769  | Como funciona, passo 3                                                                                                 |
| `por-que-a-cuida.png`           | Cuida Home Care7.png    | 808×808  | Por que a Cuida (círculo)                                                                                              |
| `rodape-cuidadora-idosa.png`    | Cuida Home Care8.png    | 1285×928 | Rodapé                                                                                                                 |
| `mockup-landing.png`            | Cuida Home Care4.png    | 438×655  | Decorativa em "O que a Cuida faz?" (desktop). **Era a imagem do card "Contato Inicial"**, substituída por ícone (FR11) |
| `cuidados-essenciais.png`       | Cuida Home Care3.png    | 513×769  | Não usada — reserva                                                                                                    |
| `acompanhamento-hospitalar.png` | Cuida Home Care6.png    | 438×655  | Não usada — reserva                                                                                                    |

Todas passam pelo pipeline do `astro:assets` no build: WebP com larguras responsivas e
dimensões explícitas. Redução observada: 2,1 MB → 54 KB na imagem do hero.

## Ícones

| Arquivo                     | Origem                               | Uso                           |
| --------------------------- | ------------------------------------ | ----------------------------- |
| `icons/contato-inicial.svg` | Criado pela @ux-design-expert        | Card "Contato Inicial" (FR11) |
| Ícones dos diferenciais     | Criados no componente, line art 2 px | Bloco C                       |
| Ícones de contato           | Criados no componente                | Rodapé                        |

## Fontes

| Arquivo                                     | Origem                 | Observação                           |
| ------------------------------------------- | ---------------------- | ------------------------------------ |
| `public/fonts/playfair-display-latin.woff2` | Google Fonts (SIL OFL) | 38 KB — substitui a display do Canva |
| `public/fonts/poppins-400-latin.woff2`      | Google Fonts (SIL OFL) | 8 KB                                 |
| `public/fonts/poppins-700-latin.woff2`      | Google Fonts (SIL OFL) | 8 KB                                 |

As 12 fontes originais estão preservadas em `src/assets/fonts-originais/` (1,6 MB), baixadas
de `cuidahomecare.com/_assets/fonts/`. **Não são servidas** — ver `pendencias.md` §1.
