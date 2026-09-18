# QA Gate — Epic 1 (Stories 1.1 a 1.10)

**Revisor:** Quinn (@qa) · **Data:** 2026-09-17 · **Iterações:** 2

```yaml
epicId: EPIC-1
stories: [1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10]
verdict: PASS
verdictIteracao1: CONCERNS
```

> **Iteração 2 (após correção do @dev):** axe-core reexecutado na home e na 404 —
> **0 violações, 32 regras aprovadas** em cada página. Gate promovido de CONCERNS para
> **PASS**. O detalhamento da iteração 1 fica abaixo como registro.

---

## Verificações executadas

| #   | Check                          | Método                                                                                                     | Resultado                                                                       |
| --- | ------------------------------ | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1   | Build e gate de qualidade      | `npm test` (build + check-links + html-validate)                                                           | ✅ passa                                                                        |
| 2   | Zero JavaScript no cliente     | `find dist -name "*.js"` e contagem de `<script>`                                                          | ✅ **0 scripts, 0 KB**                                                          |
| 3   | Requisições no caminho crítico | Performance API no preview                                                                                 | ✅ **6** (teto: 6)                                                              |
| 4   | CLS                            | PerformanceObserver `layout-shift`                                                                         | ✅ **0**                                                                        |
| 5   | Peso total do site             | `du -sh dist/`                                                                                             | ✅ **730 KB** (era ~5 MB no Canva)                                              |
| 6   | Fontes                         | `du -ch dist/fonts/*.woff2`                                                                                | ✅ **3 arquivos, 56 KB** (teto: 4 / 120 KB)                                     |
| 7   | Hierarquia de headings         | Contagem e `heading-order` do axe                                                                          | ✅ 1×h1, 6×h2, 7×h3, sem pulo                                                   |
| 8   | Imagens sem `alt`              | grep no HTML gerado                                                                                        | ✅ **0**                                                                        |
| 9   | Tracking / cookies             | grep por gtag, GTM, fbq, analytics                                                                         | ✅ **nenhum**                                                                   |
| 10  | Links externos respondem       | `curl -L` nos 5 destinos                                                                                   | ✅ **todos 200**                                                                |
| 11  | Mensagem do WhatsApp           | inspeção da URL gerada                                                                                     | ✅ `Ol%C3%A1%20gostaria%20de%20um%20or%C3%A7amento.` — sem caractere corrompido |
| 12  | Canais não declarados          | `check-links.mjs`                                                                                          | ✅ nenhum host fora de `contatos.ts`                                            |
| 13  | Fidelidade da copy             | 20 frases-chave conferidas contra `docs/reference/copy.md`                                                 | ✅ **20/20**, inclusive os erros preservados do original                        |
| 14  | Acessibilidade automatizada    | axe-core 4.10 (`link-name`, `image-alt`, `heading-order`, `landmark`, `html-has-lang`, `region`, `aria-*`) | ✅ nenhuma violação                                                             |
| 15  | Contraste de cor               | axe-core `color-contrast`                                                                                  | ❌ **3 violações**                                                              |
| 16  | Rolagem horizontal             | iframes em 360, 390 e 768 px                                                                               | ✅ nenhuma                                                                      |
| 17  | CTA flutuante                  | `display` computado por breakpoint                                                                         | ✅ visível < 1024, oculto ≥ 1024                                                |
| 18  | Alvos de toque                 | altura computada dos CTAs                                                                                  | ✅ 48 px                                                                        |

**CodeRabbit:** não executado — não está habilitado em `core-config.yaml`. Revisão manual supre.

---

## 🔴 Issues que exigem correção

### QA-1 · Contraste insuficiente em 3 elementos (severity: HIGH)

Medido pelo axe-core, não estimado.

| Elemento                                         | Cores                     | Medido     | Exigido              |
| ------------------------------------------------ | ------------------------- | ---------- | -------------------- |
| `.hero__etiqueta` — "Cuidadores de idosos em SP" | `#353539` sobre `#AB93B1` | **4,38:1** | 4,5:1 (texto normal) |
| `<strong>` "mais do que amor" (hero)             | `#AB93B1` sobre `#FAF4E9` | **2,54:1** | 3:1 (texto grande)   |
| `<strong>` "antes" (institucional)               | `#AB93B1` sobre `#F1F1F0` | **2,46:1** | 3:1 (texto grande)   |

**Observação importante:** a spec estimou 4,72:1 para texto escuro sobre o lilás; o valor real
é **4,38:1**. A estimativa errou por arredondamento. O número do axe é o que vale.

**Correções recomendadas:**

1. Etiqueta: trocar o texto para `--cor-texto-forte` (`#222222`) → **5,7:1**.
2. Destaques em lilás sobre fundo claro: usar `--cor-roxo-acessivel` (`#7E7191`) → **4,14:1**,
   que passa com folga no critério de texto grande e fica na mesma família de cor.

Ambas cabem na FR2.1 (acessibilidade pode alterar o visual) e são de baixo impacto visual.

---

## 🟠 Pendências que não bloqueiam o gate, mas bloqueiam o go-live

| #   | Item                                                                                                                   | Responsável                      |
| --- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 1   | Story 1.1 ACs 9–11: repositório em `iskarockets`, vínculo com a Vercel do cliente, headers verificados no preview real | @devops (precisa de credenciais) |
| 2   | Story 1.2 AC1: conjunto formal de screenshots por bloco — o renderizador travou na captura em lote do site do Canva    | @dev / validação na 2.2          |
| 3   | Substituição das fontes por Playfair Display + Poppins                                                                 | Decisão do Lucas                 |
| 4   | Segundo Google Forms não identificado                                                                                  | Decisão do Lucas                 |
| 5   | Posição do WhatsApp secundário                                                                                         | Validação na 2.2                 |
| 6   | Erros de português do texto original                                                                                   | Decisão do Lucas                 |

---

## 🟢 Pontos fortes

- **O objetivo central do projeto está tecnicamente alcançado:** de ~3,4 MB de JavaScript e
  render no cliente para **zero JS e HTML pronto**, com 6 requisições e CLS 0.
- O gate `npm test` não é decorativo: durante a implementação ele pegou uma imagem sem `alt`
  e o `html-validate` pegou telefones que quebravam em duas linhas.
- A verificação de rolagem horizontal em iframe de 360 px encontrou um bug real (o e-mail do
  rodapé impedindo a coluna de encolher) que passaria despercebido numa inspeção visual.
- Nenhum canal de contato inventado: o `check-links.mjs` garante isso de forma automática.
- A copy foi preservada com fidelidade, inclusive os erros do original — o que é o
  comportamento correto, com os erros registrados para decisão.

---

## Correção aplicada (iteração 2)

O @dev corrigiu as 3 violações com dois tokens:

| Token                     | De        | Para      | Efeito                                  |
| ------------------------- | --------- | --------- | --------------------------------------- |
| `--texto-sobre-lilas`     | `#353539` | `#222222` | Etiqueta: 4,38:1 → **5,7:1**            |
| `--texto-destaque` (novo) | `#AB93B1` | `#7E7191` | Destaques: 2,54:1 e 2,46:1 → **4,14:1** |

### Reverificação

| Página | axe-core  | Resultado       |
| ------ | --------- | --------------- |
| Home   | 32 regras | **0 violações** |
| 404    | 32 regras | **0 violações** |

Conferência visual: o destaque "mais do que amor" ficou um tom mais fechado, praticamente
indistinguível do original em uso normal, e continua na família de cor da marca.

A 404 também foi validada: título próprio, `noindex, follow`, `h1` único e sem violações.

---

## Veredito final

**PASS** — o Epic 1 está aprovado do ponto de vista de qualidade técnica.

As pendências da seção anterior (deploy pelo @devops, screenshots formais, e as decisões do
Lucas sobre fontes, segundo Forms e erros de português) **não são defeitos de implementação**:
são dependências externas e decisões de produto, tratadas nas Stories 2.1 a 2.3.
