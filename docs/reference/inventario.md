# Inventário do site atual

> Levantado do DOM renderizado em 2026-09-17. Site: `https://cuidahomecare.com/` (export do Canva).

## Estrutura técnica do site antigo

| Item                 | Valor                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| Canvas               | **1920 px de largura fixa**, 6485 px de altura                                                                |
| Container de rolagem | `div.ZRRuDw` — a página não rola pelo `window`                                                                |
| `meta viewport`      | Presente (`width=device-width`), mas sem efeito: o conteúdo é posicionado de forma absoluta num canvas rígido |
| Responsividade       | **Nenhuma**                                                                                                   |
| HTML de origem       | `<div id="root"></div>` vazio; tudo desenhado por JS                                                          |

## Blocos, em ordem

| #   | Bloco                        | Âncora no rebuild    | CTA / link                                    |
| --- | ---------------------------- | -------------------- | --------------------------------------------- |
| A   | Hero                         | `#inicio`            | "faça um orçamento" → WhatsApp principal      |
| B   | Trabalhe conosco             | `#trabalhe-conosco`  | → `forms.gle/6UT8xqQmGfVTc1Pv5` (nova aba)    |
| C   | Diferenciais (4 itens)       | `#diferenciais`      | —                                             |
| D   | Institucional                | `#sobre`             | —                                             |
| E   | Nossos serviços (4 cards)    | `#servicos`          | "Solicite uma visita" → WhatsApp principal    |
| F   | Como funciona? (3 passos)    | `#como-funciona`     | —                                             |
| G   | Por que a Cuida?             | `#por-que-a-cuida`   | —                                             |
| H   | Frase de destaque            | —                    | —                                             |
| I   | O que a Cuida faz? (5 itens) | `#o-que-a-cuida-faz` | —                                             |
| J   | fALE COM A CUIDA. / rodapé   | `#contato`           | Telefone, e-mail, Instagram, avaliação Google |

## Destino dos cards de "Nossos serviços"

**Nenhum dos 4 cards é link.** A seta `›` do site atual é decorativa: não há `href` nem
handler de navegação associado. Por isso, no rebuild os cards permanecem como conteúdo e a
seta foi removida — inventar destino violaria a FR10 (Story 1.6, AC4, ramo "sem destino").

## Links externos encontrados

| Destino                | URL                               | Onde                                                   |
| ---------------------- | --------------------------------- | ------------------------------------------------------ |
| WhatsApp principal     | `wa.me/5511995604988`             | Hero, "Solicite uma visita", "fALE COM A CUIDA"        |
| WhatsApp secundário    | `wa.me/5511915777784`             | Posição exata não determinada — ver `pendencias.md` §4 |
| Forms Trabalhe conosco | `forms.gle/6UT8xqQmGfVTc1Pv5`     | Bloco B                                                |
| Forms não identificado | `forms.gle/qqBkfBjv5uq4Qukv9`     | Ícone 64×64 sem texto — ver `pendencias.md` §3         |
| Instagram              | `instagram.com/cuidahomecare`     | Rodapé                                                 |
| E-mail                 | `contato.cuidahomecare@gmail.com` | Rodapé                                                 |
| Avaliação Google       | `share.google/2A5HTlqv7qSVXIpPY`  | Rodapé                                                 |

## Não existe formulário nativo

Confirmado: a página **não tem `<form>` nem campos de entrada**. Toda conversão é link
externo. O briefing original descrevia um formulário no hero — isso veio da imagem
`mockup-landing.png`, que é um **print de um mockup de landing page** usado como ilustração
no card "Contato Inicial", não do site em si.
