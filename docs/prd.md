# Cuida Home Care — Rebuild de Performance · Product Requirements Document (PRD)

> **Fontes:** briefing `socialmidia/output/secretaria/briefing-dev-cuidahomecare-performance-2026-09-17.md` (Trizz, @secretaria) **e inspeção direta do site renderizado** em 2026-09-17 (@pm).
> **Cliente:** Cuida Home Care · **Prestador:** ISKR (não é projeto próprio do Lucas) · **Aprovador:** Lucas.
> ⚠️ **Onde o briefing conflita com o site no ar, vale o site no ar.** As divergências encontradas estão em §10.

---

## 1. Goals and Background Context

### 1.1 Goals

- Substituir o site atual (`https://cuidahomecare.com/`, export do Canva) por um site que entregue o HTML pronto, sem depender de render no navegador.
- Levar o PageSpeed mobile de **56 para 90+**, com **FCP e LCP abaixo de 1,5s**.
- **Desktop:** manter o visual atual. Só performance, praticamente nada de mudança visual.
- **Mobile:** entregar um layout **responsivo refeito do zero**. O mobile atual não tem responsividade e não serve de referência.
- **Preservar todos os canais de conversão** exatamente como estão hoje: WhatsApp, e-mail, Instagram, avaliação no Google e o formulário externo de "Trabalhe conosco!".
- Corrigir os dois defeitos aprovados: o card "Contato Inicial", que usa um print do próprio site, e a mensagem do WhatsApp com caractere corrompido.
- Cumprir o padrão fixo de LP: SEO on-page, Navegação Agêntica 3/3, headers de segurança, 404 própria e acessibilidade ≥ 87.
- Publicar na **conta Vercel do cliente** e apontar o domínio para a Vercel só depois de validar o preview.

### 1.2 Background Context

O site atual foi publicado pelo "Publish as website" do Canva (assinaturas `__canva_public_path__` e `"K":"export_website"`). O HTML chega vazio (`<div id="root"></div>`) e a página é desenhada no navegador por um motor de render de **2,65 MB**, somando **~3,4 MB de JS**, mais **12 fontes `.woff`** sem subset (acima de 1,5 MB). Daí os **~10s de FCP, LCP e Speed Index** e a nota **56**.

TBT (10 ms), CLS (0) e as imagens **não são o problema**. O gargalo é só o download e o render feitos no navegador, e um export do Canva não dá para otimizar aos poucos. **Reconstruir é o único caminho.**

A inspeção do site renderizado confirmou um detalhe que muda o escopo: **a página não tem formulário nativo**. Toda conversão acontece por link externo, principalmente WhatsApp. O único Google Forms com destino conhecido é o de **"Trabalhe conosco!"**, que é recrutamento e não capta lead de cliente.

### 1.3 Baseline medido (auditoria de 17/09/2026)

| Métrica                       | Hoje                 | Meta                                |
| ----------------------------- | -------------------- | ----------------------------------- |
| Desempenho (PageSpeed mobile) | 56                   | 90+                                 |
| FCP / LCP / Speed Index       | ~10s cada            | FCP e LCP < 1,5s                    |
| JS transferido                | ~3,4 MB              | O mínimo necessário                 |
| Fontes                        | 12 `.woff`, > 1,5 MB | `.woff2` com subset                 |
| TBT / CLS                     | 10 ms / 0            | < 100 ms / < 0,1                    |
| Acessibilidade                | 87                   | ≥ 87                                |
| Responsividade                | Nenhuma              | 360 a 1920 px sem scroll horizontal |

### 1.4 Change Log

| Date       | Version | Description                                                                                                                                                                                                                              | Author       |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 2026-09-17 | 1.0     | PRD inicial gerado a partir do briefing                                                                                                                                                                                                  | Morgan (@pm) |
| 2026-09-17 | 1.1     | Correções após inspeção do site no ar e decisões do Lucas: não existe formulário nativo (o Forms é o "Trabalhe conosco!"), inventário real de seções e contatos, repositório no GitHub ISKR, canonical apex confirmado, Next.js liberado | Morgan (@pm) |
| 2026-09-17 | 1.2     | FR2.1 adicionada — acessibilidade e performance podem alterar o visual. CTA flutuante de WhatsApp aprovado no mobile (`front-end-spec-mobile.md` §7). Ajuste pedido na validação de stories do @po                                       | Morgan (@pm) |
| 2026-09-18 | 1.3     | FR6 revogada (WhatsApp secundário não é publicado — não foi localizado na interface do site atual) e FR11 revogada (print do "Contato Inicial" mantido, ícone reprovado)                                                                 | Morgan (@pm) |

---

## 2. Inventário real do site (capturado do DOM renderizado em 17/09/2026)

Ordem conforme o texto renderizado. **O agrupamento visual das seções ainda precisa ser confirmado pelas screenshots da Story 1.2.**

| #   | Bloco                          | Conteúdo-chave                                                                                                                                                                                                                                                           | Ação / link                                                 |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| A   | **Hero**                       | "faça um orçamento" · "Cuidar exige mais do que amor. Exige experiência, rotina e presença." · parágrafo sobre a equipe · "Cuidadores de idosos em SP"                                                                                                                   | CTA → **WhatsApp 5511995604988**                            |
| B   | **Trabalhe conosco**           | "Trabalhe conosco!" + repetição da frase de abertura                                                                                                                                                                                                                     | → **Google Forms `forms.gle/6UT8xqQmGfVTc1Pv5`** (nova aba) |
| C   | **Diferenciais**               | Equipe supervisionada e com formação contínua · Apoio emocional também para a família · Escuta acolhedora antes de qualquer proposta · Experiência real com mais de 10 anos                                                                                              | —                                                           |
| D   | **Institucional**              | "Porque a gente entende antes de oferecer." · "A Cuida. nasceu de quem já viveu o cuidado por dentro — na família, em casas de repouso e no home care."                                                                                                                  | —                                                           |
| E   | **Nossos serviços**            | Acompanhamento hospitalar (Cuidador no hospital e retorno seguro) · Terceirização ILPI (Sem burocracia e com confiança / Cuidadores treinados e supervisionados) · Cuidado domiciliar continuado · Consultoria para famílias (Decida entre home care ou casa de repouso) | CTA "Solicite uma visita" → **WhatsApp 5511995604988**      |
| F   | **Como funciona?**             | Contato Inicial · Visita de Acolhimento (Proposta de plano) · Início do atendimento (Acompanhamento contínuo)                                                                                                                                                            | —                                                           |
| G   | **Por que a Cuida?**           | Cuidar com quem já viveu o cuidado na pele · Atendimento consultivo · Equipe supervisionada · Relacionamento próximo com a família                                                                                                                                       | —                                                           |
| H   | **Frase de destaque**          | "Quando cuidar de quem você ama exige mais do que amor, a Cuida entende."                                                                                                                                                                                                | —                                                           |
| I   | **O que a Cuida faz?**         | Nutrição · Transporte e tarefas · Serviços domésticos · Cuidados Essenciais · Terceirização para ILPI                                                                                                                                                                    | —                                                           |
| J   | **fALE COM A CUIDA. / rodapé** | (11) 99560-4988 · contato.cuidahomecare@gmail.com · @cuidahomecare · Avaliação Google · Experiência real / Equipe capacitada / Atendimento humanizado / Apoio à família · Cursos e Palestras · Suporte ILPI                                                              | WhatsApp, e-mail, Instagram, Google                         |

**Links externos encontrados no código renderizado:**

| Destino                                     | URL                                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| WhatsApp principal                          | `wa.me/5511995604988` (também via `api.whatsapp.com/send/`, com a mensagem pré-preenchida)  |
| WhatsApp secundário                         | `wa.me/5511915777784`                                                                       |
| Google Forms — Trabalhe conosco             | `https://forms.gle/6UT8xqQmGfVTc1Pv5`                                                       |
| Google Forms — **destino não identificado** | `https://forms.gle/qqBkfBjv5uq4Qukv9` (está ligado a um ícone de 64×64, sem texto ao redor) |
| Instagram                                   | `https://www.instagram.com/cuidahomecare`                                                   |
| E-mail                                      | `contato.cuidahomecare@gmail.com`                                                           |
| Avaliação Google                            | `https://share.google/2A5HTlqv7qSVXIpPY`                                                    |

---

## 3. Requirements

### 3.1 Functional

- **FR1:** O site é uma **página única**, com os blocos A–J da §2, na mesma ordem e com o **texto integral** do site atual. A navegação continua sendo rolagem com âncoras.
- **FR2:** No **desktop**, a página reproduz o visual atual: layout, cores, tipografia, imagens e espaçamentos. Nenhum redesign por iniciativa própria. Melhoria percebida é **anotada e levada ao Lucas**, nunca aplicada direto.
  - **FR2.1 (decisão do Lucas, 17/09/2026):** a fidelidade **cede quando o motivo é acessibilidade ou performance**. Mudança necessária para cumprir WCAG AA ou as metas da NFR1 é autorizada, mesmo alterando um pouco o visual, e precisa ser **registrada** na story e apresentada na Story 2.2. Mudança por gosto ou iniciativa de design continua proibida. Correções já aplicadas sob esta regra: cor dos cards de serviço e cor do texto sobre o verde sage (ver `docs/front-end-spec-mobile.md` §6).
- **FR3:** No **mobile**, a página ganha um layout mobile-first **novo**, mantendo conteúdo, ordem lógica, marca e CTAs, com empilhamento, tipografia legível, alvos de toque confortáveis e imagens no tamanho certo. Sem seção nova e sem texto diferente.
- **FR4:** **Não existe formulário nativo no site, e nenhum será criado.** Toda conversão é link externo.
- **FR5:** O CTA principal do hero ("faça um orçamento") e o CTA "Solicite uma visita" abrem `wa.me/5511995604988` com a mensagem `Olá gostaria de um orçamento.`, **sem** o caractere corrompido (`%EF%BF%BD`) que existe hoje.
- **FR6:** ~~O WhatsApp secundário `wa.me/5511915777784` continua publicado.~~ **Revogado em 18/09/2026 por decisão do Lucas.** O número existe no blob de dados do site do Canva (6 ocorrências, sempre com a mesma mensagem do número principal), mas **não foi localizado na interface** — nem pelo Lucas, nem na auditoria. A página não renderiza nenhum elemento `<a>`, então estar no código-fonte não prova estar publicado. Critério: **o que não está visível no site atual não entra no novo.** O número não é publicado.
- **FR7:** O bloco **"Trabalhe conosco!"** abre `https://forms.gle/6UT8xqQmGfVTc1Pv5` em nova aba. É um Google Forms de recrutamento, e o site não coleta nem intermedeia esses dados.
- **FR8:** O segundo Google Forms (`forms.gle/qqBkfBjv5uq4Qukv9`) precisa ser **localizado no site no ar** (está ligado a um ícone sem texto). Depois de identificado, é reproduzido no mesmo lugar e com o mesmo comportamento. Se for lixo ou um link órfão, a remoção precisa do aval do Lucas.
- **FR9:** O bloco "fALE COM A CUIDA." e o rodapé publicam os mesmos contatos de hoje: telefone (11) 99560-4988, `contato.cuidahomecare@gmail.com`, Instagram `@cuidahomecare` e a avaliação no Google (`share.google/2A5HTlqv7qSVXIpPY`).
- **FR10:** O site publica **só os canais que já estão no site atual**. Nenhum canal novo, e nenhum canal existente removido sem aval do Lucas.
- **FR11:** ~~O print do card "Contato Inicial" é trocado por um ícone limpo.~~ **Revogado em 17/09/2026 por decisão do Lucas**, que reprovou o ícone proposto. O print é **mantido**, recortado em quadrado e alinhado pelo topo (corta só a parte de baixo), em desktop e mobile.
- **FR12:** `/llms.txt` na raiz, em Markdown, com pelo menos 1 H1 e links.
- **FR13:** `/llms-full.txt` com o texto de todas as seções.
- **FR14:** `robots.txt` liberando os crawlers de IA, com a linha `Sitemap:` apontando para um `sitemap.xml` válido.
- **FR15:** Página **404 personalizada**, dentro da identidade visual.
- **FR16:** Nenhum tracking (sem GA4 e sem Pixel). Só um `<!-- GTM slot -->` comentado no `<head>`. Sem tracking, **não há banner de cookies**.
- **FR17:** SEO on-page completo, conforme o Apêndice A §7.1: `<title>` de 50-60 caracteres com "Cuida Home Care" + "ABC e região", `<h1>` único em texto puro, meta description de 150-160 caracteres com CTA, canonical, meta robots, `lang="pt-BR"`, `theme-color` e HTML semântico.

### 3.2 Non Functional

- **NFR1 — Performance (objetivo central):** laboratório com perfil Moto G em 4G: **FCP < 1,5s, LCP < 1,5s, TBT < 100 ms, CLS < 0,1, Desempenho ≥ 90**. Medido em preview **e** em produção.
- **NFR2 — HTML pronto do servidor:** a página é entregue renderizada, sem depender de JS para aparecer. Qualquer stack é aceitável desde que cumpra a NFR1 e a NFR7 (ver §5.4).
- **NFR3 — CSS:** CSS crítico inline no `<head>` e o restante adiado.
- **NFR4 — Fontes:** as 12 fontes identificadas visualmente e servidas em `.woff2` com subset `latin` + `latin-ext`, `font-display: swap`, e `preload` só na fonte do H1/hero.
- **NFR5 — Imagens:** WebP ou AVIF, com `width`/`height` explícitos, `loading="lazy"` fora do hero e `fetchpriority="high"` na imagem do LCP.
- **NFR6 — Cache:** `Cache-Control` `immutable` de 1 ano para os assets estáticos, configurado no `vercel.json`.
- **NFR7 — Responsividade:** mobile-first, sem scroll horizontal e com toque confortável. Validada em **360, 390, 768, 1280 e 1920 px**.
- **NFR8 — Acessibilidade:** Lighthouse **≥ 87**, contraste WCAG AA, `alt` em toda imagem informativa, foco visível, `aria-label` nos links que são só ícone (WhatsApp, Instagram) e hierarquia de headings correta.
- **NFR9 — Segurança:** `X-Content-Type-Options`, `Referrer-Policy` e `Strict-Transport-Security` aplicados a **todas as rotas**, não só a `/`.
- **NFR10 — Hospedagem:** deploy **exclusivamente na conta Vercel do cliente**. É proibido publicar na conta pessoal do Lucas.
- **NFR11 — Repositório:** o código fica no **GitHub da ISKR (`iskarockets`)**. Este projeto é serviço ISKR e **nunca** usa a conta pessoal `lucas.nogueira`.
- **NFR12 — DNS (corrigida em 18/09/2026):** o domínio **tem e-mail ativo** (MX `smtp.google.com`, Google Workspace) — o briefing afirmava o contrário. **Não trocar nameservers.** A zona DNS permanece onde está (OpenSRS/Tucows, `systemdns.com`) e alteram-se **apenas** os registros `A` do apex e `www` para apontar à Vercel. O MX e o TXT de verificação do Google não são tocados. Ver `docs/guias/dns-cutover.md`.
- **NFR13 — Assets:** as imagens servidas hoje (baixadas pela aba Network) são **placeholder autorizado**. Se o cliente mandar logo vetorial e fotos originais, elas substituem as atuais. Se não mandar, o site publica com o placeholder.
- **NFR14 — Documentação autossuficiente:** a seção "Requisitos técnicos fixos" do briefing fica **colada por inteiro** no repositório (Apêndice A), nunca só referenciada por link.
- **NFR15 — Localização:** o negócio atende por área, sem endereço fixo. Usar "ABC e região" em texto puro, como já está no Google. **Nenhum endereço inventado.**

---

## 4. User Interface Design Goals

### 4.1 Overall UX Vision

O desktop é a experiência de hoje, só que instantânea: conteúdo visível em menos de 1,5s em vez de ~10s. O mobile é a experiência que o site nunca teve: leitura confortável e WhatsApp sempre ao alcance do polegar. O tom acolhedor e familiar continua igual.

### 4.2 Key Interaction Paradigms

- Página única com rolagem e âncoras, igual ao site atual.
- **Conversão por link externo**, sem formulário e sem etapa intermediária: WhatsApp para orçamento e visita, Google Forms para "Trabalhe conosco", e-mail e Instagram no rodapé.
- Sem modais e sem pop-ups. Animações só se já existirem no desktop, e reproduzidas de forma leve.

### 4.3 Core Screens and Views

- **Home (página única):** blocos A–J da §2.
- **Página 404** personalizada.

### 4.4 Accessibility: WCAG AA

Lighthouse de acessibilidade ≥ 87 (baseline atual), com os critérios da NFR8.

### 4.5 Branding

- Identidade atual: logo, paleta e tipografia **extraídas do site no ar** (desktop).
- O novo ícone do card "Contato Inicial" precisa parecer da mesma família dos ícones dos diferenciais.
- ⚠️ As fotos atuais são **geradas por IA**, têm o **logo do uniforme deformado** e no máximo 1285 px de largura, o que é pouco para um hero em tela cheia. Ficam como placeholder, e a decisão final de qualidade é do Lucas.

### 4.6 Target Device and Platforms: Web Responsive

Desktop fiel ao atual e mobile/tablet com layout novo, de 360 a 1920 px.

---

## 5. Technical Assumptions

### 5.1 Repository Structure: repositório único no GitHub da ISKR

Um repositório dedicado ao site, na conta **`iskarockets`** (NFR11), conectado ao projeto na Vercel do cliente. O @devops define o método de conexão (integração Git ou deploy por CLI).

### 5.2 Service Architecture

**Site estático em CDN (Vercel), sem backend e sem serverless.** Não há integração de dados: todos os destinos de conversão são links externos. Headers e cache ficam no `vercel.json`.

### 5.3 Testing Requirements

- **Performance e acessibilidade:** Lighthouse/PageSpeed mobile e desktop em cada preview relevante e em produção (NFR1 e NFR8).
- **Fidelidade visual (desktop):** comparação lado a lado, seção por seção, com as screenshots de referência da Story 1.2.
- **Responsividade:** checagem em 360, 390, 768, 1280 e 1920 px.
- **Links:** todo CTA testado em produção, num celular real, incluindo a mensagem pré-preenchida do WhatsApp.
- **Headers:** conferência via `curl -I` em `/`, numa rota de asset e na 404.
- **Validação estática:** HTML válido, âncoras funcionando, `llms.txt`, `robots.txt` e `sitemap.xml` acessíveis.

### 5.4 Additional Technical Assumptions and Requests

- **Stack livre, resultado fechado.** Decisão do Lucas: o "como" não importa, desde que entregue **PageSpeed 90+ e mobile responsivo**. **Next.js está liberado**, assim como HTML/CSS puro ou qualquer gerador estático. O @architect escolhe e justifica pela NFR1.
- Se a escolha for Next.js, a recomendação é **exportação estática, sem JS de render no cliente**, porque hydration desnecessária é o risco mais direto contra a meta de LCP. Qualquer JS que sobre precisa caber no orçamento de TBT < 100 ms.
- **Canonical confirmado pelo Lucas:** `https://cuidahomecare.com/` (apex), com `www` redirecionando para ele.
- **Fontes e imagens:** pipelines de subset `.woff2` e de conversão WebP/AVIF documentados e reproduzíveis no repositório.
- **Quality gates do AIOS** (`lint`/`typecheck`/`test`): adaptados ao contexto de site estático. O @architect define.
- A referência viva durante o desenvolvimento é **o site no ar aberto no navegador**. O HTML cru do Canva não serve para nada.

---

## 6. Epic List

1. **Epic 1 — Rebuild completo em preview:** montar o repositório na ISKR com deploy na Vercel do cliente e reconstruir a página inteira (blocos A–J), com desktop fiel, mobile responsivo, todos os CTAs externos, SEO, Navegação Agêntica e 404, publicada numa URL de preview.
2. **Epic 2 — Performance comprovada e go-live:** medir e ajustar até bater as metas, validar fidelidade e responsividade com aceite do Lucas, e fazer o cutover do domínio com validação em produção.

> **Por que só 2 epics:** é uma página única, sem backend. Performance, acessibilidade e SEO são **transversais** e entram como critério desde a Story 1.1, não como etapa final. O Epic 2 existe porque medição, aceite e troca de DNS formam um marco próprio, com risco de produção.

---

## 7. Epic 1 — Rebuild completo em preview

**Objetivo:** ter o novo site **inteiro e funcional numa URL de preview da Vercel do cliente**, com a arquitetura que sustenta a performance. Começa pela fundação e pela captura travada da referência, para que cada bloco seja construído contra um alvo objetivo, e termina com o site pronto para avaliação, sem tocar no domínio de produção.

### Story 1.1 — Setup do repositório (GitHub ISKR) e canário na Vercel do cliente

Como **ISKR**,
quero **o repositório criado na conta ISKR e ligado à Vercel do cliente, com uma página canário em preview**,
para que **todo o trabalho seguinte caia no ambiente certo, com headers e cache corretos desde o primeiro deploy**.

**Acceptance Criteria**

1. O repositório foi criado no **GitHub `iskarockets`** (não na conta pessoal `lucas.nogueira`), com a estrutura definida pelo @architect e README explicando como rodar e publicar.
2. O projeto está vinculado à **conta Vercel do cliente**, e nada foi publicado na conta do Lucas.
3. Uma página canário responde numa URL de preview, com `lang="pt-BR"`, charset e viewport.
4. O `vercel.json` aplica `X-Content-Type-Options`, `Referrer-Policy` e `Strict-Transport-Security` a **todas as rotas**, confirmado por `curl -I` na raiz e numa rota inexistente.
5. O `vercel.json` define `Cache-Control` `immutable` de 1 ano para os assets estáticos.
6. A seção "Requisitos técnicos fixos" do briefing está colada por inteiro em `docs/` (NFR14).
7. O domínio `cuidahomecare.com` **não** foi alterado.

### Story 1.2 — Captura travada da referência (visual, conteúdo e assets)

Como **dev responsável pelo rebuild**,
quero **a referência do site atual capturada e versionada**,
para que **a fidelidade do desktop seja verificável e não dependa do site do Canva continuar no ar**.

**Acceptance Criteria**

1. Screenshots do **desktop** (1280 e 1920 px) de **cada bloco** da §2, versionadas em `docs/reference/`. Screenshots do mobile atual ficam só como registro do problema, nunca como alvo.
2. O inventário da §2 foi confirmado visualmente: agrupamento real das seções, âncoras, ordem e posição de cada CTA.
3. A copy integral, bloco por bloco, está versionada a partir da página renderizada.
4. Imagens, ícones e logo foram baixados pela aba Network e guardados como originais do placeholder.
5. As 12 fontes foram identificadas, com família e pesos por elemento (H1, H2, corpo, botões).
6. A paleta de cores (hex) foi extraída e documentada.
7. **O link `forms.gle/qqBkfBjv5uq4Qukv9` foi localizado na página** (ícone de 64×64 sem texto), com print mostrando onde fica e o que ele representa (FR8). Se não for localizável na interface, isso é registrado e levado ao Lucas.
8. Todos os contatos foram reconfirmados no código renderizado e batem com a §2. Qualquer contato a mais é registrado antes de ser implementado.

### Story 1.3 — Base visual: fontes, tokens e estrutura da página

Como **visitante**,
quero **que o site já apareça com a tipografia e as cores da marca no primeiro render**,
para que **a página tenha a cara da Cuida sem atraso nem salto de layout**.

**Acceptance Criteria**

1. Fontes em `.woff2` com subset `latin` + `latin-ext`, `font-display: swap`, e `preload` só na do H1/hero.
2. O pipeline de subset e conversão está documentado e é reproduzível.
3. Tokens de cor e tipografia definidos a partir da Story 1.2.
4. Estrutura semântica montada (`header`/`nav`/`main`/`section`/`footer`), com as âncoras do inventário.
5. CSS base mobile-first, sem scroll horizontal de 360 a 1920 px.
6. CSS crítico inline e restante adiado, funcionando.
7. O preview publica e o CLS fica < 0,1.

### Story 1.4 — Hero e CTA de orçamento (bloco A)

Como **familiar procurando cuidado para alguém que ama**,
quero **entender em segundos o que a Cuida oferece e falar no WhatsApp**,
para que **eu consiga um orçamento sem esperar a página carregar**.

**Acceptance Criteria**

1. O hero traz logo, "faça um orçamento", a frase "Cuidar exige mais do que amor. Exige experiência, rotina e presença.", o parágrafo sobre a equipe e "Cuidadores de idosos em SP", com o texto exato da referência.
2. O nome do negócio aparece num `<h1>` único em **texto puro**, não só dentro do logo.
3. O CTA abre `wa.me/5511995604988` com a mensagem `Olá gostaria de um orçamento.`, sem caractere corrompido.
4. No **desktop**, a comparação lado a lado com a screenshot de referência não mostra diferença de layout, cor, fonte ou texto.
5. No **mobile**, o bloco é empilhado, legível e com CTA confortável ao toque em 360 e 390 px.
6. A imagem do LCP está em WebP/AVIF, com dimensões explícitas e `fetchpriority="high"`.

### Story 1.5 — Trabalhe conosco, diferenciais e institucional (blocos B, C e D)

Como **cuidador procurando trabalho** ou **familiar avaliando a empresa**,
quero **acessar a vaga e entender a história da Cuida**,
para que **eu me candidate ou ganhe confiança na empresa**.

**Acceptance Criteria**

1. O bloco "Trabalhe conosco!" abre `https://forms.gle/6UT8xqQmGfVTc1Pv5` em nova aba, com `rel="noopener"`.
2. Os 4 diferenciais e o bloco institucional estão com o texto exato da referência.
3. Desktop fiel à screenshot; mobile empilhado e legível.
4. As imagens do bloco estão em WebP/AVIF, com `loading="lazy"` e dimensões explícitas.

### Story 1.6 — Nossos serviços e CTA "Solicite uma visita" (bloco E)

Como **familiar avaliando opções**,
quero **ver os serviços disponíveis e pedir uma visita**,
para que **eu escolha o tipo de cuidado certo para a minha situação**.

**Acceptance Criteria**

1. Os 4 serviços estão presentes com títulos e subtítulos exatos: Acompanhamento hospitalar, Terceirização ILPI, Cuidado domiciliar continuado e Consultoria para famílias.
2. O CTA "Solicite uma visita" abre `wa.me/5511995604988` com a mensagem limpa.
3. Desktop fiel à screenshot; mobile empilhado e legível.
4. Ícones e imagens otimizados, com `alt` nos informativos.

### Story 1.7 — Como funciona?, Por que a Cuida? e frase de destaque (blocos F, G e H)

Como **visitante**,
quero **entender as etapas do atendimento e o diferencial da empresa**,
para que **eu saiba o que acontece depois de entrar em contato**.

**Acceptance Criteria**

1. Os 3 cards de "Como funciona?" usam o texto exato: Contato Inicial / Visita de Acolhimento – Proposta de plano / Início do atendimento – Acompanhamento contínuo.
2. O print do site no card "Contato Inicial" foi **substituído por um ícone limpo** no estilo dos ícones dos diferenciais, em desktop e mobile (FR11).
3. "Por que a Cuida?" e a frase "Quando cuidar de quem você ama exige mais do que amor, a Cuida entende." estão com o texto exato.
4. Fora a troca do ícone, o desktop é fiel à referência; o mobile é empilhado e legível.

### Story 1.8 — O que a Cuida faz? (bloco I)

Como **familiar**,
quero **ver em detalhe o que está incluído no cuidado**,
para que **eu saiba se atende a minha necessidade**.

**Acceptance Criteria**

1. Os 5 itens estão presentes com o texto exato: Nutrição, Transporte e tarefas, Serviços domésticos, Cuidados Essenciais e Terceirização para ILPI.
2. Desktop fiel à screenshot; mobile empilhado e legível.
3. Imagens e ícones otimizados, com `alt` nos informativos.

### Story 1.9 — Fale com a Cuida e rodapé (bloco J)

Como **visitante pronto para entrar em contato**,
quero **encontrar todos os canais da Cuida no fim da página**,
para que **eu escolha o canal que preferir**.

**Acceptance Criteria**

1. Telefone (11) 99560-4988, `contato.cuidahomecare@gmail.com`, Instagram `@cuidahomecare` e a avaliação no Google (`share.google/2A5HTlqv7qSVXIpPY`) estão publicados, apontando para os mesmos destinos de hoje.
2. Todos os links de WhatsApp da página usam a mensagem limpa, e o secundário `wa.me/5511915777784` está nos mesmos pontos de hoje (FR6).
3. Os itens "Experiência real / Equipe capacitada / Atendimento humanizado / Apoio à família", "Cursos e Palestras" e "Suporte ILPI" estão reproduzidos conforme a referência.
4. O link identificado na Story 1.2 (FR8) foi reproduzido no lugar certo, ou sua remoção foi aprovada pelo Lucas.
5. Links que são só ícone têm `aria-label` descritivo, e o foco é visível.
6. Nenhum canal novo foi adicionado (FR10).

### Story 1.10 — SEO on-page, Navegação Agêntica e página 404

Como **dono do negócio**,
quero **que o site seja bem entendido por buscadores e assistentes de IA**,
para que **famílias do ABC e região encontrem a Cuida**.

**Acceptance Criteria**

1. `<title>` com 50-60 caracteres, contendo "Cuida Home Care" e "ABC e região".
2. `meta description` com 150-160 caracteres e CTA.
3. `canonical` para `https://cuidahomecare.com/`, com `www` redirecionando para o apex; meta robots `index, follow, max-image-preview:large`; `theme-color` da marca; `lang="pt-BR"`.
4. Hierarquia de H2/H3 correta em toda a página.
5. `/llms.txt` com pelo menos 1 H1 e links, e `/llms-full.txt` com o texto de todos os blocos.
6. `robots.txt` liberando crawlers de IA, com a linha `Sitemap:`, e um `sitemap.xml` válido.
7. Página 404 personalizada, com os headers de segurança aplicados (verificado por `curl -I`).
8. `<!-- GTM slot -->` comentado no `<head>` e nenhum script de tracking (FR16).

---

## 8. Epic 2 — Performance comprovada e go-live

**Objetivo:** provar com números que o novo site cumpre as metas, conseguir o aceite do Lucas e trocar o domínio com segurança, com plano de rollback registrado antes da troca.

### Story 2.1 — Auditoria e ajuste de performance e acessibilidade

Como **ISKR**,
quero **medir o preview e ajustar até bater todas as metas**,
para que **o objetivo do projeto (de 56 para 90+) esteja comprovado antes do go-live**.

**Acceptance Criteria**

1. PageSpeed/Lighthouse **mobile** no preview: Desempenho ≥ 90, FCP < 1,5s, LCP < 1,5s, TBT < 100 ms, CLS < 0,1.
2. Lighthouse **desktop** registrado, sem regressão frente ao mobile.
3. Acessibilidade ≥ 87, com contraste AA verificado.
4. Relatórios de antes e depois guardados no repositório, com data.
5. Sem scroll horizontal em 360, 390, 768, 1280 e 1920 px, com evidência por breakpoint.

### Story 2.2 — Validação de fidelidade e aceite do Lucas

Como **Lucas**,
quero **revisar o preview contra o site atual e o mobile novo**,
para que **eu autorize a publicação sabendo exatamente o que vai ao ar**.

**Acceptance Criteria**

1. Checklist de fidelidade do desktop, bloco por bloco, contra as screenshots da Story 1.2, com cada divergência resolvida ou aprovada.
2. Layout mobile apresentado e aprovado.
3. Lista de melhorias anotadas nas Stories 1.x apresentada, com cada item aprovado, adiado ou descartado.
4. Se o cliente mandou logo e fotos originais, elas substituem o placeholder sem quebrar as metas da Story 2.1. Se não mandou, a decisão de publicar com placeholder fica registrada.
5. Todos os CTAs testados no preview: WhatsApp (com a mensagem correta), Trabalhe conosco, e-mail, Instagram e avaliação Google.
6. Aceite do Lucas registrado na story.

### Story 2.3 — Cutover do domínio e validação em produção

Como **cliente Cuida Home Care**,
quero **que `cuidahomecare.com` passe a servir o novo site**,
para que **meus clientes tenham a experiência rápida a partir de agora**.

**Acceptance Criteria**

1. **Antes** da troca, a configuração atual de DNS (registrador, nameservers e registros) está documentada como plano de rollback.
2. Reconfirmado que não existe e-mail no domínio (o contato publicado é um Gmail), então não há MX a preservar.
3. O domínio foi configurado no projeto da **conta Vercel do cliente**, e o apontamento foi feito conforme a decisão do @devops.
4. HTTPS ativo e `www` redirecionando para o apex.
5. Em produção: headers em todas as rotas, cache dos assets, 404, `llms.txt`, `robots.txt` e `sitemap.xml` acessíveis.
6. PageSpeed mobile **em produção** com Desempenho ≥ 90 e FCP e LCP < 1,5s, com relatório guardado.
7. Todos os CTAs testados em produção, num celular real.

---

## 9. Checklist Results Report (pm-checklist)

**Resumo:** completude estimada de **~93%** após a verificação no site no ar. Escopo do MVP **adequado**, prontidão para arquitetura **Ready**.

| Categoria                        | Status  | Observações                                                                              |
| -------------------------------- | ------- | ---------------------------------------------------------------------------------------- |
| 1. Problem Definition & Context  | PASS    | Problema quantificado, com causa raiz comprovada                                         |
| 2. MVP Scope Definition          | PASS    | Escopo e fora de escopo explícitos, com duas trocas aprovadas                            |
| 3. User Experience Requirements  | PASS    | Conversão por link externo, sem formulário. O layout mobile será desenhado (intencional) |
| 4. Functional Requirements       | PASS    | FRs testáveis, com números, URLs e textos verificados no DOM                             |
| 5. Non-Functional Requirements   | PASS    | Metas numéricas de performance, acessibilidade, headers, repositório e hospedagem        |
| 6. Epic & Story Structure        | PASS    | Sequencial, com o Epic 1 cobrindo setup e todos os blocos reais                          |
| 7. Technical Guidance            | PASS    | Resultado fechado (90+ e responsivo) e stack livre, com recomendação registrada          |
| 8. Cross-Functional Requirements | PASS    | Sem integração de dados. Nenhum dado pessoal trafega pelo site                           |
| 9. Clarity & Communication       | PARTIAL | Aprovador definido. Acesso ao registrador do domínio ainda pendente (adiado pelo Lucas)  |

**Pontos em aberto (não bloqueiam a arquitetura):**

1. **Fotos e logo em alta:** pedidos ao cliente. Se não chegarem, o site sobe com placeholder (Story 2.2).
2. **Segundo Google Forms** (`qqBkfBjv5uq4Qukv9`): identificar na página (Story 1.2 / FR8).
3. **Acesso ao registrador** do domínio para o cutover (adiado, Story 2.3).

**Decisão final:** ✅ **READY FOR ARCHITECT**

---

## 10. Divergências entre o briefing e o site no ar

Verificado no DOM renderizado em 17/09/2026. **O site no ar prevalece.**

| #   | O briefing dizia                                                                                               | O site mostra                                                                                          | Efeito no PRD                                                                                 |
| --- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| 1   | O hero tem um formulário nativo (Nome, Telefone, Quem precisa de cuidados, Cidade) que alimenta o Google Forms | **Não existe formulário nenhum** na página. O CTA do hero é WhatsApp                                   | FR4 e FR5 reescritos. Caiu toda a integração via POST, o fallback e a mensagem de confirmação |
| 2   | `forms.gle/6UT8xqQmGfVTc1Pv5` capta leads de clientes                                                          | Esse Forms é o **"Trabalhe conosco!"**, ou seja, recrutamento                                          | FR7                                                                                           |
| 3   | Seções conhecidas: hero, 4 diferenciais e "Como funciona?"                                                     | **10 blocos** (§2), incluindo Nossos serviços, Por que a Cuida?, O que a Cuida faz? e Fale com a Cuida | §2 e as Stories 1.4 a 1.9                                                                     |
| 4   | "Não há e-mail no domínio"                                                                                     | Correto quanto ao domínio, mas a página **publica** `contato.cuidahomecare@gmail.com`                  | FR9. O cutover de DNS segue seguro                                                            |
| 5   | Contatos: só os dois WhatsApp                                                                                  | Também Instagram e link de avaliação no Google                                                         | FR9 e FR10                                                                                    |
| 6   | —                                                                                                              | Existe um **segundo Google Forms** (`qqBkfBjv5uq4Qukv9`) ligado a um ícone sem texto                   | FR8 e Story 1.2                                                                               |

---

## 11. Next Steps

### 11.1 UX Expert Prompt

@ux-design-expert: use `docs/prd.md` como base. Desenhe o **layout mobile responsivo** (360–768 px) da página única da Cuida Home Care, para os 10 blocos da §2. O desktop é o alvo de fidelidade e **não deve ser redesenhado**. Preserve conteúdo, ordem, marca e CTAs (WhatsApp, Trabalhe conosco, e-mail, Instagram, avaliação Google), priorizando legibilidade e toque confortável. Proponha também o ícone do card "Contato Inicial", no estilo dos ícones dos diferenciais.

### 11.2 Architect Prompt

@architect: use `docs/prd.md` como base. Defina a arquitetura da página única na Vercel do cliente, com repositório no GitHub `iskarockets`. A stack é livre (Next.js liberado pelo Lucas), desde que entregue **PageSpeed mobile 90+, FCP e LCP < 1,5s e mobile responsivo** (NFR1 e NFR7). Se escolher Next.js, justifique como evita JS de render desnecessário. Defina também a estrutura do repositório, os pipelines reproduzíveis de fontes `.woff2` subset e imagens WebP/AVIF, o `vercel.json` (headers e cache), a estratégia de CSS crítico e os quality gates adaptados ao contexto estático.

---

## Apêndice A — Requisitos técnicos fixos (colado do briefing, padrão de toda LP)

### 7.1 SEO on-page

- [ ] `<title>` 50-60 chars: "Cuida Home Care" + "ABC e região" (é service area business, **sem ponto fixo** — manter a área como já está no Google, sem inventar endereço)
- [ ] `<h1>` único, nome real **em texto puro** (não só dentro do logo)
- [ ] `meta description` 150-160 chars com CTA
- [ ] `<link rel="canonical">` pro domínio definitivo
- [ ] `meta robots: index, follow, max-image-preview:large`
- [ ] charset UTF-8, viewport, `theme-color`, `lang="pt-BR"`
- [ ] HTML semântico: header/nav/main/section/footer, hierarquia H2/H3

### 7.2 Performance (o objetivo do projeto)

- [ ] **Responsividade real** (o site atual não tem): mobile-first, breakpoints funcionando, sem scroll horizontal, toque confortável. Testar em 360px, 390px, 768px, 1280px, 1920px
- [ ] Zero framework de render no cliente. HTML estático servido pronto
- [ ] CSS crítico inline no `<head>`, resto adiado
- [ ] Fontes `.woff2` subset + `font-display: swap` + preload só do hero
- [ ] Imagens WebP/AVIF, dimensões explícitas, lazy fora do hero, `fetchpriority=high` no LCP
- [ ] Cache `immutable` de 1 ano pra `/assets/*` no `vercel.json`
- [ ] Meta de laboratório (Moto G / 4G): FCP e LCP < 1,5s · TBT < 100ms · CLS < 0,1 · Desempenho 90+

### 7.3 Navegação Agêntica 3/3

- [ ] `/llms.txt` na raiz, Markdown, **pelo menos 1 H1 + links** (hoje o site está 1/2 por não ter)
- [ ] `/llms-full.txt` expandido com o texto das seções
- [ ] `robots.txt` liberando crawlers de IA + linha `Sitemap:`

### 7.4 Acessibilidade (hoje está 87 — manter ou subir)

- [ ] Contraste AA, `alt` em toda imagem informativa, foco visível, labels em links de ícone (WhatsApp), ordem de heading correta

### 7.5 Segurança / headers

- [ ] `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security` aplicados ao site inteiro (não só `/`)
- [ ] Página 404 personalizada
