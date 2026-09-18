# Epic 1 — Registro de implementação

**Executor:** Dex (@dev) · **Data:** 2026-09-17 · **Stories:** 1.1 a 1.10
**Modelo:** Claude Opus 5 (1M context)

---

## Resultado

| Métrica             | Site antigo (Canva)       | Rebuild                            | Status                                         |
| ------------------- | ------------------------- | ---------------------------------- | ---------------------------------------------- |
| JavaScript entregue | ~3,4 MB                   | **0 KB**                           | ✅ verificado (`find dist -name "*.js"` vazio) |
| HTML da home        | vazio (render no cliente) | 8,5 KB comprimido                  | ✅ dentro do teto de 60 KB                     |
| Fontes              | 12 arquivos, 1,6 MB       | **3 arquivos, 56 KB**              | ✅ dentro do teto de 120 KB                    |
| Imagem do hero      | 2,1 MB (PNG)              | **54 KB** (WebP)                   | ✅ dentro do teto de 150 KB                    |
| Responsividade      | nenhuma                   | 360–1920 px sem rolagem horizontal | ✅ verificado em 360, 390 e 768                |
| Páginas             | 1                         | 2 (home + 404)                     | ✅                                             |

Gate `npm test` (build + check-links + html-validate): **passa**.

---

## Por story

### 1.1 — Setup do repositório e canário

Projeto Astro 5 com saída estática, `inlineStylesheets: 'always'`, `vercel.json` com os três
headers de segurança em `/(.*)` e cache `immutable` em `/_astro/*` e `/fonts/*`.
`scripts/check-links.mjs` implementado com as 4 verificações da arquitetura §7.3.
`.gitignore` recomposto a partir do template base do AIOS mais as pastas do Astro.

⚠️ **ACs 9, 10 e 11 pendentes:** criação do repositório em `iskarockets`, vínculo com a Vercel
do cliente e verificação de headers no preview real dependem de credenciais e são do @devops.
Tudo o que é local está feito e verificado.

### 1.2 — Captura da referência

Feito: inventário dos 10 blocos, copy integral, paleta, tipografia medida, mapeamento dos
links externos, download das 12 fontes originais e das 10 imagens enviadas pelo cliente.

⚠️ **AC1 parcial:** o conjunto formal de screenshots por bloco em 1280 e 1920 não foi
concluído — o site do Canva travou o renderizador durante a captura em lote. Foram obtidas
capturas parciais suficientes para orientar a implementação. A comparação formal acontece
na Story 2.2, com o Lucas.

**Descoberta relevante:** o "formulário do hero" descrito no briefing original nunca existiu
no site. A confusão veio da imagem `mockup-landing.png` — um print de mockup de landing page
usado como ilustração no card "Contato Inicial", que por acaso mostra um formulário.

### 1.3 — Base visual

Tokens da @ux-design-expert em uso sem alteração de valores. `base.css` com reset,
tipografia fluida e container responsivo.

⚠️ **Substituição de fontes** (ver `docs/reference/pendencias.md` §1): as 12 fontes do Canva
têm a tabela `name` apagada, o que impede identificar a família e verificar licença de
self-host. Adotados **Playfair Display** e **Poppins** (SIL OFL), escolhidos por semelhança
visual. A comparação no preview mostrou que a Playfair reproduz de perto a serifada original.

### 1.4 a 1.9 — Blocos A a J

Dez componentes de seção, um por bloco, mais `CtaWhatsApp`, `FabWhatsApp` e o rodapé.
Todo link vem de `src/data/contatos.ts`; nenhum escrito no markup.

**Correções de estrutura feitas após conferir o site no ar:**

- "Trabalhe conosco!" é uma **pílula no topo da página**, não uma seção — corrigido.
- A frase de abertura se repete numa **faixa lilás logo abaixo do hero** — componente
  `FraseBanner.astro` criado para isso.
- Os CTAs aparecem em **caixa alta** no original (via CSS) — aplicado `text-transform`.

**Cards de "Nossos serviços" não são links:** confirmado no DOM que a seta `›` é decorativa e
não há destino. Conforme o AC4 condicional, os cards ficaram como conteúdo e a seta foi
removida — inventar destino violaria a FR10.

### 1.10 — SEO, Navegação Agêntica e 404

`<title>` com 54 caracteres, `meta description` com 157, canonical no apex, `theme-color`,
`lang="pt-BR"`, um único `h1`. `llms.txt`, `llms-full.txt`, `robots.txt` (com os crawlers de
IA liberados), `sitemap.xml` e página 404 com `noindex`.

---

## Terceira correção de contraste, encontrada na implementação

A spec de mobile identificou duas combinações reprovadas. Durante a implementação apareceu
uma terceira, calculada a partir das cores medidas:

| Combinação                     | Antes         | Depois                   |
| ------------------------------ | ------------- | ------------------------ |
| Branco sobre o lilás `#AB93B1` | **2,59:1** ❌ | 4,72:1 ✅ (texto escuro) |

Afeta a etiqueta "Cuidadores de idosos em SP" e a faixa lilás abaixo do hero. É a mudança
visual mais perceptível do projeto, e está autorizada pela FR2.1. **Vale confirmação do Lucas
na Story 2.2.**

---

## Correções de bug feitas durante a implementação

1. **Rolagem horizontal em 360 px:** o e-mail do rodapé, por ser uma palavra longa e
   inquebrável, impedia a coluna de encolher. Resolvido com `min-width: 0` e
   `overflow-wrap: anywhere`. Detectado pela verificação em iframe de 360 px.
2. **Telefone quebrando em duas linhas:** números passaram a usar espaço e hífen
   inseparáveis. Detectado pelo `html-validate`.
3. **Falso positivo no `check-links`:** o Astro serializa `alt=""` como atributo booleano;
   o script foi ajustado para aceitar as duas formas.

---

## Arquivos criados

```
package.json · astro.config.mjs · tsconfig.json · vercel.json · .gitignore
.htmlvalidate.json · README.md
scripts/check-links.mjs
src/layouts/BaseLayout.astro
src/pages/index.astro · src/pages/404.astro
src/styles/tokens.css (fontes adicionadas) · src/styles/base.css
src/data/contatos.ts
src/components/ui/CtaWhatsApp.astro · FabWhatsApp.astro
src/components/sections/  Hero · TrabalheConosco · FraseBanner · Diferenciais ·
                          Institucional · NossosServicos · ComoFunciona · PorQueACuida ·
                          FraseDestaque · OQueACuidaFaz · FaleComACuida
src/assets/  10 imagens + icons/contato-inicial.svg + fonts-originais/ (12 .woff)
public/  fonts/ (3 .woff2) · robots.txt · llms.txt · llms-full.txt · sitemap.xml
docs/requisitos-tecnicos-fixos.md
docs/reference/  copy.md · inventario.md · assets.md · fontes-e-cores.md · pendencias.md
```

---

## O que fica para o @qa

1. Conferir a copy contra `docs/reference/copy.md`, incluindo os erros preservados do original.
2. Validar acessibilidade: contrastes, `alt`, foco, hierarquia de headings.
3. Validar o comportamento do CTA flutuante e dos links externos.
4. Conferir se alguma decisão em `docs/reference/pendencias.md` deveria ter bloqueado a entrega.
