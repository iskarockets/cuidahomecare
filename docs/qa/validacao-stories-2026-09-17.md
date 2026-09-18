# Validação de Stories — Epic 1 e Epic 2

**Validador:** Pax (@po) · **Data:** 2026-09-17 · **Escopo:** 13 stories (1.1–1.10, 2.1–2.3)
**Base de verificação:** `docs/prd.md` v1.1, `docs/architecture.md`, `docs/front-end-spec-mobile.md`

---

## Resultado por story

| Story                               | Template | Executor | Fontes | ACs testáveis | Sequência      | Veredito            |
| ----------------------------------- | -------- | -------- | ------ | ------------- | -------------- | ------------------- |
| 1.1 Setup e canário                 | ✅       | ⚠️ misto | ✅     | ✅            | ✅             | **GO com correção** |
| 1.2 Captura da referência           | ✅       | ✅       | ✅     | ✅            | ✅             | **GO com nota**     |
| 1.3 Base visual                     | ✅       | ✅       | ✅     | ✅            | ✅             | **GO**              |
| 1.4 Hero                            | ✅       | ✅       | ✅     | ✅            | ✅             | **GO**              |
| 1.5 Trabalhe conosco + diferenciais | ✅       | ✅       | ✅     | ✅            | ✅             | **GO**              |
| 1.6 Nossos serviços                 | ✅       | ✅       | ✅     | ❌ conflito   | ✅             | **NO-GO**           |
| 1.7 Como funciona                   | ✅       | ✅       | ✅     | ✅            | ✅             | **GO**              |
| 1.8 O que a Cuida faz               | ✅       | ✅       | ✅     | ✅            | ✅             | **GO**              |
| 1.9 Fale com a Cuida + FAB          | ✅       | ✅       | ✅     | ✅            | ✅             | **GO**              |
| 1.10 SEO e Navegação Agêntica       | ✅       | ✅       | ✅     | ✅            | ✅             | **GO**              |
| 2.1 Performance e a11y              | ✅       | ✅       | ✅     | ✅            | ⚠️ dependência | **GO com nota**     |
| 2.2 Validação e aceite              | ✅       | ✅       | ✅     | ✅            | ✅             | **GO**              |
| 2.3 Cutover DNS                     | ✅       | ✅       | ✅     | ✅            | ✅             | **GO**              |

**Placar: 12 GO · 1 NO-GO.**

---

## Achados que exigem correção antes do desenvolvimento

### 🔴 P1 — Story 1.6: AC4 conflita com as Dev Notes

O AC4 exige que "todo o card seja área tocável", mas as Dev Notes mandam verificar se os cards levam a algum lugar hoje e, se não levarem, **não** transformá-los em link. Um dev seguindo o AC criaria link para lugar nenhum; seguindo as notas, descumpriria o AC.

**Correção:** tornar o AC condicional ao inventário da Story 1.2.

### 🟠 P2 — Falta story para o gate de qualidade `npm test`

`docs/architecture.md` §7.2 e §7.3 definem `npm test` como build + `check-links` + validação de HTML, e especificam o `scripts/check-links.mjs` com quatro verificações (âncora inexistente, link externo fora de `contatos.ts`, caractere não-ASCII em `wa.me`, imagem sem `alt`). **Nenhuma das 13 stories implementa esse script.** Sem ele, o gate que impede a regressão do caractere corrompido e a invenção de canal simplesmente não existe.

**Correção:** incluir na Story 1.1 como AC e task.

### 🟠 P2 — Story 1.1: falta `.gitignore`

Nenhum AC cobre `.gitignore`. Sem ele, `node_modules/` e `dist/` entram no repositório da ISKR no primeiro commit.

**Correção:** incluir na Story 1.1.

### 🟡 P3 — Story 1.2: risco de critério de fidelidade falso

O AC1 pede screenshots em 1280 **e** 1920. Como o site atual tem canvas fixo de 1920 px, a captura em 1280 é a mesma composição recortada, não um layout diferente. Se isso não estiver explícito, o dev pode tratar o recorte como alvo de fidelidade em 1280 e tentar reproduzir um corte que não é decisão de design.

**Correção:** nota nas Dev Notes dizendo que o alvo de fidelidade é 1920 e que de 1024 a 1920 o layout escala proporcionalmente.

### 🟡 P3 — Story 1.1: executores misturados

ACs 1 a 8 são do @dev; ACs 9 a 11 dependem de credenciais e são do @devops. A story marca isso, mas o campo `executor` aceita um valor só. Aceitável nesta escala; se travar, dividir em 1.1a (local) e 1.1b (remoto).

### 🟡 P3 — Story 2.1 depende de deploy remoto

As medições exigem URL de preview, que depende da Story 1.1 AC10 (@devops). A dependência não está declarada na 2.1.

---

## Ação fora das stories

### 📌 @pm — atualizar a FR2 do PRD

O Lucas aprovou em 17/09 a regra: **fidelidade ao desktop cede quando o motivo é acessibilidade ou performance; mudança por gosto continua proibida.** As Stories 1.3, 1.6, 1.7 e 2.2 já dependem dessa regra, mas a FR2 do PRD ainda diz apenas "nenhum redesign por iniciativa própria". Sem a atualização, um revisor futuro pode tratar as correções de contraste como violação de escopo.

---

## Verificação anti-alucinação

Conferi as afirmações técnicas das Dev Notes contra as fontes:

| Afirmação nas stories                              | Fonte                           | Confere? |
| -------------------------------------------------- | ------------------------------- | -------- |
| Canvas de 1920 × 6485, container `.ZRRuDw`         | Medição no DOM, 17/09           | ✅       |
| Paleta e escala tipográfica                        | `src/styles/tokens.css`, medido | ✅       |
| `forms.gle/6UT8...` é "Trabalhe conosco", não lead | PRD §10, inspeção do DOM        | ✅       |
| Contrastes 3,19:1 / 2,20:1 e correções             | `front-end-spec-mobile.md` §6   | ✅       |
| Verde `#25D366` reprova com 2,02:1                 | `front-end-spec-mobile.md` §7   | ✅       |
| Erros de português no texto original               | Captura da copy, 17/09          | ✅       |
| Orçamento de performance                           | `architecture.md` §7.1          | ✅       |
| Ícone entregue em `src/assets/icons/`              | Arquivo existe                  | ✅       |

Nenhuma invenção encontrada. Todo número citado nas stories tem origem rastreável.

---

## Decisão

**GO condicionado**, com as correções P1 e P2 aplicadas antes do início do desenvolvimento. A P1 é bloqueante para a Story 1.6; as P2 são bloqueantes para a Story 1.1.

Correções aplicadas em 17/09 logo após esta validação — ver o Change Log de cada story.
