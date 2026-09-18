# Cuida Home Care — site estático

Rebuild de performance do site `https://cuidahomecare.com/`, hoje publicado pelo Canva.
Serviço prestado pela **ISKR**.

| Antes (Canva)               | Meta                          |
| --------------------------- | ----------------------------- |
| PageSpeed mobile **56**     | **90+**                       |
| FCP / LCP ~10s              | **< 1,5s**                    |
| ~3,4 MB de JS               | **0 KB**                      |
| 12 fontes `.woff`, > 1,5 MB | 4 arquivos `.woff2`, ≤ 120 KB |
| Sem responsividade          | 360 a 1920 px                 |

## Stack

**Astro** com saída 100% estática, **zero JavaScript no cliente**, CSS nativo com custom properties.
Sem React, sem Tailwind, sem runtime no servidor. O porquê está em `docs/architecture.md` (ADR-001).

## Requisitos

- Node.js 20 ou superior
- npm

## Como rodar

```bash
npm install     # instala dependências
npm run dev     # servidor de desenvolvimento em http://localhost:4321
npm run build   # gera dist/
npm run preview # serve o dist/ localmente
```

## Qualidade

```bash
npm run lint       # formatação (prettier)
npm run typecheck  # tipos (astro check)
npm test           # build + check-links + validação de HTML
```

`npm test` é o gate real do projeto. Ele falha quando encontra:

- âncora interna apontando para id inexistente;
- link externo que não está em `src/data/contatos.ts` (nenhum canal inventado);
- caractere corrompido na mensagem do WhatsApp;
- imagem sem `alt`.

## Fontes

```bash
npm run fonts   # gera public/fonts/*.woff2 a partir de src/assets/fonts-originais/
```

## Publicação

Deploy na **conta Vercel do cliente** — nunca na conta pessoal. O repositório vive no GitHub
da **ISKR** (`iskarockets`). Operações remotas (push, PR, deploy, DNS) são do @devops.

## Documentação

| Arquivo                             | Conteúdo                                                      |
| ----------------------------------- | ------------------------------------------------------------- |
| `docs/prd.md`                       | Requisitos, inventário real do site e escopo                  |
| `docs/architecture.md`              | Stack, estrutura, pipelines, orçamento de performance         |
| `docs/front-end-spec-mobile.md`     | Layout mobile, tokens, acessibilidade                         |
| `docs/requisitos-tecnicos-fixos.md` | Padrão fixo de LP (SEO, performance, agêntica, a11y, headers) |
| `docs/stories/`                     | Stories de desenvolvimento                                    |
| `docs/reference/`                   | Captura do site antigo: screenshots, copy, assets             |

## Regra de escopo

O desktop é **fidelidade ao site atual**: não redesenhar por iniciativa própria.
A exceção, aprovada pelo cliente, é mudança necessária por **acessibilidade ou performance** —
permitida e obrigatoriamente registrada na story (PRD FR2.1).
