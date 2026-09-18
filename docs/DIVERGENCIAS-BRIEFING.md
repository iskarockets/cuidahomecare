# Divergências entre o briefing e o site real — Cuida Home Care

**Briefing analisado:** `briefing-dev-cuidahomecare-performance-2026-09-17.md` (Trizz / @secretaria)
**Verificação:** inspeção do DOM renderizado de `https://cuidahomecare.com/` em 2026-09-17
**Quem verificou:** @pm e @dev, durante PRD e implementação

> **Como cada item foi verificado:** o site é um export do Canva e entrega HTML vazio
> (`<div id="root"></div>`). Nada aqui veio de screenshot ou de leitura do HTML de origem —
> tudo foi extraído do **DOM já renderizado no navegador**, que é a única fonte confiável.

---

## Resumo

| Gravidade                             | Qtd | Efeito                                                         |
| ------------------------------------- | --- | -------------------------------------------------------------- |
| 🔴 Alta — mudaria o escopo do projeto | 2   | Seção inteira de requisitos criada para algo inexistente       |
| 🟠 Média — escopo subdimensionado     | 2   | 3 seções previstas contra 10 reais; canais de contato faltando |
| 🟡 Baixa — omissão                    | 3   | Detalhes que só apareceram na implementação                    |

**Causa raiz provável:** boa parte dos erros se explica por uma única confusão — uma **imagem
dentro do site foi lida como se fosse o site**. Detalhe no item 1.

---

## 🔴 1. O formulário do hero não existe

|                    |                                                                                                                                                                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **O briefing diz** | "O hero tem um **formulário** (Nome, Telefone, Quem precisa de cuidados, Cidade, Enviar). **Os leads vão pra um Google Forms**" — §4.1, com duas estratégias de implementação, mapeamento de `entry.NNNNN`, fallback e teste de ponta a ponta |
| **A realidade**    | A página **não tem nenhum `<form>` nem campo de entrada**. Zero. Toda conversão é link externo, principalmente WhatsApp                                                                                                                       |
| **Como sabemos**   | `document.querySelectorAll('form')` e `querySelectorAll('input,select,textarea')` retornam vazio no DOM renderizado                                                                                                                           |

**De onde veio o erro:** entre as imagens do site existe a `Cuida Home Care4.png` — um **print
de um mockup de landing page**, usado como ilustração dentro do card "Contato Inicial". Esse
mockup mostra um formulário com exatamente os campos descritos no briefing: Nome, Telefone,
Quem precisa de cuidados, Cidade, Enviar. O briefing descreveu a imagem como se fosse a página.

O mesmo mockup também contém a tagline "Cuida porque entende. Cuida como família." e a frase
"Quando cuidar de quem você ama exige mais do que amor, a Cuida entende." — ambas atribuídas
ao hero pelo briefing. E contém **contatos diferentes dos reais** (`contato@cuidacuida.com`,
`(11) 98785 4921`), que felizmente não foram para o briefing.

**Custo se não tivesse sido pego:** uma seção inteira de requisitos (§4.1) sobre integração com
Google Forms, mapeamento de campos, fallback e teste de submissão — trabalho para um formulário
que não existe. E o risco maior: o dev poderia **criar** um formulário do zero, achando que
estava reproduzindo o site.

---

## 🔴 2. O Google Forms citado é de recrutamento, não de leads

|                    |                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------- |
| **O briefing diz** | "Os leads vão pra um Google Forms: `https://forms.gle/6UT8xqQmGfVTc1Pv5`" — §4.1              |
| **A realidade**    | Esse link é o **"Trabalhe conosco!"**. É candidatura a vaga, não captação de cliente          |
| **Como sabemos**   | No blob de dados da página, o texto imediatamente anterior ao link é `"Trabalhe conosco! \n"` |

**Por que importa:** os dois públicos são opostos. Tratar o formulário de vaga como canal de
lead levaria a dar a ele o peso visual de CTA principal — atrapalhando a conversão de quem
procura cuidado e enchendo o Forms de recrutamento com pedido de orçamento.

---

## 🟠 3. O site tem 10 blocos, o briefing mapeou 3

|                    |                                                                                                                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **O briefing diz** | "Seções conhecidas: Hero com logo + tagline + headline + 4 diferenciais + formulário; seção 'Como funciona?' com 3 cards. **Confirmar o resto contra o site no ar**" — §2                      |
| **A realidade**    | 10 blocos: Hero · Trabalhe conosco · Diferenciais · Institucional · **Nossos serviços** · Como funciona · **Por que a Cuida?** · Frase de destaque · **O que a Cuida faz?** · Fale com a Cuida |

O briefing foi honesto ao marcar a lista como incompleta. Ainda assim, **a estimativa ficou a
um terço do real**, e blocos importantes ficaram de fora — inclusive "Nossos serviços", que
lista os 4 serviços da empresa, e "O que a Cuida faz?", com 5 itens de texto denso.

---

## 🔴 3b. O domínio TEM e-mail — o briefing afirma que não

|                    |                                                                                                                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **O briefing diz** | "✅ **SEM e-mail no domínio** (confirmado pelo Lucas em 17/09). Por isso o apontamento total é seguro: **não há MX pra preservar**. Este é o caso em que se pode trocar nameservers sem risco" — §6 |
| **A realidade**    | O domínio tem **MX ativo do Google Workspace**: `1 smtp.google.com`, mais o TXT de verificação do Google                                                                                            |
| **Como sabemos**   | Consulta DNS pública em 18/09 (DNS-over-HTTPS do Google), registros MX e TXT                                                                                                                        |

**Custo se não tivesse sido pego:** o briefing instruía a apontar os nameservers inteiros para a
Vercel. Isso descarta a zona DNS atual junto com o MX — **o e-mail corporativo do cliente
pararia de funcionar**. E pararia de um jeito traiçoeiro: o site estaria no ar, bonito e rápido,
enquanto os e-mails simplesmente sumiriam, sem erro visível.

Era precisamente o desastre que o briefing declarava impossível, e com a justificativa
invertida: "não há MX para preservar" quando havia.

**Plano corrigido:** manter a zona onde está e alterar só os registros `A` e `www`. O MX não é
tocado. Detalhes em `docs/guias/dns-cutover.md`.

---

## 🟠 4. Faltaram canais de contato publicados

|                    |                                                                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **O briefing diz** | Só os dois WhatsApp. "Não há e-mail no domínio. Não inventar nem acrescentar canal que não esteja publicado hoje" — §4.2                      |
| **A realidade**    | A página também publica **e-mail** (`contato.cuidahomecare@gmail.com`), **Instagram** (`@cuidahomecare`) e um link de **avaliação no Google** |

A afirmação sobre o domínio está **correta** — não há e-mail _no domínio_, e por isso o
apontamento total de DNS continua seguro. O problema é outro: a página publica um Gmail como
canal de contato, e isso não foi registrado.

**Custo se não tivesse sido pego:** o site novo sairia com menos canais que o atual. Em um
negócio que vive de contato, é perda direta.

---

## 🟡 5. Um segundo Google Forms não foi mencionado

Existe no site um segundo link: `https://forms.gle/qqBkfBjv5uq4Qukv9`, ligado a um ícone de
64×64 **sem texto ao redor**. Não conseguimos identificar a que ele corresponde na interface.

**Não foi implementado** — reproduzir um link sem saber o destino seria inventar
comportamento. Está registrado como pendência para o cliente esclarecer.

---

## 🟡 6. As fontes não são identificáveis nem licenciáveis

|                    |                                                                                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **O briefing diz** | "Identificar cada família **visualmente** contra o site no ar" e reservir como `.woff2` com subset — §3                                                          |
| **A realidade**    | Os 12 arquivos vêm com a tabela `name` **apagada** (família = `"."`). Não dá para identificar a fonte nem verificar se a licença permite servir de outro domínio |

O briefing tratou como tarefa simples ("identificar visualmente"), mas o problema é de
**licenciamento, não de identificação**: mesmo acertando a família no olho, reservir um arquivo
de fonte cuja licença não conhecemos é risco jurídico para o cliente.

**Como foi resolvido:** substituídos por equivalentes livres (Playfair Display + Poppins, SIL OFL),
pendente de confirmação. Ganho colateral: 1,6 MB → 56 KB.

---

## 🟡 7. As imagens "em alta" não são maiores

|                    |                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **O briefing diz** | "Solicitado ao cliente: logo em vetor/alta e fotos originais. Se chegarem, trocar" — §5                                                    |
| **A realidade**    | As imagens entregues pelo cliente têm o **mesmo teto de 1285 px** das que o site já serve. Não são versões maiores, são os mesmos arquivos |

A premissa de "se chegarem as originais, o problema de resolução se resolve" não se confirmou.
O hero foi projetado para não ampliar a imagem além do tamanho real.

---

## O que o briefing acertou

Para ser justo, o diagnóstico técnico central estava **correto e bem feito**:

- A causa da nota 56 (render no cliente, bundle de 2,65 MB do Canva) — confirmada.
- A conclusão de que não há otimização incremental possível e o rebuild é o único caminho — correta.
- O mobile sem responsividade — confirmado: canvas fixo de 1920 px.
- O caractere corrompido na mensagem do WhatsApp — confirmado e corrigido.
- O card "Contato Inicial" usando um print ilegível — confirmado e corrigido.
- A ausência de e-mail **no domínio**, liberando o apontamento total de DNS — correta.
- A seção de requisitos técnicos fixos — aproveitada integralmente.

O erro não foi de análise técnica. Foi de **verificação de conteúdo**: descrever a página a
partir de uma imagem dentro dela, em vez do DOM renderizado.

---

## Recomendação para o próximo briefing

Uma regra simples teria evitado os itens 1, 2, 3 e 4:

> Em site client-rendered, extrair o inventário do **DOM renderizado**, não da leitura visual:
> `document.querySelectorAll('form, input, a[href]')` e a lista de URLs do documento.
> Imagem dentro da página **não é** conteúdo da página.
