# Cuida Home Care — Arquitetura Técnica

> **Base:** `docs/prd.md` v1.1 · **Autor:** Aria (@architect) · **Data:** 2026-09-17
> **Escopo deste documento:** stack, estrutura do repositório, pipelines de build, configuração de entrega e quality gates. O layout mobile é responsabilidade do @ux-design-expert e não é decidido aqui.

---

## 1. Restrições que governam todas as decisões

Tudo abaixo existe para servir a estas restrições do PRD. Em qualquer dúvida futura, elas desempatam.

| #   | Restrição                                                            | Origem       |
| --- | -------------------------------------------------------------------- | ------------ |
| R1  | PageSpeed mobile ≥ 90, FCP e LCP < 1,5s, TBT < 100 ms, CLS < 0,1     | NFR1         |
| R2  | HTML entregue pronto pelo servidor, sem depender de JS para aparecer | NFR2         |
| R3  | Mobile responsivo de 360 a 1920 px                                   | NFR7         |
| R4  | Desktop fiel ao site atual, sem redesign                             | FR2          |
| R5  | Zero integração de dados: toda conversão é link externo              | FR4          |
| R6  | Sem tracking e sem cookies                                           | FR16         |
| R7  | Deploy na Vercel do cliente; repositório no GitHub `iskarockets`     | NFR10, NFR11 |
| R8  | Página única + 404                                                   | FR1, FR15    |

**Consequência central:** este site **não tem estado, não tem sessão, não tem dados do usuário e não tem interatividade** além de rolagem com âncoras e links externos. A quantidade ideal de JavaScript no cliente é **zero bytes**. Toda a arquitetura decorre disso.

---

## 2. Decisões de arquitetura (ADRs)

### ADR-001 — Framework: Astro (build estático), com Next.js como alternativa aceita

**Decisão:** **Astro**, com saída 100% estática.

**Contexto:** o Lucas liberou Next.js e deixou o "como" em aberto, exigindo só o resultado (90+ e responsivo). Avaliei três caminhos:

| Opção                                    | JS entregue ao cliente                                                           | Componentização                                | Risco contra R1                                |
| ---------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| **Astro**                                | **0 KB por padrão**                                                              | Sim (`.astro`)                                 | Baixo                                          |
| Next.js (App Router, `output: 'export'`) | Runtime React + payload RSC, na casa das dezenas de KB, mesmo sem interatividade | Sim                                            | Médio: exige vigilância para não hidratar nada |
| HTML + CSS puro                          | 0 KB                                                                             | Não: 10 blocos viram um arquivo só, repetitivo | Baixo, mas custo de manutenção alto            |

**Motivo da escolha:** Astro é o único que entrega **as duas coisas ao mesmo tempo** — zero JS por padrão (R2, R1) e componentes de verdade para os 10 blocos (§2 do PRD). Em Next.js, o caminho feliz é enviar React para uma página que não usa React para nada; dá para chegar a 90+, mas o esforço vira "conter o framework" em vez de construir o site. Aqui não existe nenhuma necessidade que justifique esse peso: sem formulário, sem estado, sem rotas dinâmicas.

**Consequências:**

- O preset ativo do AIOS (`nextjs-react`) **não se aplica a este projeto**. Exceção registrada aqui, conforme §5.4 do PRD.
- Se o Lucas preferir Next.js por familiaridade, a troca é viável e a estrutura das §3 a §6 continua quase idêntica. A condição é inegociável: `output: 'export'`, nenhum componente `'use client'` e o mesmo orçamento de performance da §7.
- Componentes de UI prontos (shadcn e similares) ficam fora: pressupõem React e contrariam R4, já que o alvo visual é o site atual.

### ADR-002 — Estilos: CSS nativo com custom properties, sem framework

**Decisão:** CSS escrito à mão, com tokens em `:root` e estilos com escopo por componente Astro.

**Motivo:** o alvo é **reproduzir um layout existente pixel a pixel** (R4), com valores extraídos do site no ar. Utilitários como Tailwind ajudam quando se está criando um design; aqui eles viram uma camada de tradução entre o valor medido e o valor aplicado. CSS direto encurta esse caminho e mantém o bundle mínimo. O Astro já isola o CSS por componente e inlina folhas pequenas.

**Consequências:** disciplina de tokens é obrigatória (`src/styles/tokens.css`), para o mobile não virar um amontoado de valores mágicos.

### ADR-003 — Fontes: subset local em `.woff2`, self-hosted

**Decisão:** baixar as 12 fontes do site atual, identificar as famílias realmente usadas, gerar subsets `latin` + `latin-ext` em `.woff2` e servir do próprio domínio.

**Motivo:** as fontes são hoje mais de 1,5 MB e estão entre as duas maiores causas da nota 56. Subset resolve a maior parte disso. Self-hosted evita conexão com terceiro no caminho crítico do LCP.

**Consequências:** `preload` **apenas** na fonte do H1/hero, `font-display: swap` em todas, e o pipeline precisa ser reproduzível (§5.1). Fontes que a auditoria mostrar sem uso real **não são portadas**: as 12 são o que o Canva serviu, não necessariamente o que o design usa.

### ADR-004 — Imagens: processadas em build com `astro:assets`

**Decisão:** originais em `src/assets/`, entregues via `<Image>`/`<Picture>` do Astro, gerando AVIF e WebP com largura e altura explícitas.

**Motivo:** o Astro usa sharp em tempo de build, então a otimização é reproduzível, versionada e não depende de serviço de imagem em runtime (o que também mantém a saída puramente estática).

**Consequências:** as imagens atuais (placeholder autorizado, NFR13) entram pelo mesmo caminho das definitivas. Se as originais chegarem, trocar o arquivo em `src/assets/` basta.

### ADR-005 — Entrega: estático na Vercel, com headers e cache no `vercel.json`

**Decisão:** saída estática publicada na conta Vercel do cliente, sem funções serverless, sem middleware e sem runtime.

**Motivo:** não existe nada para executar no servidor (R5). Cada peça de runtime que não existe é uma classe inteira de falha e de custo que desaparece.

**Consequências:** o `vercel.json` é o único ponto de configuração de entrega (§6). Redirecionamento `www` → apex é feito na configuração de domínios da Vercel.

---

## 3. Stack final

| Camada             | Escolha                                                                      | Observação                   |
| ------------------ | ---------------------------------------------------------------------------- | ---------------------------- |
| Framework          | **Astro 5.x**, `output: 'static'`                                            | Zero JS por padrão           |
| Linguagem          | TypeScript nas partes com lógica (dados, scripts) e `.astro` nos componentes | `astro check` como typecheck |
| Estilos            | CSS nativo + custom properties                                               | Sem framework de CSS         |
| Imagens            | `astro:assets` (sharp) → AVIF/WebP                                           | Larguras responsivas         |
| Fontes             | `.woff2` com subset, self-hosted                                             | Script próprio, §5.1         |
| Runtime            | **Nenhum.** Zero JS no cliente                                               | Orçamento: 0 KB              |
| Hospedagem         | Vercel (conta do cliente), estático em CDN                                   | Sem funções                  |
| Repositório        | GitHub `iskarockets`                                                         | NFR11                        |
| Node / gerenciador | Node 20 LTS ou superior, npm                                                 | Alinhado ao AIOS             |

**O que deliberadamente não entra:** React, Tailwind, biblioteca de componentes, gerenciador de estado, analytics, banner de cookies, CMS, service worker e qualquer dependência que exija JS no cliente. Se alguma dessas voltar à mesa, precisa de justificativa contra R1 e R2.

---

## 4. Estrutura do repositório

```
lpcuidahomecare/
├─ src/
│  ├─ pages/
│  │  ├─ index.astro              # página única: compõe os blocos A–J
│  │  └─ 404.astro                # FR15
│  ├─ layouts/
│  │  └─ BaseLayout.astro         # <head>, SEO, preload de fonte, semântica
│  ├─ components/
│  │  ├─ sections/                # um componente por bloco do PRD §2
│  │  │  ├─ Hero.astro                    # A  (Story 1.4)
│  │  │  ├─ TrabalheConosco.astro         # B  (Story 1.5)
│  │  │  ├─ Diferenciais.astro            # C  (Story 1.5)
│  │  │  ├─ Institucional.astro           # D  (Story 1.5)
│  │  │  ├─ NossosServicos.astro          # E  (Story 1.6)
│  │  │  ├─ ComoFunciona.astro            # F  (Story 1.7)
│  │  │  ├─ PorQueACuida.astro            # G  (Story 1.7)
│  │  │  ├─ FraseDestaque.astro           # H  (Story 1.7)
│  │  │  ├─ OQueACuidaFaz.astro           # I  (Story 1.8)
│  │  │  └─ FaleComACuida.astro           # J  (Story 1.9)
│  │  └─ ui/
│  │     ├─ CtaWhatsApp.astro     # único lugar que monta link + mensagem
│  │     ├─ CardServico.astro
│  │     └─ Icone.astro
│  ├─ data/
│  │  ├─ contatos.ts              # fonte única de canais (FR9, FR10)
│  │  └─ conteudo.ts              # textos longos, se convier tirar do markup
│  ├─ styles/
│  │  ├─ tokens.css               # cores, tipografia, espaçamentos, breakpoints
│  │  ├─ base.css                 # reset, tipografia base, mobile-first
│  │  └─ utils.css                # container, grid, visually-hidden
│  └─ assets/                     # originais das imagens (entram no pipeline)
├─ public/
│  ├─ fonts/                      # .woff2 já subsetados (saída do script)
│  ├─ robots.txt                  # FR14
│  ├─ llms.txt                    # FR12
│  ├─ llms-full.txt               # FR13
│  └─ favicon.svg
├─ scripts/
│  ├─ subset-fonts.mjs            # §5.1
│  └─ check-links.mjs             # §7.3
├─ docs/
│  ├─ prd.md
│  ├─ architecture.md             # este documento
│  ├─ requisitos-tecnicos-fixos.md# Apêndice A do PRD, colado (NFR14)
│  └─ reference/                  # saída da Story 1.2
│     ├─ screenshots/             # desktop 1280 e 1920, por bloco
│     ├─ copy.md                  # texto integral
│     ├─ inventario.md            # blocos, âncoras, CTAs
│     └─ fontes-e-cores.md        # famílias, pesos, paleta
├─ astro.config.mjs
├─ vercel.json
├─ package.json
├─ tsconfig.json
└─ README.md
```

**Três regras de estrutura que valem como contrato:**

1. **Um componente por bloco do PRD.** O mapeamento acima é intencional: cada story do Epic 1 toca um conjunto previsível de arquivos, o que evita conflito entre stories paralelas.
2. **`src/data/contatos.ts` é a única fonte de contatos.** Nenhum número, link ou mensagem de WhatsApp escrito direto no markup. É o que torna verificável a regra "só os canais que já existem" (FR10) e garante que a mensagem corrigida (FR5) não volte quebrada em algum lugar esquecido.
3. **`docs/reference/` é o alvo de fidelidade.** Não é material de apoio: é o critério de aceite do desktop (Story 2.2).

### Exemplo de `src/data/contatos.ts`

```ts
// Fonte única de verdade. Alterar aqui exige aval do Lucas (FR10).
export const WHATSAPP_PRINCIPAL = "5511995604988";
export const WHATSAPP_SECUNDARIO = "5511915777784";
export const MENSAGEM_ORCAMENTO = "Olá gostaria de um orçamento."; // sem caractere corrompido (FR5)

export const contatos = {
  whatsappOrcamento: `https://wa.me/${WHATSAPP_PRINCIPAL}?text=${encodeURIComponent(MENSAGEM_ORCAMENTO)}`,
  whatsappSecundario: `https://wa.me/${WHATSAPP_SECUNDARIO}`,
  trabalheConosco: "https://forms.gle/6UT8xqQmGfVTc1Pv5",
  email: "contato.cuidahomecare@gmail.com",
  instagram: "https://www.instagram.com/cuidahomecare",
  avaliacaoGoogle: "https://share.google/2A5HTlqv7qSVXIpPY",
  telefoneExibido: "(11) 99560-4988",
} as const;
```

`encodeURIComponent` no lugar de string pronta é o que impede a reintrodução do `%EF%BF%BD`.

---

## 5. Pipelines de build

### 5.1 Fontes (`npm run fonts`)

1. Coloque os `.woff` baixados do site atual em `src/assets/fonts-originais/` (saída da Story 1.2).
2. `scripts/subset-fonts.mjs` usa o pacote **`subset-font`** (harfbuzz em JS, sem dependência de Python) para gerar `.woff2` em `public/fonts/`, com o intervalo `latin` + `latin-ext`.
3. O script imprime uma tabela de antes e depois (arquivo, KB original, KB final), que vai anexada à Story 1.3 como evidência.
4. Fonte sem uso confirmado no site **não é gerada**. O script falha se receber um arquivo que não está na lista declarada.

Declaração de uso em `src/styles/tokens.css`, com `@font-face` explícito. Só a família do H1/hero recebe `<link rel="preload">` no `BaseLayout.astro`.

### 5.2 Imagens

Sem script próprio: `astro:assets` cuida em tempo de build.

- `<Image>` para imagem única, `<Picture>` quando precisar de AVIF + WebP + fallback.
- `widths` declarados conforme os breakpoints (360, 390, 768, 1280, 1920).
- `loading="eager"` e `fetchpriority="high"` **apenas** na imagem do LCP no hero; todo o resto é `loading="lazy"`.
- `width` e `height` sempre presentes: é o que segura o CLS em 0.

### 5.3 CSS crítico

`astro.config.mjs` com `build.inlineStylesheets: 'always'`. Com CSS por componente e sem framework, o total fica pequeno o bastante para ser inlinado por inteiro, o que elimina uma ida ao servidor no caminho crítico. Se o total passar de **15 KB comprimidos**, reavaliar e passar para `'auto'`.

---

## 6. Entrega (`vercel.json`)

```jsonc
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin",
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload",
        },
      ],
    },
    {
      "source": "/_astro/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      "source": "/fonts/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
}
```

Notas:

- O padrão `/(.*) ` cobre **todas as rotas**, inclusive a 404, como exige a NFR9. A conferência é por `curl -I` numa rota inexistente (Story 1.1).
- Assets com hash no nome recebem `immutable`; o HTML **não** recebe, para que uma republicação apareça na hora.
- **`www` → apex** é configurado em Domains, no projeto da Vercel, e não aqui. `cuidahomecare.com` fica como domínio principal e `www.cuidahomecare.com` como redirect 308.
- `preload` no HSTS só deve ficar se o Lucas confirmar que quer submeter o domínio à lista de preload. Na dúvida, remover essa diretiva e manter o resto.

---

## 7. Orçamento de performance e quality gates

### 7.1 Orçamento (falhar aqui é falhar a NFR1)

| Recurso                        | Teto                       | Racional                                 |
| ------------------------------ | -------------------------- | ---------------------------------------- |
| JS no cliente                  | **0 KB**                   | Não há nada para executar                |
| CSS total (inlinado)           | 15 KB comprimido           | Acima disso, o inline deixa de compensar |
| HTML da home                   | 60 KB comprimido           | Sinaliza markup inchado                  |
| Fontes                         | 4 arquivos, 120 KB somados | 12 fontes hoje, acima de 1,5 MB          |
| Imagem do LCP                  | 150 KB                     | Principal alavanca do LCP                |
| Requisições no caminho crítico | ≤ 6                        | HTML + 1 fonte + imagem do LCP           |

### 7.2 Mapeamento dos quality gates do AIOS

| Comando AIOS        | Neste projeto                                             | O que valida                              |
| ------------------- | --------------------------------------------------------- | ----------------------------------------- |
| `npm run lint`      | `prettier --check .` + `eslint` com `eslint-plugin-astro` | Formatação e erros óbvios                 |
| `npm run typecheck` | `astro check`                                             | Tipos em `.astro` e `.ts`                 |
| `npm test`          | `npm run build` + `check-links` + validação de HTML       | Build íntegro, links vivos, markup válido |

Motivo de amarrar `npm test` ao build: neste projeto não existe lógica de domínio para testar com unitários. O que quebra de verdade é link morto, HTML inválido e regressão de performance. Testar isso vale mais do que perseguir cobertura artificial.

### 7.3 `scripts/check-links.mjs`

Roda sobre a saída de `dist/` e falha se:

- algum `href` interno apontar para âncora inexistente;
- algum link externo não estiver na lista de `src/data/contatos.ts` (barreira contra canal inventado, FR10);
- algum `wa.me` contiver caractere fora do ASCII imprimível na querystring (barreira contra a regressão do FR5);
- alguma imagem informativa estiver sem `alt`.

### 7.4 Performance

Lighthouse é rodado manualmente contra a URL de preview nas Stories 2.1 e 2.3, com os relatórios versionados em `docs/reference/lighthouse/`. Não vale a pena montar CI de performance para um site de uma página com duas medições formais no ciclo inteiro.

---

## 8. Fluxo de trabalho no repositório

- Branch `main` protegida e sempre publicável. Cada story abre `story/1.4-hero` e afins.
- Cada push em branch gera **preview automático na Vercel**, que é o ambiente de validação de todas as stories.
- `git push` e PR são **exclusivos do @devops** (regra de autoridade do AIOS). @dev commita localmente.
- `main` só é promovida a produção depois do aceite da Story 2.2.

---

## 9. Riscos e pontos de atenção

| Risco                                                                             | Impacto                                 | Mitigação                                                                                               |
| --------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| As fontes do Canva têm nomes ofuscados e podem não ser licenciadas para self-host | Alto: pode exigir troca por equivalente | Story 1.2 identifica as famílias. Se houver dúvida de licença, escalar ao Lucas antes de portar         |
| Imagens atuais em baixa resolução (máx. 1285 px) no hero em tela cheia            | Médio: hero borrado em telas grandes    | Placeholder autorizado (NFR13). O `<Picture>` limita a largura máxima para não ampliar além do original |
| "Fidelidade ao desktop" sem medida objetiva vira discussão                        | Médio: retrabalho na Story 2.2          | As screenshots da Story 1.2 são o critério, e a comparação é bloco a bloco                              |
| Segundo Google Forms (`qqBkfBjv5uq4Qukv9`) não localizado                         | Baixo                                   | FR8 trata. Se não aparecer na interface, não é portado sem decisão do Lucas                             |
| Tentação de adicionar JS "só para um detalhe"                                     | Alto contra R1                          | O orçamento de 0 KB é gate. Qualquer exceção passa por decisão registrada aqui                          |

---

## 10. Próximos passos

1. **@ux-design-expert:** desenhar o mobile (360–768 px) dos 10 blocos, sobre os tokens da §4. O desktop não muda.
2. **@sm:** criar as stories do Epic 1. A Story 1.1 já pode usar a estrutura da §4 e o `vercel.json` da §6.
3. **@devops:** criar o repositório em `iskarockets` e ligar ao projeto na Vercel do cliente.
4. **Decisão pendente do Lucas:** manter `preload` na diretiva HSTS (§6).
