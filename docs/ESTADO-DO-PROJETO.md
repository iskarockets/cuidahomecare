# Estado do projeto — Cuida Home Care

**Última atualização:** 18/09/2026, fim do dia.
**Situação:** site novo **no ar e funcionando**. Falta uma coisa só, e ela depende de um acesso
que o cliente ainda não passou.

Este documento é o ponto de retomada. Se você voltar daqui a duas semanas sem lembrar de nada,
leia só ele.

---

## 1. Onde as coisas estão

| O quê             | Onde                                                             |
| ----------------- | ---------------------------------------------------------------- |
| Código            | `github.com/iskarockets/cuidahomecare` — **público** (ver §5)    |
| Hospedagem        | Vercel, **conta do cliente** (`cuida-home-care1`), plano Hobby   |
| URL da Vercel     | `cuidahomecare.vercel.app`                                       |
| Domínio principal | `www.cuidahomecare.com.br` — registro.br, nameservers da Vercel  |
| Domínio antigo    | `cuidahomecare.com` — **ainda serve o Canva**, painel sem acesso |
| Deploy            | Automático: todo push em `main` republica                        |

---

## 2. O que está no ar e foi verificado

Conferido em produção em 18/09, não em ambiente local:

| Item                                              | Estado          |
| ------------------------------------------------- | --------------- |
| `www.cuidahomecare.com.br` serve o site           | ✅ 200          |
| `cuidahomecare.com.br` → www                      | ✅ 308          |
| HTTPS / certificado                               | ✅              |
| `canonical` → `https://www.cuidahomecare.com.br/` | ✅              |
| `sitemap.xml`, `robots.txt`, `llms.txt`           | ✅ domínio novo |
| Headers de segurança (os 3 do `vercel.json`)      | ✅              |
| Página 404 responde 404 de verdade                | ✅              |
| PageSpeed mobile real                             | ✅ **98**       |
| Acessibilidade (axe-core, 360/768/1500px)         | ✅ 0 violações  |
| Responsividade mobile                             | ✅              |
| JavaScript no bundle                              | ✅ zero         |

---

## 3. A única pendência: redirecionar o `.com`

### Por que importa

Hoje existem **dois sites idênticos no ar**:

```
cuidahomecare.com      → 103.169.142.0   (Canva, site antigo, lento)
cuidahomecare.com.br   → 64.29.17.65     (Vercel, site novo)
```

O Google vê conteúdo duplicado, e o `.com` é o que tem todo o histórico — então ele tende a
ganhar. Na prática: quem procura a Cuida continua caindo no site antigo.

### O que trava

Ninguém tem acesso ao painel do `.com`. É registrado via **Tucows/revendedor** e a suspeita
forte é que tenha sido comprado **dentro do Canva**. Se for isso, o painel fica em
`canva.com → Configurações → Domínios`, não num registrador separado — é onde ninguém pensa em
procurar, e é onde essa conversa costuma travar por dias.

O acesso já foi pedido ao cliente (18/09).

### O que fazer quando o acesso chegar

1. **Na Vercel:** _Settings → Domains → Add_ → `cuidahomecare.com`, e configurar como
   **redirect** para `www.cuidahomecare.com.br`. A Vercel faz 308 preservando o caminho, que o
   Google trata como 301.
2. **No painel do `.com`:** apontar o `A` do apex e o `www` para os valores que a Vercel mostrar
   na tela (não valores de tutorial — eles mudam).
3. 🚨 **NÃO ENCOSTE NO MX.** O `.com` tem `MX 1 smtp.google.com` **ativo**. Mexer nele derruba o
   e-mail do cliente. Trocar **só** o `A` e o `www` — nunca os nameservers, nunca o MX.

Passo a passo completo: `docs/guias/migracao-com-br.md` e `docs/guias/dns-cutover.md`.

> **Fora do escopo ISKR** (decisão do Lucas, 18/09): Search Console, Perfil da Empresa no Google
> e bio do Instagram são do cliente. Ficam registrados em `migracao-com-br.md` §7–8 caso alguém
> pergunte.

---

## 4. Pendências de formalidade (não afetam o site)

- **Story 2.2** (`docs/stories/2.2.validacao-aceite.md`) está `Approved` mas sem aceite escrito.
  Na prática o Lucas validou bloco a bloco nas rodadas de correção visual de 17–18/09. Se
  quiser encerrar o Epic 2 formalmente, o `@po` fecha com base nisso.
- **Story 2.3** (cutover) segue aberta até o `.com` redirecionar.
- **Fontes substituídas.** As originais do Canva vinham com a tabela `name` zerada — literalmente
  impossível de identificar. Foram trocadas por **Playfair Display + Poppins** (SIL OFL, uso
  comercial livre). O Lucas aprovou o visual, mas isso nunca foi confirmado explicitamente como
  "as fontes estão ok". Se o cliente perguntar "a fonte mudou?", a resposta é sim, e o motivo é
  esse.
- **`docs/DIVERGENCIAS-BRIEFING.md`** — 7 divergências entre o briefing e o site real, para o
  Lucas levar ao `@secretaria`. São falhas do briefing, não do site.
- Um segundo Google Forms (`qqBkfBjv5uq4Qukv9`) foi encontrado no site antigo e nunca
  identificado. Não foi replicado no site novo.
- Typos do texto original foram **preservados de propósito** (fidelidade). Corrigir é decisão do
  cliente.

---

## 5. Armadilhas — leia antes de mexer em qualquer coisa

### 🚨 O repositório é público de propósito

A Vercel plano Hobby **bloqueia deploy quando o autor do commit não é membro da conta**. O
código é commitado pela ISKR, a conta Vercel é do cliente — o autor nunca bate. No Hobby não dá
para adicionar membro. A trava vale **só para repositório privado**, então o repo foi tornado
público e o deploy voltou a funcionar.

**Se alguém fechar o repo de novo, o deploy quebra em silêncio:** a Vercel continua registrando
o deployment no GitHub, mas com status `failure`, e o site fica servindo o build antigo. Foi
exatamente assim que 5 commits ficaram 4 horas fora do ar em 18/09 sem ninguém perceber.

Auditoria feita antes de abrir: nenhuma credencial em nenhum commit do histórico.

Para conferir se um commit realmente foi ao ar:

```bash
gh api repos/iskarockets/cuidahomecare/commits/<sha>/status
```

### 🚨 O domínio está em um lugar só

`site.config.mjs` é a fonte única. Dele derivam canonical, sitemap, robots, llms.txt e o gate de
links. Trocar o domínio é **mudar uma linha** e rodar o build.

O valor tem `www` porque é o www que responde 200 e o apex que redireciona. **Se algum dia a
Vercel for invertida** (apex como Production, www como redirect), esta linha tem que ser
invertida junto — senão o canonical aponta para um endereço que redireciona, que é sinal
contraditório para o Google.

### 🚨 Autoridade de agentes

`git push`, PR e infra são **exclusivos do @devops**. Código é do `@dev`. Isso foi violado uma
vez neste projeto e o Lucas reclamou com razão.

---

## 6. Como retomar

```bash
cd "C:/Users/Lucas/projetos aios/lpcuidahomecare"

npm install
npm run dev        # servidor local
npm run build      # build + gate de links
npm run lint
npm run typecheck
```

O gate `scripts/check-links.mjs` roda junto do build e falha se aparecer âncora quebrada, canal
de contato não declarado em `src/data/contatos.ts`, querystring de WhatsApp corrompida ou `<img>`
sem `alt`. Ele é a barreira contra as regressões que já aconteceram uma vez.

**Documentos por assunto:**

| Preciso de…                | Arquivo                               |
| -------------------------- | ------------------------------------- |
| Requisitos e escopo        | `docs/prd.md`                         |
| Decisões técnicas (ADRs)   | `docs/architecture.md`                |
| Layout mobile por bloco    | `docs/front-end-spec-mobile.md`       |
| Como o deploy funciona     | `docs/guias/deploy-vercel-cliente.md` |
| Passo a passo do `.com`    | `docs/guias/migracao-com-br.md`       |
| Cuidados de DNS / e-mail   | `docs/guias/dns-cutover.md`           |
| O que divergiu do briefing | `docs/DIVERGENCIAS-BRIEFING.md`       |
| Gates de qualidade         | `docs/qa/gates/`                      |

---

## 7. Decisões que valem lembrar

| Decisão                                        | Quando | Por quê                                                          |
| ---------------------------------------------- | ------ | ---------------------------------------------------------------- |
| Astro em vez de Next.js                        | 17/09  | Site estático puro; zero JS no cliente (ADR-001)                 |
| Repositório na ISKR, nunca na conta pessoal    | 17/09  | Regra fixa do Lucas para trabalho de cliente                     |
| Vercel Hobby na conta do cliente               | 18/09  | Volume de acesso baixo; risco de uso comercial aceito            |
| Repositório público                            | 18/09  | Única saída gratuita para o deploy funcionar (§5)                |
| `.com.br` como principal, `.com` como redirect | 18/09  | Domínio novo do cliente; o `.com` preserva o histórico           |
| Acessibilidade acima de fidelidade visual      | 17/09  | Autorizado pelo Lucas: "pode rodar sim, mesmo que mude um pouco" |
| WhatsApp secundário removido                   | 18/09  | Não existia no site real — veio errado no briefing               |
| Fontes substituídas                            | 17/09  | Originais impossíveis de identificar (§4)                        |

---

## 8. O que NÃO fazer

- ❌ Tornar o repositório privado (quebra o deploy silenciosamente)
- ❌ Mexer no MX do `.com` (derruba o e-mail do cliente)
- ❌ Trocar os nameservers do `.com` (mesmo efeito)
- ❌ Escrever o domínio direto no código em vez de `site.config.mjs`
- ❌ Deixar o `.com` expirar depois do redirect — o redirect só vale enquanto for de vocês
