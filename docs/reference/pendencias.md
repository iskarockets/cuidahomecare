# Pendências e decisões abertas

> Levantadas durante a implementação do Epic 1, em 2026-09-17.
> Nenhuma bloqueia o build; todas precisam de decisão antes do go-live.

---

## 1. 🔴 Fontes — substituição por equivalentes livres

**Situação:** as 12 fontes `.woff` servidas pelo site do Canva têm a tabela `name`
**apagada** (família = `"."`). Não é possível identificar a fonte nem verificar se a
licença permite self-host em outro domínio.

**O que foi feito:** adotados equivalentes livres (SIL OFL), escolhidos por semelhança
visual e já aplicados em `src/styles/tokens.css`:

| Papel            | Substituto           | Observação                                    |
| ---------------- | -------------------- | --------------------------------------------- |
| Display serifada | **Playfair Display** | Comparação visual com o hero: muito próxima   |
| Sans             | **Poppins**          | Geométrica, compatível com os rótulos do site |

**Ganho colateral:** 12 arquivos / 1,6 MB → **3 arquivos / 56 KB**.

**Decisão do Lucas:** confirmar a substituição, ou informar o nome real das fontes
(pode estar no Brand Kit do Canva) para avaliarmos licença. A troca custa uma linha.

---

## 2. 🟠 Erros de português no texto original

O texto do site tem erros que foram **preservados** por estarem fora de escopo:

| Onde              | Original                     | Correto seria         |
| ----------------- | ---------------------------- | --------------------- |
| Hero              | `apoio á familia`            | `apoio à família`     |
| O que a Cuida faz | `precisa de além do cuidado` | frase incompleta      |
| O que a Cuida faz | `Acompanhamento á consultas` | `a consultas`         |
| O que a Cuida faz | `Cuidado Essenciais`         | `Cuidados Essenciais` |
| O que a Cuida faz | termina com `;`              | `.`                   |

**Decisão do Lucas:** manter como está (fidelidade) ou autorizar a correção. São erros
visíveis para quem lê com atenção, num serviço que vende cuidado e atenção.

---

## 3. 🟠 Segundo Google Forms não identificado

`https://forms.gle/qqBkfBjv5uq4Qukv9` existe no código do site atual, ligado a um ícone
de 64×64 **sem texto ao redor**. Não foi possível localizar na interface a que ele
corresponde. **Não foi implementado** — implementar sem saber o destino violaria a FR10.

**Decisão do Lucas:** identificar o que é esse link, ou confirmar que pode ficar de fora.

---

## 4. ✅ ENCERRADA — WhatsApp secundário não é publicado (18/09)

**Investigação feita em 18/09, a pedido do Lucas:**

| Evidência                                  | Resultado                                                                |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| Ocorrências no blob de dados do site atual | **6** (contra 35 do número principal)                                    |
| Mensagem associada                         | a mesma do principal: "Olá gostaria de um orçamento."                    |
| Elementos `<a>` renderizados na página     | **0** — o Canva liga tudo por JS                                         |
| Elementos com cursor de clique             | nenhum enumerável pelo DOM                                               |
| Localizado na interface pelo Lucas         | não                                                                      |
| Localizado na auditoria                    | não                                                                      |
| Origem no nosso escopo                     | o briefing do @secretaria, §4.2, que o listou como "WhatsApp secundário" |

**Conclusão:** estar no código-fonte **não prova** estar publicado. É o mesmo padrão do
"formulário do hero" que o briefing descreveu e que nunca existiu na página — dado presente no
arquivo, ausente na tela. O segundo Google Forms (§3) é um terceiro caso idêntico.

**Decisão do Lucas:** o que não está visível no site atual não entra no novo. O número **não é
publicado**. `WHATSAPP_SECUNDARIO` e `telefoneSecundarioExibido` foram removidos de
`src/data/contatos.ts`, e a FR6 do PRD foi revogada (v1.3).

**Se o cliente confirmar** que o número é dele e deve aparecer, é só reintroduzir — a decisão
fica registrada aqui com a evidência que a sustentou.

---

## 4b. Histórico — remoção do rodapé (17/09)

`wa.me/5511915777784` existe no código do site atual, mas a captura não determinou em que
ponto da página ele aparece. Tinha sido publicado como uma 5ª linha na lista de contatos do
rodapé, e o Lucas pediu para retirar, deixando o rodapé no mesmo formato do site atual
(telefone, e-mail, Instagram, avaliação Google).

⚠️ **Consequência:** esse número **não aparece mais em lugar nenhum** do site novo. Se ele
estiver publicado em algum ponto do site atual, precisa ser reposicionado — não apenas
removido. Vale confirmar na Story 2.2.

---

## 5. 🟡 Resolução das imagens

As imagens enviadas pelo cliente em 17/09 **não são maiores** que as servidas pelo site:
o maior arquivo tem 1285 px de largura. Para hero em tela cheia a 1920 px isso é pouco.

**O que foi feito:** a imagem nunca é ampliada além do original; o hero usa um layout de
duas colunas em que a foto ocupa ~45% da largura, o que mantém a nitidez.

**Decisão do Lucas:** aceitar assim, ou providenciar fotos em resolução maior.

---

## 5b. ✅ Ícone do "Contato Inicial" — proposta descartada pelo Lucas (17/09)

A proposta de substituir o print por um ícone de balão com coração foi **reprovada**. Decisão:
manter a imagem do site atual (o print do mockup), recortada em **quadrado e alinhada pelo
topo** — corta só a parte de baixo.

O SVG criado (`src/assets/icons/contato-inicial.svg`) ficou no repositório, sem uso.

**Efeito sobre a FR11 do PRD:** a troca do print por ícone deixa de valer. O @pm precisa
atualizar a FR11 para refletir a decisão.

---

## 5c. ✅ Ícones dos diferenciais — agora são os originais do site

Os ícones tinham sido desenhados do zero. Foram substituídos pelos **ícones reais do site**,
extraídos dos assets do Canva: o Canva os serve como PNG em tons de cinza sem canal alfa
(máscaras), e os scripts `extrair-icones-canva.mjs` + `montar-icones.mjs` convertem o cinza em
transparência. No CSS entram como `mask-image`, o que permite pintá-los na cor da marca.

O ícone de "Experiência real" é composto: anel de estrelas com a silhueta da pessoa vazada no
centro, igual ao original.

---

## 6. 🟡 Fidelidade do desktop ainda não validada contra screenshots

O rebuild foi construído a partir da captura do DOM, das cores e tipografia medidas, e de
capturas parciais do site no ar. **A comparação formal bloco a bloco acontece na Story 2.2**,
com o Lucas. Diferenças de espaçamento e proporção podem aparecer e serão ajustadas lá.

---

## 7. 🟢 HSTS com `preload`

O `vercel.json` aplica `Strict-Transport-Security` **sem** a diretiva `preload`, porque
submeter o domínio à lista de preload é difícil de reverter.

**Decisão do Lucas:** manter assim (recomendado) ou incluir `preload`.
