# QA Gate — Validação pré-deploy

**Revisor:** Quinn (@qa) · **Data:** 2026-09-18 · **Escopo:** estado atual do site, após os ajustes visuais de 17/09

```yaml
escopo: pre-deploy
verdict: PASS_COM_RESSALVAS
bloqueadores: 0
corrigidos_nesta_rodada: 2
pendencias_externas: 4
```

---

## 1. Resultado das medições

| Categoria      | Desktop | Mobile  |
| -------------- | ------- | ------- |
| Performance    | **100** | **94**  |
| Acessibilidade | **100** | **100** |
| Boas práticas  | **100** | **100** |
| SEO            | **100** | **100** |

| Métrica    | Desktop | Mobile | Meta    | Situação  |
| ---------- | ------- | ------ | ------- | --------- |
| FCP        | 0,3 s   | 1,0 s  | < 1,5 s | ✅        |
| LCP        | 0,5 s   | 2,1 s  | < 1,5 s | ⚠️ ver §3 |
| CLS        | 0,006   | 0,001  | < 0,1   | ✅        |
| JavaScript | 0 KB    | 0 KB   | 0       | ✅        |
| Peso total | 326 KB  | 303 KB | —       | ✅        |

Comparação com o site atual: **56** de performance, ~10 s de FCP/LCP, ~3,4 MB de JS.

## 2. Verificações executadas

| #   | Verificação                          | Método                                                   | Resultado                                                    |
| --- | ------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------ |
| 1   | Gate de build                        | `npm test` (build + check-links + html-validate)         | ✅ passa                                                     |
| 2   | Zero JavaScript                      | `find dist -name "*.js"`                                 | ✅ 0 arquivos                                                |
| 3   | Acessibilidade em 360, 768 e 1500 px | axe-core 4.10, página inteira                            | ✅ **0 violações** (35/36/37 regras)                         |
| 4   | Acessibilidade da 404                | axe-core                                                 | ✅ 0 violações                                               |
| 5   | Rolagem horizontal                   | 3 larguras                                               | ✅ nenhuma                                                   |
| 6   | Erros de console                     | leitura do console em carga limpa                        | ✅ nenhum                                                    |
| 7   | Links externos                       | grep no HTML + `curl -L`                                 | ✅ 5 destinos, todos declarados em `contatos.ts`             |
| 8   | Mensagem do WhatsApp                 | inspeção da URL                                          | ✅ `Ol%C3%A1%20gostaria%20de%20um%20or%C3%A7amento.` — limpa |
| 9   | Canal não declarado                  | `check-links.mjs`                                        | ✅ nenhum                                                    |
| 10  | 404                                  | título, `noindex, follow`, `h1` único                    | ✅                                                           |
| 11  | SEO on-page                          | `title` 54 chars, `description` 157, canonical, robots   | ✅                                                           |
| 12  | Navegação Agêntica                   | `llms.txt`, `llms-full.txt`, `robots.txt`, `sitemap.xml` | ✅ presentes                                                 |
| 13  | Headers no `vercel.json`             | leitura da configuração                                  | ✅ 3 headers em `/(.*)`, cache em `/_astro/*` e `/fonts/*`   |
| 14  | Scripts do `package.json`            | verificação de existência dos arquivos                   | ❌ → corrigido (§4)                                          |

**CodeRabbit:** não executado — não está habilitado em `core-config.yaml`.

---

## 3. ⚠️ LCP de 2,1 s no mobile — acima da meta, mas medida local não conclui

O detalhamento do próprio Lighthouse mostra onde o tempo é gasto:

```
TTFB          471 ms
Load Delay      0 ms
Load Time      11 ms   ← a imagem baixa em 11 ms
Render Delay 1509 ms   ← todo o custo está aqui
```

A imagem do hero (49 KB) chega praticamente instantânea. O tempo é **render delay**, ou seja,
style e layout — e já está demonstrado que esse número está inflado pelo ambiente local: um
teste de controle na página 404, com **9 elementos e nenhuma imagem**, devolveu 756 ms de
styleLayout e 90 ms de TBT nesta mesma máquina. Uma página desse tamanho não pode custar isso.

**Conclusão:** não dá para aprovar nem reprovar a meta de LCP com medição local. A medição
que vale é o **PageSpeed sobre a URL de preview da Vercel**, na infraestrutura do Google, com
CDN no lugar de um servidor local. Isso é a Story 2.1, AC1, e depende do deploy.

**Se lá o LCP ainda passar de 1,5 s**, a próxima alavanca é dar `preload` com
`imagesrcset` à imagem do hero. Não foi aplicado agora porque otimizar contra uma medição
ruidosa é otimizar contra ruído.

---

## 4. Defeitos encontrados e corrigidos nesta validação

### QA-2 · `npm run fonts` apontava para um arquivo inexistente (HIGH)

`package.json` declarava `"fonts": "node scripts/subset-fonts.mjs"`, e esse arquivo **nunca
existiu** — o pipeline de fontes mudou para equivalentes livres do Google Fonts e o script
original ficou pelo caminho. O comando quebrava, e as Stories 1.3 (ACs 2, 3 e 6) descreviam
um pipeline que não estava lá.

**Corrigido:** criado `scripts/baixar-fontes.mjs`, que busca o CSS do Google Fonts, extrai a
URL do subset `latin` de cada família e grava os três `.woff2` em `public/fonts/`. Testado:
regenera os 3 arquivos, 54 KB no total.

### QA-3 · CTA flutuante fora de landmark (MEDIUM)

O botão de WhatsApp era filho direto do `<body>`, fora de `header`, `main` ou `footer`. A
regra `region` do axe reprovava em 360 px e 768 px — some no desktop só porque lá o botão
fica oculto. Usuários de leitor de tela navegando por regiões perderiam o elemento.

**Corrigido:** envolvido em `<aside aria-label="Contato rápido">`.

**Reverificação:** axe reexecutado nas três larguras → **0 violações**, e o número de regras
aprovadas subiu de 34/35/31 para 35/36/37.

---

## 5. Pendências que não bloqueiam o build, mas devem ser resolvidas

### 5.1 ✅ RESOLVIDA — rastreabilidade do PRD

Investigado e encerrado em 18/09, ainda nesta validação:

- **FR6 revogada.** O WhatsApp secundário aparece 6 vezes no blob de dados do site atual, sempre
  com a mesma mensagem do número principal, mas **não existe na interface** — a página não
  renderiza um único `<a>`, e nem o Lucas nem a auditoria o encontraram. Mesmo padrão do
  "formulário do hero" que o briefing inventou a partir de uma imagem. Critério aplicado: o que
  não está visível no site atual não entra no novo. Código morto removido de `contatos.ts`.
- **FR11 revogada.** O print do card "Contato Inicial" foi mantido; o ícone proposto foi
  reprovado pelo Lucas.

PRD atualizado para a v1.3, com as duas revogações no Change Log. Evidência completa em
`docs/reference/pendencias.md` §4.

### 5.1b (registro original) Os dois requisitos estavam desatualizados

Decisões do Lucas em 17/09 mudaram o comportamento, mas os requisitos não foram atualizados.
Quem revisar o projeto depois vai encontrar implementação divergindo do PRD:

| Requisito | O que diz                                                                         | O que está no site                                                                           |
| --------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **FR6**   | "O WhatsApp secundário continua publicado, nos mesmos pontos em que aparece hoje" | O número `5511915777784` **não aparece em lugar nenhum** (confirmado: 0 ocorrências no HTML) |
| **FR11**  | "O print do card Contato Inicial é trocado por um ícone limpo"                    | O print foi **mantido**, recortado em quadrado                                               |

**Ação:** @pm atualiza FR6 e FR11. Além disso, o WhatsApp secundário existe no site atual —
removê-lo é perder um canal. O certo é descobrir onde ele aparece hoje e reposicionar.

### 5.2 🟠 Código morto

`contatos.whatsappSecundario` continua declarado em `src/data/contatos.ts` e não é usado por
nenhum componente. Mantê-lo é razoável enquanto a decisão de 5.1 estiver aberta, mas precisa
de resolução — não de esquecimento.

### 5.3 🟡 Peso do repositório

| Pasta                        | Tamanho | Observação                                                           |
| ---------------------------- | ------- | -------------------------------------------------------------------- |
| `src/assets/`                | 13 MB   | PNGs originais + 1,6 MB das 12 fontes do Canva, que não são servidas |
| `docs/reference/lighthouse/` | 3,5 MB  | relatórios JSON completos                                            |

Nada disso vai para o `dist/` (963 KB), então **não afeta o site**. Afeta o clone do
repositório. Sugestão: manter só o `RELATORIO.md` e um JSON de cada plataforma, e avaliar se
as fontes originais do Canva precisam ficar versionadas.

### 5.4 🟡 Arquivos sem uso

- `src/assets/acompanhamento-hospitalar.png`
- `src/assets/logo-cuida-alt.png`
- `src/assets/icons/contato-inicial.svg` — o ícone descartado pelo Lucas

### 5.5 🟡 Logo em PNG sendo ampliado

O logo tem 585 px de largura e é exibido a 680 px no hero (ampliação de 1,16×). Além disso,
duas variantes dele somam 48 KB no carregamento mobile. Um **SVG** resolveria nitidez e peso
de uma vez. O logo em vetor já estava na lista de itens pedidos ao cliente.

### 5.6 🟡 Foto do mosaico ainda ampliada 1,41×

O recorte novo (509 × 288) tem o enquadramento certo, mas a célula exibe 720 px de largura.
Continua valendo a escolha registrada: ou um recorte de 1440 × 810 saído do original em alta,
ou reduzir o mosaico para 1018 px e ficar pixel a pixel.

---

## 6. O que ainda depende de terceiros

| #   | Item                                                           | Responsável           |
| --- | -------------------------------------------------------------- | --------------------- |
| 1   | Repositório em `iskarockets` + vínculo com a Vercel do cliente | @devops (credenciais) |
| 2   | PageSpeed no preview real — a medição que fecha a Story 2.1    | @devops → @qa         |
| 3   | Confirmação da substituição das fontes (Playfair + Poppins)    | Lucas                 |
| 4   | Identificação do segundo Google Forms (`qqBkfBjv5uq4Qukv9`)    | Lucas                 |

---

## 7. Veredito

**PASS com ressalvas.** Não há bloqueador técnico para o deploy: build íntegro, zero JS, zero
violações de acessibilidade em três larguras, sem erro de console, links válidos, SEO e
Navegação Agêntica completos, e 100 em três das quatro categorias no mobile.

As ressalvas são de **rastreabilidade e de medição**, não de funcionamento:

1. O PRD precisa refletir as duas decisões de 17/09 (§5.1) — senão o próximo revisor encontra
   o código contradizendo o requisito.
2. A meta de LCP no mobile só pode ser julgada no preview da Vercel (§3).
3. O WhatsApp secundário sumiu do site. É o único item da lista que representa **perda de
   função** em relação ao site atual, e vale decidir antes de publicar.
