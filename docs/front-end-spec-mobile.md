# Cuida Home Care — Especificação de Responsividade Mobile

> **Base:** `docs/prd.md` v1.1 · `docs/architecture.md` · **Autora:** Uma (@ux-design-expert) · **Data:** 2026-09-17
> **Origem dos valores:** medição direta do site no ar (estilos computados e capturas em 2026-09-17). Nada aqui foi estimado no olho.
> **Escopo:** o mobile (≤ 1023 px). O desktop (≥ 1024 px) é fidelidade ao atual e não é redesenhado (FR2).

---

## 1. Diagnóstico medido: por que o mobile não existe hoje

| Medição                      | Resultado                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| Largura do canvas da página  | **1920 px fixos**, em qualquer viewport                                              |
| Altura total                 | 6485 px                                                                              |
| `meta viewport`              | `width=device-width, initial-scale=1` — presente                                     |
| Reflow ao estreitar a janela | **Nenhum.** Os elementos são posicionados de forma absoluta dentro do canvas de 1920 |

O `meta viewport` está lá, mas não adianta: o conteúdo mora num canvas rígido de 1920 px. No celular, o navegador precisa escolher entre encolher tudo até virar ilegível ou deixar a página rolar para os lados. É por isso que o mobile "não existe" — não é um bug de ajuste fino, é ausência de layout fluido.

**Consequência para o rebuild:** o mobile não é adaptação do desktop. É layout novo, escrito primeiro, com o desktop como camada que entra a partir de 1024 px.

---

## 2. Tokens extraídos do site atual

Cores medidas por área ocupada nos elementos reais da página.

### 2.1 Paleta

| Token               | Hex       | Onde aparece hoje                                        |
| ------------------- | --------- | -------------------------------------------------------- |
| `--cor-creme`       | `#FAF4E9` | Fundo principal do hero e do rodapé                      |
| `--cor-creme-claro` | `#F4F1EC` | Texto claro sobre fundos escuros                         |
| `--cor-cinza-claro` | `#F1F1F0` | Fundo de seções alternadas                               |
| `--cor-lilas`       | `#AB93B1` | Faixa de destaque, etiqueta "Cuidadores de idosos em SP" |
| `--cor-roxo`        | `#988CA1` | Cards de serviços, ícones                                |
| `--cor-amarelo`     | `#FBDB68` | Fundo de "Como funciona?", botão "Solicite uma visita"   |
| `--cor-verde-sage`  | `#A5B3A1` | Fundo de "Por que a Cuida?"                              |
| `--cor-texto`       | `#353539` | Texto principal                                          |
| `--cor-texto-forte` | `#222222` | Títulos e ênfase                                         |
| `--cor-preto`       | `#0F1015` | Faixas escuras e sobreposições                           |

### 2.2 Tipografia medida (desktop, canvas de 1920)

Duas famílias, com os nomes ofuscados pelo Canva. A identificação visual acontece na Story 1.2.

| Família (nome no site) | Papel                 | Tamanhos encontrados           |
| ---------------------- | --------------------- | ------------------------------ |
| `YAFdJkQTgbI`          | **Display**, serifada | 67 · 64 · 58 · 46 · 28 · 25 px |
| `YAEnXArs1iQ`          | **Texto**, sem serifa | 41 · 25 · 24 · 21 · 19 px      |

Padrão de uso observado: a display carrega os títulos de seção e o hero, quase sempre com uma palavra em peso 700 e cor lilás dentro de uma frase em 400. É a assinatura visual da marca e precisa sobreviver no mobile.

---

## 3. Sistema responsivo

### 3.1 Breakpoints

| Nome | Faixa      | Layout                                                |
| ---- | ---------- | ----------------------------------------------------- |
| `xs` | 320–479    | Coluna única, gutter 20 px                            |
| `sm` | 480–767    | Coluna única, gutter 24 px, tipografia um passo acima |
| `md` | 768–1023   | Grades de cards em 2 colunas; texto ainda empilhado   |
| `lg` | 1024–1439  | **Layout desktop** entra, proporcional                |
| `xl` | 1440–1920+ | Desktop na proporção medida hoje                      |

**A fronteira é 1024 px.** Abaixo disso manda esta especificação; acima, manda a referência do desktop em `docs/reference/screenshots/`.

### 3.2 Container

```
xs:  padding lateral 20px
sm:  padding lateral 24px
md:  padding lateral 32px
lg+: largura máxima 1920px, centralizado
```

Regra inegociável: **nada com largura fixa maior que o container**. Nenhuma imagem, card ou tabela pode criar rolagem horizontal (NFR7).

### 3.3 Escala tipográfica fluida

Os valores de mínimo foram escolhidos para legibilidade em 360 px; os de máximo reproduzem exatamente a medição do desktop.

| Token             | Mobile (360 px) | Desktop (1920 px) | `clamp()`                                    |
| ----------------- | --------------- | ----------------- | -------------------------------------------- |
| `--fs-display-xl` | 36 px           | 67 px             | `clamp(2.25rem, 1.5rem + 3.5vw, 4.1875rem)`  |
| `--fs-display-lg` | 30 px           | 58 px             | `clamp(1.875rem, 1.25rem + 2.9vw, 3.625rem)` |
| `--fs-display-md` | 26 px           | 46 px             | `clamp(1.625rem, 1.15rem + 2.1vw, 2.875rem)` |
| `--fs-heading`    | 24 px           | 41 px             | `clamp(1.5rem, 1.1rem + 1.8vw, 2.5625rem)`   |
| `--fs-label`      | 18 px           | 24 px             | `clamp(1.125rem, 1rem + 0.6vw, 1.5rem)`      |
| `--fs-body`       | 16 px           | 19 px             | `clamp(1rem, 0.95rem + 0.25vw, 1.1875rem)`   |
| `--fs-small`      | 14 px           | 16 px             | `clamp(0.875rem, 0.85rem + 0.12vw, 1rem)`    |

**Piso de 16 px no corpo de texto.** O público desta página inclui filhos e filhas cuidando de pais idosos, muitos lendo no celular, muitos com presbiopia. Texto de 14 px em parágrafo é uma barreira real aqui, não um detalhe estético.

Alturas de linha: `1.15` na display, `1.3` em subtítulos, `1.6` no corpo.

### 3.4 Espaçamento

Escala de 4 px: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`.

Respiro vertical entre blocos: **48 px** no mobile, **64 px** em `sm`, **96 px** em `md+`.

### 3.5 Toque

| Item                          | Regra                                                                      |
| ----------------------------- | -------------------------------------------------------------------------- |
| Altura mínima de alvo tocável | **48 px**                                                                  |
| Largura mínima de botão       | 48 px, e no mobile os CTAs principais ocupam 100% do container             |
| Espaço entre alvos vizinhos   | ≥ 8 px                                                                     |
| Links dentro de texto corrido | área tocável estendida com `padding` vertical, sem alterar o layout visual |

---

## 4. Layout mobile bloco a bloco

Wireframes de baixa fidelidade para 360–390 px. Conteúdo, ordem e textos são os do PRD §2 — nada é criado nem removido.

### Bloco A — Hero

```
┌──────────────────────────────┐
│  [logo Cuida]                │  ← 32px altura
├──────────────────────────────┤
│                              │
│      FOTO (4:5)              │  ← foco no rosto
│                              │
├──────────────────────────────┤
│ ( Cuidadores de idosos em SP)│  ← etiqueta lilás,
│                              │     cantos arredondados
│ Cuidar exige mais            │  ← display-xl
│ do que amor.                 │     "mais do que amor" em
│ Exige experiência,           │     peso 700 + lilás
│ rotina e presença.           │
│                              │
│ Contamos com uma equipe...   │  ← body, máx. 65 caracteres
│                              │     por linha
│ ┌──────────────────────────┐ │
│ │   FAÇA UM ORÇAMENTO      │ │  ← 48px, largura total
│ └──────────────────────────┘ │     WhatsApp
└──────────────────────────────┘
```

**Decisões e porquês:**

- **Foto antes do texto**, ao contrário da leitura ocidental normal do desktop (texto à direita da imagem). No celular, a foto ancora emocionalmente em menos de um segundo, e quem busca cuidado para um pai ou uma mãe decide muito pelo tom antes de ler qualquer coisa.
- A foto usa proporção **4:5** com `object-position` no rosto. Recortar uma imagem horizontal no centro costuma decapitar as pessoas retratadas.
- O CTA fica **acima da dobra** em telas de 640 px de altura ou mais. Se a foto empurrar o botão para fora, reduza a foto para 3:2, não o texto.
- A etiqueta "Cuidadores de idosos em SP" é decorativa em forma, mas carrega SEO local. Mantém-se como texto, nunca como imagem.

### Bloco B — Trabalhe conosco

```
┌──────────────────────────────┐
│ ┌──────────────────────────┐ │
│ │  Trabalhe conosco!  ↗    │ │  ← 48px, contorno lilás,
│ └──────────────────────────┘ │     ícone de link externo
│ Cuidar exige mais do que     │
│ amor. Exige experiência,     │
│ rotina e presença.           │
└──────────────────────────────┘
```

Este bloco fala com **outro público**: candidatos a vaga, não famílias. Por isso ele ganha peso visual menor que o CTA de orçamento — contorno em vez de preenchimento. O ícone `↗` avisa que abre em outra aba, o que é requisito de acessibilidade e não enfeite.

### Bloco C — Diferenciais (4 itens)

```
┌──────────────────────────────┐
│  ◇   Equipe supervisionada   │  ← ícone 48px + texto,
│      e com formação contínua │     lado a lado
│  ◇   Apoio emocional também  │
│      para a família          │
│  ◇   Escuta acolhedora antes │
│      de qualquer proposta    │
│  ◇   Experiência real com    │
│      mais de 10 anos         │
└──────────────────────────────┘
```

No desktop os 4 ícones ficam numa fileira. No mobile, uma fileira de 4 espreme cada ícone a menos de 80 px e o texto vira duas palavras por linha. Empilhar com ícone à esquerda preserva a leitura e o ritmo. Em `md` (768+), volta a 2×2.

### Bloco D — Institucional

```
┌──────────────────────────────┐
│ Porque a gente entende       │  ← display-lg
│ antes de oferecer.           │     "antes" em lilás
│                              │
│ A Cuida. nasceu de quem já   │  ← body
│ viveu o cuidado por dentro — │
│ na família, em casas de      │
│ repouso e no home care.      │
└──────────────────────────────┘
```

Texto centralizado, como no desktop. Largura máxima de 32 caracteres no título para não quebrar em lugar feio.

### Bloco E — Nossos serviços

```
┌──────────────────────────────┐
│      Nossos serviços         │  ← display-md, centralizado
│ ┌──────────────────────────┐ │
│ │ Terceirização ILPI     › │ │  ← card, 100% largura,
│ │ Sem burocracia e com     │ │     min-height 88px
│ │ confiança                │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ Cuidado domiciliar     › │ │
│ │ continuado               │ │
│ │ Cuidadores treinados...  │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ Acompanhamento hosp.   › │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ Consultoria para famí. › │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │   SOLICITE UMA VISITA    │ │  ← amarelo, 48px, 100%
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

Os 4 cards saem do 2×2 do desktop para coluna única. Cada card inteiro é a área tocável, não só a setinha `›` — hoje a seta tem menos de 20 px, o que é intocável com o polegar. Em `md`, volta a 2×2.

### Bloco F — Como funciona?

```
┌──────────────────────────────┐
│      Como funciona?          │  ← sobre fundo amarelo
│ ┌──────────────────────────┐ │
│ │        [ícone]           │ │  ← 64px, substitui o print
│ │     Contato Inicial      │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │        [foto 4:3]        │ │
│ │  Visita de Acolhimento   │ │
│ │  Proposta de plano       │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │        [foto 4:3]        │ │
│ │  Início do atendimento   │ │
│ │  Acompanhamento contínuo │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

**O ícone do "Contato Inicial" (FR11).** Confirmei na captura: o card usa hoje um print da própria página, com texto miúdo e ilegível. Especificação do substituto:

**✅ Ícone entregue:** `src/assets/icons/contato-inicial.svg`

| Propriedade                                    | Valor                                                                                                                                                                                                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Motivo                                         | **Balão de conversa com um coração dentro**                                                                                                                                                                                                |
| Por quê                                        | Os outros dois cards mostram encontro presencial. O primeiro passo é uma conversa, e a copy do site promete "escuta acolhedora antes de qualquer proposta" — o coração dentro do balão diz exatamente isso, em vez de um telefone genérico |
| Por que não um telefone ou o glifo do WhatsApp | Seriam lidos como botão clicável de WhatsApp, e este card é ilustrativo, não é CTA. Confundir os dois custa clique perdido e frustração                                                                                                    |
| Estilo                                         | Traço (line art), igual aos ícones dos diferenciais                                                                                                                                                                                        |
| Espessura                                      | 2 px, com terminações arredondadas                                                                                                                                                                                                         |
| Tamanho                                        | 64 × 64 px, em SVG, ampliável sem perda                                                                                                                                                                                                    |
| Cor                                            | `currentColor`, herdando `--cor-roxo` do contexto                                                                                                                                                                                          |
| Fundo                                          | Mesmo dos outros dois cards, para os três ficarem irmãos                                                                                                                                                                                   |

Os outros dois cards continuam com foto. Um trio com dois retratos e um ícone fica desequilibrado; para resolver, o ícone recebe um bloco de fundo da mesma altura da área de foto dos vizinhos, mantendo o alinhamento dos títulos.

### Bloco G — Por que a Cuida?

```
┌──────────────────────────────┐
│      ⬤ foto circular         │  ← 200px de diâmetro
│                              │
│   Por que a Cuida?           │  ← display-md
│   • Cuidar com quem já viveu │
│     o cuidado na pele        │
│   • Atendimento consultivo   │
│   • Equipe supervisionada    │
│   • Relacionamento próximo   │
└──────────────────────────────┘
```

⚠️ Este bloco tem problema de contraste no desktop. Ver §6.

### Bloco H — Frase de destaque

```
┌──────────────────────────────┐
│  Quando cuidar de quem       │  ← display-lg, centralizado
│  você ama exige mais do      │     faixa lilás
│  que amor, a Cuida entende.  │
└──────────────────────────────┘
```

Respiro vertical generoso (48 px acima e abaixo). É a frase de maior carga emocional da página, e aperto tira o efeito.

### Bloco I — O que a Cuida faz?

```
┌──────────────────────────────┐
│    O que a Cuida faz?        │
│                              │
│ Nutrição                     │  ← label em 700
│ Preparo de refeições,        │  ← body
│ planejamento da dieta...     │
│ ──────────────────────────   │  ← divisória sutil
│ Transporte e tarefas         │
│ ...                          │
│ ──────────────────────────   │
│ Serviços domésticos          │
│ ...                          │
│ (Cuidados Essenciais)        │
│ (Terceirização para ILPI)    │
└──────────────────────────────┘
```

Cinco itens de texto denso. Divisórias de 1 px em `--cor-roxo` a 20% de opacidade separam sem criar cinco caixas pesadas. A imagem do celular que aparece ao lado no desktop é decorativa: no mobile ela sai, com `alt=""` se for mantida em algum breakpoint.

### Bloco J — Fale com a Cuida (rodapé)

```
┌──────────────────────────────┐
│      [logo Cuida]            │
│                              │
│  Experiência real            │
│  Equipe capacitada           │
│  Atendimento humanizado      │
│  Apoio à família             │
│  Cursos e Palestras          │
│  Suporte ILPI                │
│ ┌──────────────────────────┐ │
│ │ 📱 (11) 99560-4988       │ │  ← 48px cada, tocável
│ ├──────────────────────────┤ │
│ │ ✉ contato.cuidahome...   │ │
│ ├──────────────────────────┤ │
│ │ ◎ @cuidahomecare         │ │
│ ├──────────────────────────┤ │
│ │ ★ Avaliação Google       │ │
│ └──────────────────────────┘ │
│      [foto]                  │
└──────────────────────────────┘
```

Os quatro contatos viram uma lista de linhas de 48 px, cada uma tocável por inteiro. Essa é a maior correção de usabilidade mobile da página: hoje são textos soltos, impossíveis de acertar com o dedo.

Cada link só com ícone precisa de `aria-label`. O telefone usa `tel:` e o e-mail usa `mailto:`, para abrir o app certo.

---

## 5. Direção de arte das imagens

| Bloco                 | Mobile                      | Desktop             |
| --------------------- | --------------------------- | ------------------- |
| Hero                  | 4:5 vertical, foco no rosto | Conforme referência |
| Como funciona (2 e 3) | 4:3                         | Conforme referência |
| Por que a Cuida       | Círculo de 200 px           | Conforme referência |
| O que a Cuida faz     | Omitida (decorativa)        | Conforme referência |
| Rodapé                | 16:9                        | Conforme referência |

⚠️ **Limite conhecido:** nenhuma imagem atual passa de 1285 px de largura. Para o hero em tela cheia no desktop isso é pouco, e a imagem não deve ser ampliada além do tamanho original — melhor um hero com largura contida do que uma foto borrada. No mobile o problema não existe: 1285 px cobre com folga qualquer celular.

Toda imagem informativa leva `alt` descritivo; as decorativas levam `alt=""`. Fotos de pessoas cuidando merecem `alt` que descreva a cena, não "imagem1".

---

## 6. Acessibilidade: dois problemas de contraste encontrados

Calculei os contrastes reais a partir das cores medidas. **Dois combos reprovam no WCAG AA e vão contra a NFR8.**

| Combinação                                | Onde                                  | Contraste  | AA?                                       |
| ----------------------------------------- | ------------------------------------- | ---------- | ----------------------------------------- |
| Branco sobre `#988CA1` (roxo)             | Subtítulo dos cards de serviço, 19 px | **3,19:1** | ❌ falha (precisa 4,5:1)                  |
| Branco sobre `#988CA1`, título 24 px bold | Título dos cards                      | 3,19:1     | ⚠️ passa raspando (texto grande pede 3:1) |
| Branco sobre `#A5B3A1` (sage)             | "Por que a Cuida?"                    | **2,20:1** | ❌ falha, inclusive para texto grande     |
| `#353539` sobre `#FBDB68` (amarelo)       | Botão e seção "Como funciona?"        | 8,9:1      | ✅                                        |
| `#353539` sobre `#FAF4E9` (creme)         | Corpo da página                       | 11,5:1     | ✅                                        |

### ✅ Decisão do Lucas (17/09/2026) — aplicada

> **"Pode aplicar. A ideia é não mudar o visual, mas essas coisas de acessibilidade e performance pode rodar sim, mesmo que mude um pouco."**

Isso estabelece uma **regra geral do projeto**, mais ampla do que estes dois casos:

> **Fidelidade ao desktop cede quando o motivo é acessibilidade ou performance.** Mudança por gosto ou por iniciativa de design continua proibida (FR2) e vira anotação para o Lucas. Mudança para cumprir WCAG AA ou a meta de performance é autorizada, mesmo alterando um pouco o visual, e deve ser registrada aqui.
>
> ⚠️ O @pm precisa refletir essa regra na FR2 do PRD, para o @dev não reverter as correções achando que está protegendo a fidelidade.

**Correções aplicadas em `src/styles/tokens.css`:**

| Correção                  | De        | Para      | Contraste           |
| ------------------------- | --------- | --------- | ------------------- |
| Roxo dos cards de serviço | `#988CA1` | `#7E7191` | 3,19:1 → **4,53:1** |
| Texto sobre o verde sage  | Branco    | `#353539` | 2,20:1 → **5,6:1**  |

Os hexadecimais originais continuam no arquivo como registro do site antigo, mas os papéis semânticos (`--bg-card`, `--texto-sobre-sage`) já apontam para os valores corrigidos.

### Demais critérios (todos obrigatórios)

- Foco visível com `outline` de 2 px e 2 px de afastamento, em todos os elementos interativos.
- Ordem de headings sem pulo: um `h1` só no hero; títulos de bloco em `h2`; subtítulos de card em `h3`.
- `prefers-reduced-motion` respeitado, caso alguma transição entre no projeto.
- Zoom até 200% sem rolagem horizontal, o que é consequência direta de não usar largura fixa.
- Nenhuma informação transmitida só por cor: a seta `›` dos cards acompanha texto.

---

## 7. CTA flutuante de WhatsApp (mobile) — ✅ aprovado pelo Lucas em 17/09

Botão fixo no canto inferior direito, **apenas em telas abaixo de 1024 px**. É o único elemento novo autorizado em relação ao site atual.

```
                    ┌──────────────────────────────┐
                    │  ...conteúdo da página...    │
                    │                              │
                    │                        ╭───╮ │
                    │                        │ ◉ │ │ ← 56px, 16px das bordas
                    │                        ╰───╯ │
                    └──────────────────────────────┘
```

| Propriedade            | Valor                                           | Motivo                                                                                                                                                                                   |
| ---------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tamanho                | 56 × 56 px                                      | Acima do mínimo de 48 px, confortável para o polegar                                                                                                                                     |
| Posição                | `fixed`, 16 px da borda direita e inferior      | Zona natural do polegar em uso com uma mão                                                                                                                                               |
| Área segura            | somar `env(safe-area-inset-bottom)`             | Não ficar sob a barra de gestos do iPhone                                                                                                                                                |
| Cor de fundo           | `--cor-whatsapp` `#128C7E`                      | O verde claro da marca (`#25D366`) dá só **2,02:1** com o ícone branco e reprova o mínimo de 3:1 para elemento gráfico. O verde escuro da WhatsApp dá **4,19:1** e continua reconhecível |
| Ícone                  | Glifo do WhatsApp em branco, 28 px              | Reconhecimento imediato                                                                                                                                                                  |
| `aria-label`           | "Falar com a Cuida no WhatsApp"                 | O botão não tem texto visível                                                                                                                                                            |
| Destino                | `--whatsappOrcamento` de `src/data/contatos.ts` | Mesma mensagem limpa dos outros CTAs (FR5)                                                                                                                                               |
| Visibilidade           | `display: none` a partir de 1024 px             | O desktop não muda (FR2)                                                                                                                                                                 |
| Folga no fim da página | `--fab-folga-rodape`                            | Impede o botão de tampar o último contato do rodapé                                                                                                                                      |

**Sem JavaScript.** A arquitetura fixa o orçamento em 0 KB de JS, então o botão **não** aparece por scroll: ele está visível desde o início no mobile. Se quiser o efeito de surgir após o hero, dá para fazer com animação de scroll em CSS (`animation-timeline: scroll()`), sempre dentro de `@supports` e com o estado visível como padrão — nunca deixando o botão sumir onde o recurso não existe.

**Contrapartida honesta:** um botão fixo cobre cerca de 72 px do canto inferior direito em toda a rolagem. Em telas de 360 px isso encosta no conteúdo de blocos com imagem larga. Vale validar na Story 2.2 e, se incomodar, reduzir para 48 px.

---

## 8. Checklist de QA mobile

Por breakpoint: **360 · 390 · 768 · 1280 · 1920**.

- [ ] Nenhuma rolagem horizontal em nenhuma largura
- [ ] Todo CTA com pelo menos 48 px de altura
- [ ] Nenhum texto de parágrafo abaixo de 16 px
- [ ] Título do hero em no máximo 4 linhas a 360 px
- [ ] CTA do hero visível em tela de 640 px de altura
- [ ] Contrastes conforme §6 (com a decisão do Lucas aplicada)
- [ ] Ordem de headings sem pulo (verificar no Lighthouse)
- [ ] Foco visível em toda a navegação por teclado
- [ ] Todas as imagens com `alt` correto
- [ ] Zoom em 200% sem quebra
- [ ] Os 4 contatos do rodapé tocáveis por linha inteira
- [ ] "Trabalhe conosco" abrindo em nova aba, com aviso visual
- [ ] CTA flutuante visível abaixo de 1024 px e ausente a partir de 1024 px
- [ ] CTA flutuante sem tampar o último contato do rodapé, e acima da barra de gestos no iPhone
- [ ] Nenhuma seção, texto ou canal a mais em relação ao PRD §2 e ao CTA flutuante da §7

---

## 9. Entregue junto com esta especificação

- `src/styles/tokens.css` — tokens prontos para uso, com os valores medidos aqui e as correções de contraste já aplicadas.
- `src/assets/icons/contato-inicial.svg` — ícone que substitui o print no card "Contato Inicial" (FR11).

## 10. Pendências

1. **Identificação das famílias tipográficas** (Story 1.2). Os tokens usam `--font-display` e `--font-sans`, que apontam para placeholders até a confirmação.
2. **@pm:** refletir na FR2 do PRD a regra aprovada na §6 — acessibilidade e performance podem alterar o visual; gosto e iniciativa de design, não.
3. **Validar o CTA flutuante em tela real** na Story 2.2 (§7), para decidir se 56 px incomodam em 360 px.

**Resolvidas em 17/09:** correções de contraste (§6), CTA flutuante (§7) e ícone do "Contato Inicial" (§4, bloco F).
